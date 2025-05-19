// MovingStars.js
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function MovingStars() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Create a slight movement for the stars
      groupRef.current.position.z += 1;

      // Reset position for a seamless loop
      if (groupRef.current.position.z > 50) {
        groupRef.current.position.z = -100;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={300} count={5000} factor={12} fade />
    </group>
  );
}
