import { createContext, useContext, useRef, useState } from "react";
import * as THREE from "three";

const GameLogicContext = createContext();

function GameLogicProvider({ children }) {
  const [position, setPosition] = useState([0, 0, 0]);

  const keys = useRef({ w: false, a: false, s: false, d: false, " ": false });
  const shipRef = useRef();
  const [bullets, setBullets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [health, setHealth] = useState(10);
  const [paused, setPaused] = useState(false);

  const bulletSpeed = 0.8;
  const laserSoundRef = useRef();
  const laughSoundRef = useRef();
  const hitSoundRef = useRef();
  const bgSoundRef = useRef();
  const spaceshipExplosionSoundRef = useRef();
  const asteroidExplosionSoundRef = useRef();

  function getObstacleSpeedAndCount(score) {
    if (score >= 500) return { speed: 0.6, count: 80 };
    if (score >= 400) return { speed: 0.5, count: 70 };
    if (score >= 300) return { speed: 0.4, count: 50 };
    if (score >= 200) return { speed: 0.3, count: 40 };
    if (score >= 100) return { speed: 0.2, count: 30 };
    return { speed: 0.1, count: 15 };
  }

  // SOUND_EFFECTS //
  const playBGSound = () => {
    if (bgSoundRef.current && !bgSoundRef.current.isPlaying) {
      bgSoundRef.current.play();
    }
  };
  const playAsteroidExplosionSound = () => {
    if (
      asteroidExplosionSoundRef.current &&
      !asteroidExplosionSoundRef.current.isPlaying
    ) {
      asteroidExplosionSoundRef.current.play();
    }
  };
  const playHitSound = () => {
    if (hitSoundRef.current && !hitSoundRef.current.isPlaying) {
      hitSoundRef.current.play();
    }
  };

  // Laser Sound
  const playLaserSound = () => {
    if (laserSoundRef.current && !laserSoundRef.current.isPlaying) {
      laserSoundRef.current.play();
    }
  };
  // Laugh Sound
  const playLaughSound = () => {
    if (laughSoundRef.current && !laughSoundRef.current.isPlaying) {
      laughSoundRef.current.play();
    }
  };

  // Spaceship Explosion Sound
  const playSpaceshipExplosionSound = () => {
    if (
      spaceshipExplosionSoundRef.current &&
      !spaceshipExplosionSoundRef.current.isPlaying
    ) {
      spaceshipExplosionSoundRef.current.play();
    }
  };

  // Obstacle Generation
  function getRandomObstaclePosition(
    spawnRadius = 40,
    minDepth = -60,
    maxDepth = -20
  ) {
    const angleXY = Math.random() * Math.PI * 2;
    const distanceXY = Math.random() * spawnRadius;
    const offsetX = Math.cos(angleXY) * distanceXY;
    const offsetY = Math.sin(angleXY) * distanceXY;
    const offsetZ = Math.random() * (maxDepth - minDepth) + minDepth;
    return new THREE.Vector3(offsetX, offsetY, offsetZ);
  }

  function checkCollision(pos1, size1, pos2, size2) {
    return pos1.distanceTo(pos2) < size1 + size2 + 1;
  }

  return (
    <GameLogicContext.Provider
      value={{
        position,
        setPosition,
        keys,
        shipRef,
        bullets,
        setBullets,
        obstacles,
        setObstacles,
        health,
        setHealth,
        paused,
        setPaused,
        bulletSpeed,
        laserSoundRef,
        laughSoundRef,
        hitSoundRef,
        bgSoundRef,
        spaceshipExplosionSoundRef,
        asteroidExplosionSoundRef,
        getObstacleSpeedAndCount,
        playBGSound,
        playAsteroidExplosionSound,
        playHitSound,
        playLaserSound,
        playLaughSound,
        playSpaceshipExplosionSound,
        getRandomObstaclePosition,
        checkCollision,
      }}
    >
      {children}
    </GameLogicContext.Provider>
  );
}

function useGameLogic() {
  const context = useContext(GameLogicContext);
  if (context === undefined)
    throw new Error("Context used outside of provider");
  return context;
}

export { GameLogicProvider, useGameLogic };
