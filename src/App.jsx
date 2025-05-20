// src/App.jsx
import { useState } from "react";
import Scene from "./components/Scene";
import Login from "./components/Login";
import ScreenSizeGuard from "./components/ScreenSizeGuard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, avatarUrl) => {
    setUser({ username, avatarUrl });
  };

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  return (
    <>
      {!username && !password ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ScreenSizeGuard>
          <Scene username={user?.username} avatarUrl={user?.avatarUrl} />
        </ScreenSizeGuard>
      )}
    </>
  );
}

export default App;
