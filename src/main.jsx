import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GameLogicProvider } from "./context/gameLogicContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameLogicProvider>
      <App />
    </GameLogicProvider>
  </StrictMode>
);
