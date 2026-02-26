import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";

export default function Results() {
  const { code } = useParams();
  const navigate = useNavigate();

  const votes = useAlignStore((s) => s.votes);
  const reset = useAlignStore((s) => s.reset);

  const liked = useMemo(() => {
    return ITEMS.filter((item) => votes[item.id] === "like");
  }, [votes]);

  const handleSwipeAgain = () => {
    reset();
    navigate(`/rooms/${code}/swipe`);
  };

  const handleNewRoom = () => {
    reset();
    navigate("/rooms");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Results</h2>
      <p style={{ opacity: 0.7 }}>Room: {code}</p>
      <p>{liked.length} liked</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {liked.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt={item.alt ?? ""}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 14 }}
          />
        ))}
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 18, maxWidth: 360 }}>
        <button onClick={handleSwipeAgain}>Swipe again</button>
        <button onClick={handleNewRoom}>New room</button>
      </div>
    </div>
  );
}