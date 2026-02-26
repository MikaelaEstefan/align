import { useParams, useNavigate } from "react-router-dom";

export default function Waiting() {
  const { code } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Room Status</h2>
      <p>Room code: {code}</p>

      <p>Waiting for second person...</p>

      <button onClick={() => navigate(`/rooms/${code}/swipe`)}>
        Start Swiping (Fake)
      </button>
    </div>
  );
}