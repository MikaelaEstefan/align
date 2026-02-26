import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ALIGN-${result}`;
}

export default function CreateRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [code, setCode] = useState<string | null>(null);

  const handleCreate = () => {
    const newCode = generateCode();
    setCode(newCode);
  };

  const handleStart = () => {
    if (code) {
      navigate(`/rooms/${code}/waiting`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Room</h2>

      {!code ? (
        <>
          <input
            placeholder="Room name (optional)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <br />
          <button onClick={handleCreate}>Create</button>
        </>
      ) : (
        <>
          <p>Room Code:</p>
          <h3>{code}</h3>
          <button onClick={handleStart}>Go to Waiting</button>
        </>
      )}
    </div>
  );
}