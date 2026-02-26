import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Rooms</h2>

      <div style={{ display: "grid", gap: 12, maxWidth: 320 }}>
        <button onClick={() => navigate("/rooms/create")}>Create room</button>
        <button onClick={() => navigate("/rooms/join")}>Join room</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Recent rooms</h3>
      <div style={{ display: "grid", gap: 10, maxWidth: 360 }}>
        <button onClick={() => navigate("/rooms/ALIGN-DEMO1/waiting")}>
          Living room ideas (demo)
        </button>
        <button onClick={() => navigate("/rooms/ALIGN-DEMO2/waiting")}>
          Bedroom makeover (demo)
        </button>
      </div>
    </div>
  );
}