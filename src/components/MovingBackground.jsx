import { Cloud } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function MovingBackground() {
  const cloudGroup = useRef();

  useFrame(() => {
    if (cloudGroup.current) {
      cloudGroup.current.position.z += 0.1;
      if (cloudGroup.current.position.z > 20) {
        cloudGroup.current.position.z = -50;
      }
    }
  });

  return (
    <group ref={cloudGroup} position={[0, 0, -50]}>
      {[...Array(30)].map((_, i) => (
        <Cloud
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 40,
          ]}
          segments={20}
          radius={1 + Math.random() * 3}
          opacity={0.2 + Math.random() * 0.4}
          color="#ffffff"
        />
      ))}
    </group>
  );
}

export default MovingBackground;
