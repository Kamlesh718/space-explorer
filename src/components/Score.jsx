import { Html } from "@react-three/drei";
import "../css/game.css";

function Score({ score }) {
  return (
    // <Html position={[-32, 15, -10]}>
    <div className="score">Score: {score}</div>
    // </Html>
  );
}

export default Score;
