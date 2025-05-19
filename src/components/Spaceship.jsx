import { Cloud, useGLTF } from "@react-three/drei";

function Spaceship({ position, shipRef, modelPath }) {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      ref={shipRef}
      object={scene}
      scale={[0.5, 0.5, 0.5]}
      position={position}
      rotation={[0, Math.PI, 0]}
    >
      <pointLight color="#daa520" intensity={600} distance={10} />
      {/* <Cloud
        segments={40}
        bounds={[0.5, 0.5, 1]}
        volume={10}
        position={[0, -0.2, 0.5]}
        color="#ff6a00"
        opacity={0.7}
      />
      <Cloud
        segments={40}
        bounds={[0.5, 0.5, 0.8]}
        volume={8}
        position={[0.2, 0, 0.6]}
        color="#ff9a00"
        opacity={0.6}
      /> */}
    </primitive>
  );
}

export default Spaceship;
