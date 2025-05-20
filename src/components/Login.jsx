import { Suspense, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import MovingStars from "./MovingStars";
import { Canvas } from "@react-three/fiber";
import Leaderboard from "./LeaderBoard";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedAvatarUrl = localStorage.getItem("avatarUrl");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername && savedAvatarUrl && savedPassword) {
      onLogin(savedUsername, savedAvatarUrl);
    }
  }, [onLogin]);

  // ✅ Check username existence while typing (debounced)
  useEffect(() => {
    if (!username.trim()) {
      setUsernameExists(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setCheckingUsername(true);
      const trimmedUsername = username.trim().toLowerCase();
      const userRef = doc(collection(db, "players"), trimmedUsername);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
      setCheckingUsername(false);
    }, 500); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const userRef = doc(collection(db, "players"), trimmedUsername);

    try {
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.password === trimmedPassword) {
          onLogin(trimmedUsername, userData.avatarUrl);
          localStorage.setItem("username", trimmedUsername);
          localStorage.setItem("avatarUrl", userData.avatarUrl);
          localStorage.setItem("password", userData.password);
        } else {
          setError("Incorrect password for existing user");
        }
      } else {
        const avatarUrl = `https://avatar.iran.liara.run/public?${trimmedUsername}`;
        await setDoc(userRef, {
          username: trimmedUsername,
          avatarUrl,
          password: trimmedPassword,
          highScore: 0,
        });

        onLogin(trimmedUsername, avatarUrl);
        localStorage.setItem("username", trimmedUsername);
        localStorage.setItem("avatarUrl", avatarUrl);
        localStorage.setItem("password", trimmedPassword);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex"
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <div className="login-container">
        <h2>Enter Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a unique username"
        />
        {checkingUsername && <p>Checking availability...</p>}
        {!checkingUsername && usernameExists && !password && (
          <p className="error">
            Username already taken, Ignore if it yours 😅😁
          </p>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleLogin}>Start Game</button>
        {error && <p className="error">{error}</p>}
      </div>

      <Canvas>
        <Suspense fallback={null}>
          <MovingStars />
        </Suspense>
        <Leaderboard />
      </Canvas>
    </div>
  );
}

export default Login;
