import { Canvas } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  PositionalAudio,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import SpaceshipModel from "./SpaceshipModel";
import Planet from "./Planet";
import MovingStars from "./MovingStars";
import "../css/game.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Leaderboard from "./LeaderBoard";

const SPACESHIPS = [
  { id: 1, name: "Falcon", modelPath: "/models/spaceships/spaceship1.glb" },
  { id: 2, name: "Destroyer", modelPath: "/models/spaceships/spaceship2.glb" },
  {
    id: 3,
    name: "Interceptor",
    modelPath: "/models/spaceships/spaceship3.glb",
  },
];

export default function Scene() {
  SPACESHIPS.forEach((ship) => useGLTF.preload(ship.modelPath));

  // --------------------------
  // 🔵 State
  // --------------------------
  const username = localStorage.getItem("username");
  const avatarUrl = localStorage.getItem("avatarUrl");

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedShip, setSelectedShip] = useState(
    localStorage.getItem("selectedShip") || SPACESHIPS[0].modelPath
  );
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const gameOverSoundRef = useRef();

  // --------------------------
  // 🔧 Handlers / Functions
  // --------------------------
  const handleGameStart = () => setGameStarted(true);

  const handleGameOver = () => {
    setGameOver(true);
    playGameoverSound();
  };

  const handleSpaceshipSelect = (modelPath) => {
    setSelectedShip(modelPath);
    localStorage.setItem("selectedShip", modelPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("password");
    window.location.reload();
  };

  const playGameoverSound = () => {
    if (gameOverSoundRef.current && !gameOverSoundRef.current.isPlaying) {
      gameOverSoundRef.current.play();
    }
  };

  const updateHighScore = async () => {
    const userRef = doc(db, "players", username);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentHigh = userSnap.data().highScore || 0;
      if (score > currentHigh) {
        await updateDoc(userRef, { highScore: score });
        console.log("High score updated!");
      } else {
        console.log("Score not higher than current high score");
      }
    } else {
      console.warn("User not found in database");
    }
  };

  const getHighScore = async (username) => {
    try {
      const userRef = doc(db, "players", username);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data().highScore || 0 : 0;
    } catch (error) {
      console.error("Error fetching high score:", error);
      return 0;
    }
  };

  // --------------------------
  // 🌀 Effects
  // --------------------------
  useEffect(() => {
    const fetchScore = async () => {
      const score = await getHighScore(username);
      setHighScore(score);
    };
    if (username) fetchScore();
  }, [username]);

  useEffect(() => {
    if (gameOverSoundRef.current) {
      gameOverSoundRef.current.setVolume(1);
    }
  }, []);

  // --------------------------
  // 🎮 Render
  // --------------------------
  return (
    <Canvas
      camera={{ position: [0, 10, 20], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#000000")}
    >
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      <Suspense
        fallback={
          <Html center>
            <h2>Loading Scene...</h2>
          </Html>
        }
      >
        <MovingStars />
      </Suspense>

      {!gameOver && gameStarted && (
        <Suspense
          fallback={
            <Html center>
              <h2>Loading Spaceship...</h2>
            </Html>
          }
        >
          <SpaceshipModel
            onGameOver={handleGameOver}
            score={score}
            setScore={setScore}
            speed={0.3}
            modelPath={selectedShip}
            updateHighScore={updateHighScore}
          />
        </Suspense>
      )}

      {/* Start Overlay */}
      {!gameStarted && (
        <Html center>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <button
            onClick={() => {
              setShowLeaderBoard((LB) => !LB);
            }}
            className="leaderboard-button"
          >
            Leaderboard
          </button>

          <div className="start-overlay">
            <h1>🚀 Space Explorer</h1>
            <p>Ready to destroy asteroids and save the galaxy? 😎</p>
            <div
              className="avatar-username"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={avatarUrl}
                alt={`${username} avatar`}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "12px",
                  boxShadow: "0 0 5px #0ff",
                }}
              />
              <p style={{ margin: 0, fontWeight: "500" }}>
                Hey {username?.toUpperCase()}! High score: {highScore}. Beat
                that! 🚀
              </p>
            </div>

            <button onClick={handleGameStart} style={{ marginTop: "20px" }}>
              Let’s Go! 🚀
            </button>
          </div>

          <div className="spaceship-selection">
            <h2>Choose Your Spaceship</h2>
            <div className="spaceship-buttons">
              {SPACESHIPS.map((ship) => (
                <button
                  key={ship.id}
                  className={`spaceship-button ${
                    selectedShip === ship.modelPath ? "selected" : ""
                  }`}
                  onClick={() => handleSpaceshipSelect(ship.modelPath)}
                >
                  {ship.name}
                </button>
              ))}
            </div>
          </div>
        </Html>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <Html center>
          <div className="game-over-card">
            <h1>GAME OVER</h1>
            <p>Your Score was : {score}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </Html>
      )}

      {/* Game Over Sound */}
      <PositionalAudio
        ref={gameOverSoundRef}
        url="/sound-effects/gameover.mp3"
        distance={10}
        loop={false}
      />
      {showLeaderBoard && (
        <Leaderboard position="left" setShowLeaderBoard={setShowLeaderBoard} />
      )}
    </Canvas>
  );
}
