export default function Bullets({ bullet, index }) {
  return (
    <mesh key={index} position={bullet.position}>
      <sphereGeometry args={[0.4, 10, 8]} />
      <meshStandardMaterial
        color="yellow"
        emissive="yellow"
        emissiveIntensity={2}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  );
}
