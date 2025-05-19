// src/components/Login.js
import { useState } from "react";
import { db } from "../firebase";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    const trimmedUsername = username.trim().toLowerCase();
    const userRef = doc(collection(db, "players"), trimmedUsername);

    try {
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        onLogin(trimmedUsername, userSnapshot.data().avatarUrl);
      } else {
        // Generate a unique avatar URL based on the username
        const avatarUrl = `https://avatars.dicebear.com/api/bottts/${trimmedUsername}.svg`;

        await setDoc(userRef, {
          username: trimmedUsername,
          avatarUrl,
          highScore: 0,
        });

        onLogin(trimmedUsername, avatarUrl);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred, please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Enter Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter a unique username"
      />
      <button onClick={handleLogin}>Start Game</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
