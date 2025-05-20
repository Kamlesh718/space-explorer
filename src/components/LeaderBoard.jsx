import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Html } from "@react-three/drei";

export default function Leaderboard({ setShowLeaderBoard }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      const playersRef = collection(db, "players");
      const q = query(playersRef, orderBy("highScore", "desc"), limit(10));
      const querySnapshot = await getDocs(q);

      const topPlayers = [];
      querySnapshot.forEach((doc) => {
        topPlayers.push(doc.data());
      });

      setPlayers(topPlayers);
    };

    fetchTopPlayers();
  }, []);

  return (
    <Html center>
      <div
        style={{
          backgroundColor: "#000",
          color: "#0ff",
          width: "40vw",
          height: "80vh",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 5px #0ff, 0 0 3px #0ff",
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {setShowLeaderBoard && (
          <button onClick={() => setShowLeaderBoard(false)}>Close</button>
        )}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            textShadow: "0 0 10px #0ff",
            letterSpacing: "2px",
          }}
        >
          Top Scorers
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {players.map(({ username, highScore, avatarUrl }, i) => (
            <li
              key={username}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                borderRadius: "8px",
                boxShadow: i === 0 ? "0 0 10px 2px #0ff" : "none",
                cursor: "default",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={avatarUrl}
                alt={`${username} avatar`}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "15px",
                  boxShadow: "0 0 5px #0ff",
                }}
              />
              <div
                style={{
                  flexGrow: 1,
                  color: "#0ff",
                  textShadow: "0 0 5px #0ff",
                }}
              >
                <strong style={{ fontSize: "1.1em" }}>{username}</strong>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  color: "#0ff",
                  textShadow: "0 0 5px #0ff",
                  minWidth: "50px",
                  textAlign: "right",
                }}
              >
                {highScore}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Html>
  );
}
