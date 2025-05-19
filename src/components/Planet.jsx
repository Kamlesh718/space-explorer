import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Planet({
  position = [0, 0, 0],
  size = 1,
  color = "blue",
}) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
