import { Html } from "@react-three/drei";

function HealthBar({ health }) {
  return (
    <Html position={[25, 15, -10]}>
      <div
        style={{
          backgroundColor: "black",
          width: "200px",
          height: "20px",
          border: "2px solid white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: `${health}%`,
            height: "100%",
            backgroundColor: health > 30 ? "green" : "red",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </Html>
  );
}

export default HealthBar;
