import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, PositionalAudio } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import SpaceshipModel from "./SpaceshipModel";
import Planet from "./Planet";
import MovingStars from "./MovingStars";
import "../css/game.css";

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
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedShip, setSelectedShip] = useState(
    localStorage.getItem("selectedShip") || SPACESHIPS[0].modelPath
  );

  function handleSpaceshipSelect(modelPath) {
    setSelectedShip(modelPath);
    localStorage.setItem("selectedShip", modelPath);
  }

  useEffect(() => {
    const savedHighScore = parseInt(localStorage.getItem("highScore")) || 0;
    setHighScore(savedHighScore);
  }, []);

  const gameOverSoundRef = useRef();

  const playGameoverSound = () => {
    if (gameOverSoundRef.current && !gameOverSoundRef.current.isPlaying) {
      gameOverSoundRef.current.play();
    }
  };

  useEffect(() => {
    if (gameOverSoundRef.current) {
      gameOverSoundRef.current.setVolume(1);
    }
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
  }, [score, highScore]);

  const handleGameOver = () => {
    setGameOver(true);
    playGameoverSound();
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  return (
    <Canvas
      camera={{ position: [0, 10, 20], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000"); // pure black background
      }}
    >
      {/* Basic Lighting */}
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* Moving Stars */}
      <Suspense fallback={null}>
        <MovingStars />
      </Suspense>

      {/* Spaceship Model */}
      {!gameOver && gameStarted && (
        <SpaceshipModel
          onGameOver={handleGameOver}
          score={score}
          setScore={setScore}
          speed={0.3}
          modelPath={selectedShip}
        />
      )}

      {/* Start Overlay */}
      {!gameStarted && (
        <Html center>
          <div className="start-overlay">
            <h1>🚀 Space Explorer</h1>
            <p>Are you ready for an epic space adventure?</p>
            <p>High Score : {highScore}</p>
            <button onClick={handleGameStart}>Start Game</button>
          </div>
          <div class="spaceship-selection">
            <h2>Choose Your Spaceship</h2>
            <div class="spaceship-buttons">
              {SPACESHIPS.map((ship) => (
                <button
                  key={ship.id}
                  class={`spaceship-button ${
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

      <PositionalAudio
        ref={gameOverSoundRef}
        url="/sound-effects/gameover.mp3"
        distance={10}
        loop={false}
      />

      <Html topLeft></Html>

      {/* <OrbitControls /> */}
    </Canvas>
  );
}
