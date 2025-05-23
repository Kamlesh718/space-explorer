import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Html } from "@react-three/drei";

export default function Leaderboard({ setShowLeaderBoard }) {
  const [players, setPlayers] = useState([]);
  const currentUser = localStorage.getItem("username"); // current logged in user

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
          width: "90vw",
          maxWidth: "550px",
          height: "80vh",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 5px #0ff, 0 0 3px #0ff",
          fontFamily: "'Orbitron', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {setShowLeaderBoard && (
          <button
            onClick={() => setShowLeaderBoard(false)}
            style={{
              backgroundColor: "#0ff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "10px",
              alignSelf: "flex-end",
            }}
          >
            Close
          </button>
        )}

        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            textShadow: "0 0 10px #0ff",
            letterSpacing: "2px",
          }}
        >
          Top Scorers
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: "12px",
            margin: 0,
            overflowY: "auto",
            overflowX: "hidden",
            flexGrow: 1,
          }}
        >
          {players.map(({ username, highScore, avatarUrl }, i) => {
            const isCurrentUser = username === currentUser;
            return (
              <li
                key={username}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: isCurrentUser
                    ? "rgba(0, 255, 255, 0.3)"
                    : "rgba(0, 255, 255, 0.1)",
                  borderRadius: "8px",
                  boxShadow: i === 0 ? "0 0 10px 2px #0ff" : "none",
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
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flexGrow: 1,
                    color: "#0ff",
                    textShadow: "0 0 5px #0ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong style={{ fontSize: "1.1em", marginRight: "8px" }}>
                    {username}
                  </strong>
                  {isCurrentUser && (
                    <span
                      style={{
                        backgroundColor: "#0ff",
                        color: "#000",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.75em",
                        fontWeight: "bold",
                        userSelect: "none",
                        boxShadow: "0 0 8px #0ff",
                      }}
                    >
                      you
                    </span>
                  )}
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
            );
          })}
        </ul>
      </div>
    </Html>
  );
}
