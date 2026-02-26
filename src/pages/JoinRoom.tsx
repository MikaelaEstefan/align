import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleJoin = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/rooms/${trimmed}/waiting`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Join room</h2>

      <input
        placeholder="Enter room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleJoin} style={{ marginTop: 12 }}>
        Join
      </button>
    </div>
  );
}