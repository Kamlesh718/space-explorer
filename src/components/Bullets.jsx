export default function Bullets({ bullet, index }) {
  console.log(bullet);
  return (
    <mesh key={index} position={bullet.position}>
      <sphereGeometry args={[0.3, 10, 8]} />
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
