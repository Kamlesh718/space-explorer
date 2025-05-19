import { Html } from "@react-three/drei";

function Score({ score }) {
  return (
    <Html position={[-32, 15, -10]}>
      <div
        style={{
          width: "120px",
          color: "white",
          fontSize: "1.5em",
          fontFamily: "Inter, sans-serif",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: "12px",
          border: "2px solid #fff",
          textAlign: "center",
        }}
      >
        Score: {score}
      </div>
    </Html>
  );
}

export default Score;
