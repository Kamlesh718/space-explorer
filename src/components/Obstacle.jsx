export default function Obstacle({ obstacle, texture, index }) {
  return (
    <mesh
      key={index}
      position={obstacle.position}
      scale={obstacle.size}
      rotation={[
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ]}
    >
      <pointLight color="#ffd877" intensity={40} distance={100} />
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
