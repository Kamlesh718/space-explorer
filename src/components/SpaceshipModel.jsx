/**
 * SpaceshipModel Component
 * ------------------------
 * This component handles the entire gameplay logic and rendering for a 3D spaceship shooter game using React Three Fiber.
 *
 * Props:
 * - onGameOver: callback function triggered when the spaceship health reaches zero.
 * - score: current player score.
 * - setScore: function to update the score.
 * - speed: movement speed of the spaceship.
 * - obstacleSize: maximum size of obstacles.
 * - modelPath: path to the spaceship model used for positioning bullets.
 *
 * Key Functionalities:
 *
 * - useLoader: Loads asteroid textures for obstacles.
 * - useState & useRef: Manages spaceship position, bullets, obstacles, health, pause state, and key presses.
 * - useEffect:
 *    - Plays and sets volume for sound effects on mount.
 *    - Initializes spaceship position.
 *    - Generates initial obstacles with random positions, sizes, and textures.
 *    - Handles keyboard events for movement, shooting, and pausing.
 * - getRandomObstaclePosition: Generates random positions in a cylindrical spawn area for obstacles.
 * - getObstacleSpeedAndCount: Returns obstacle speed and count based on current score thresholds.
 * - playSound & specific play functions: Plays various sound effects (laser, explosion, background music, etc.).
 * - checkCollision: Detects collisions between objects based on their positions and sizes.
 * - useFrame (Game Loop):
 *    - Updates spaceship position and rotation based on WASD keys.
 *    - Moves bullets forward, removes bullets out of range.
 *    - Moves obstacles toward the player, detects collisions with spaceship and bullets.
 *    - Handles health reduction, plays sounds on hits, and respawns obstacles.
 * - Conditional rendering of Pause button and overlay with Html component.
 * - Renders Spaceship, Bullets, Obstacles, PositionalAudio, HealthBar, and Score components.
 *
 * Pause functionality:
 * - When `paused` state is true:
 *    - The game loop (movement, bullet firing, obstacle updates) is halted.
 *    - Bullets are not fired on spacebar press.
 *    - An overlay pause UI is shown with a button to resume.
 */

import { Cloud, Html, PositionalAudio, SpotLight } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Spaceship from "./Spaceship";
import Bullets from "./Bullets";
import Obstacle from "./Obstacle";
import HealthBar from "./HealthBar";
import Score from "./Score";
import "../css/game.css";

function SpaceshipModel({
  onGameOver,
  score,
  setScore,
  speed = 0.5,
  obstacleSize = 1,
  modelPath,
  updateHighScore,
}) {
  const asteroidTextures = useLoader(THREE.TextureLoader, [
    "/textures/asteroid_texture1.jpg",
    "/textures/asteroid_texture2.png",
    "/textures/asteroid_texture3.png",
    "/textures/asteroid_texture4.png",
  ]);

  // State for Spaceship Position
  const [position, setPosition] = useState([0, 0, 0]);
  const { camera } = useThree();

  // Track key presses for spaceship controls
  const keys = useRef({ w: false, a: false, s: false, d: false, " ": false });

  // Reference to the spaceship model
  const shipRef = useRef();

  // State for bullets, obstacles, health, and pause status
  const [bullets, setBullets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [health, setHealth] = useState(100);
  const [paused, setPaused] = useState(false);

  const [muted, setMuted] = useState(false);

  // To mute the bgSounds
  const toggleMute = (e) => {
    e.currentTarget.blur();
    if (bgSoundRef.current) {
      if (muted) {
        bgSoundRef.current.setVolume(2); // Unmute
        bgSoundRef.current.play(); // Ensure it resumes if paused
      } else {
        bgSoundRef.current.setVolume(0); // Mute
      }
      setMuted((prev) => !prev);
    }
  };

  // Bullet Speed
  const bulletSpeed = 0.8;

  // References for various sound effects
  const laserSoundRef = useRef();
  const laughSoundRef = useRef();
  const hitSoundRef = useRef();
  const bgSoundRef = useRef();
  const spaceshipExplosionSoundRef = useRef();
  const asteroidExplosionSoundRef = useRef();

  // Returns obstacle speed and count based on score thresholds
  function getObstacleSpeedAndCount(score) {
    if (score >= 500) return { speed: 0.6, count: 80 };
    if (score >= 400) return { speed: 0.5, count: 70 };
    if (score >= 300) return { speed: 0.4, count: 50 };
    if (score >= 200) return { speed: 0.3, count: 40 };
    if (score >= 100) return { speed: 0.2, count: 30 };
    return { speed: 0.1, count: 15 };
  }

  // Get obstacle speed and count based on current score
  const { speed: obstacleSpeed, count: noOfObstacles } =
    getObstacleSpeedAndCount(score);

  // Play sound if not already playing, using the given sound reference
  const playSound = (soundRef) => {
    if (soundRef.current && !soundRef.current.isPlaying) {
      soundRef.current.play();
    }
  };

  // Wrapper functions to play specific sounds
  const playBGSound = () => playSound(bgSoundRef);
  const playAsteroidExplosionSound = () => playSound(asteroidExplosionSoundRef);
  const playHitSound = () => playSound(hitSoundRef);
  const playLaserSound = () => playSound(laserSoundRef);
  // const playSpaceshipExplosionSound = () =>
  //   playSound(spaceshipExplosionSoundRef);

  // Initialize and set volume for all sounds once on mount
  useEffect(() => {
    playBGSound();
    if (bgSoundRef.current) {
      bgSoundRef.current.setVolume(2);
    }
    if (laserSoundRef.current) {
      laserSoundRef.current.setVolume(1);
    }

    if (laughSoundRef.current) {
      laughSoundRef.current.setVolume(0.5);
    }

    if (hitSoundRef.current) {
      hitSoundRef.current.setVolume(2);
    }
    if (asteroidExplosionSoundRef.current) {
      asteroidExplosionSoundRef.current.setVolume(1.5);
    }
    if (spaceshipExplosionSoundRef.current) {
      spaceshipExplosionSoundRef.current.setVolume(0.2);
    }
  }, []);

  // Set initial spaceship position
  useEffect(() => {
    if (shipRef.current) {
      shipRef.current.position.set(0, -2, 8);
    }
  }, []);

  // Generate random 3D position within a cylindrical spawn area
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

  // Initialize obstacles with random positions, sizes, and textures once on mount
  useEffect(() => {
    const newObstacles = Array.from({ length: noOfObstacles }, () => ({
      position: getRandomObstaclePosition(),
      size: Math.random() * obstacleSize + 0.5,
      texture:
        asteroidTextures[Math.floor(Math.random() * asteroidTextures.length)],
    }));
    setObstacles(newObstacles);
  }, []);

  // Track key press/release events to update keys state
  useEffect(() => {
    function onKeyDown(e) {
      if (keys.current[e.key.toLowerCase()] !== undefined) {
        keys.current[e.key.toLowerCase()] = true;
      }
    }
    function onKeyUp(e) {
      if (keys.current[e.key.toLowerCase()] !== undefined) {
        keys.current[e.key.toLowerCase()] = false;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Update spaceship position & rotation each frame based on key input and camera view limits
  useFrame(() => {
    let [x, y, z] = position;

    // Handle WASD movement
    if (keys.current.a) x -= speed;
    if (keys.current.d) x += speed;
    if (keys.current.w) y += speed;
    if (keys.current.s) y -= speed;

    // Calculate visible width and height at spaceship's z position
    const fov = (camera.fov * Math.PI) / 180;
    const dist = camera.position.z - z;

    const visibleWidth = 2 * dist * Math.tan(fov / 1.5);
    const visibleHeight = 2 * dist * Math.tan(fov / 2); // Corrected for vertical field of view

    const padding = 0.5;
    const widthLimit = visibleWidth / 2 - padding;
    const heightLimit = visibleHeight / 2 - padding;

    // Apply horizontal and vertical limits
    x = Math.min(Math.max(x, -widthLimit), widthLimit);
    y = Math.min(Math.max(y, -heightLimit), heightLimit);

    // Set the new position
    setPosition([x, y, z]);

    // Update spaceship position and rotation
    if (shipRef.current) {
      shipRef.current.position.set(x, y, z);
      shipRef.current.rotation.z = keys.current.a
        ? 0.3
        : keys.current.d
        ? -0.3
        : 0;
    }
  });

  // Set bullet fire position based on the spaceship model path
  const bulletFirePosition = {
    x: modelPath === "/models/spaceships/spaceship3.glb" ? -4 : 0,
    y: modelPath === "/models/spaceships/spaceship3.glb" ? -1 : 0,
    z: modelPath === "/models/spaceships/spaceship3.glb" ? 0 : 0,
  };

  // Listen for spacebar press to fire a bullet and play laser sound
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        if (paused) return;
        playLaserSound();
        // Create a new bullet
        const bullet = {
          position: new THREE.Vector3(
            shipRef.current.position.x + bulletFirePosition.x,
            shipRef.current.position.y + bulletFirePosition.y,
            shipRef.current.position.z - bulletFirePosition.z
          ),
          velocity: new THREE.Vector3(0, 0, -bulletSpeed),
        };
        setBullets((prev) => [...prev, bullet]);
      }
      // Toggle pause state when Escape key is pressed
      if (e.key === "Escape") {
        setPaused((pause) => !pause);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paused]);

  // Check if two objects collide based on their positions and sizes
  function checkCollision(pos1, size1, pos2, size2) {
    return pos1.distanceTo(pos2) < size1 + size2 + 1;
  }

  // Game loop: update bullets and obstacles each frame, handle collisions and respawns
  useFrame(() => {
    if (paused) return;
    setBullets((prevBullets) => {
      // Move bullets forward
      const movedBullets = prevBullets
        .map((bullet) => {
          const newPos = bullet.position.clone().add(bullet.velocity);
          return { ...bullet, position: newPos };
        })
        .filter((bullet) => bullet.position.z > -30); // remove far away bullets

      setObstacles((prevObstacles) => {
        const updatedObstacles = [];
        const remainingBullets = [...movedBullets]; // copy to mutate

        prevObstacles.forEach((obstacle) => {
          const newPosition = obstacle.position.clone();
          newPosition.z += obstacleSpeed; // move obstacle toward player

          // Check collision with spaceship
          if (
            checkCollision(
              newPosition,
              obstacle.size,
              shipRef.current.position,
              1
            )
          ) {
            // Reduce health
            setHealth((h) => {
              playHitSound();
              const newHealth = Math.max(h - 3, 0);
              if (newHealth <= 0) {
                // playSpaceshipExplosionSound();
                updateHighScore();
                onGameOver();
              }
              return newHealth;
            });

            // Respawn obstacle with **new Vector3 instance**
            const respawnPos = getRandomObstaclePosition();
            updatedObstacles.push({ ...obstacle, position: respawnPos });
            return; // skip bullet collision check if hit ship
          }

          // Check collision with bullets
          let hitByBullet = false;
          for (let i = 0; i < remainingBullets.length; i++) {
            const bullet = remainingBullets[i];
            if (
              checkCollision(newPosition, obstacle.size, bullet.position, 2)
            ) {
              playAsteroidExplosionSound();
              hitByBullet = true;
              remainingBullets.splice(i, 1); // remove bullet
              break;
            }
          }

          if (hitByBullet) {
            setScore((prev) => prev + 1);

            // Respawn obstacle with **new Vector3 instance**
            // When respawning obstacle:
            const respawnPos = getRandomObstaclePosition();
            updatedObstacles.push({ ...obstacle, position: respawnPos });

            return;
          }

          // Respawn if out of range
          if (newPosition.z > 10) {
            const respawnPos = getRandomObstaclePosition();
            updatedObstacles.push({ ...obstacle, position: respawnPos });
            return;
          }

          updatedObstacles.push({ ...obstacle, position: newPosition });
        });

        // Update bullets with bullets remaining after collisions
        setBullets(remainingBullets);

        return updatedObstacles;
      });

      return movedBullets; // temporarily return before setBullets inside obstacles, will get overwritten but React batches
    });
  });

  return (
    <>
      {/* Spaceship */}
      <Spaceship position={position} shipRef={shipRef} modelPath={modelPath} />

      {/* Bullets */}
      {bullets.map((bullet, index) => (
        <Bullets bullet={bullet} index={index} />
      ))}

      <PositionalAudio
        ref={laserSoundRef}
        url="/sound-effects/laser.mp3"
        distance={10}
        loop={false}
      />
      <PositionalAudio
        ref={laughSoundRef}
        url="/sound-effects/laugh.mp3"
        distance={10}
        loop={false}
      />

      {obstacles.map((obstacle, index) => (
        <Obstacle
          obstacle={obstacle}
          index={index}
          texture={obstacle.texture}
        />
      ))}
      <PositionalAudio
        ref={hitSoundRef}
        url="/sound-effects/explosion.mp3"
        distance={10}
        loop={false}
      />
      <PositionalAudio
        ref={asteroidExplosionSoundRef}
        url="/sound-effects/pixel-explosion.mp3"
        distance={10}
        loop={false}
      />
      <PositionalAudio
        ref={bgSoundRef}
        url="/sound-effects/bg.mp3"
        distance={10}
        loop={true}
      />
      <PositionalAudio
        ref={spaceshipExplosionSoundRef}
        url="/sound-effects/explosion1.mp3"
        distance={10}
        loop={false}
      />

      {paused && (
        <Html center>
          <div onClick={() => setPaused(false)} className="pause-overlay">
            <button className="overlay-pause-button">
              <img src="/icons/pause.png" width="80" alt="Pause" />
            </button>
          </div>
        </Html>
      )}

      <Html fullscreen>
        <div className="menu">
          <div className="menu-icons">
            {!paused && (
              <button onClick={() => setPaused(true)} className="pause-button">
                <img src="/icons/pause.png" width="30" alt="Pause" />
              </button>
            )}

            <button onClick={toggleMute} className="mute-button">
              <img
                src={`${muted ? "/icons/mute.png" : "/icons/unmute.png"}`}
                width="30"
                alt="Mute-Unmute"
              />
            </button>
            <Score score={score} />
          </div>
          {/* Health Bar */}
          <HealthBar health={health} />
        </div>
      </Html>
    </>
  );
}

export default SpaceshipModel;
