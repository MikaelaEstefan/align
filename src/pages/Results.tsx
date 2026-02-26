import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";

export default function Results() {
  const { code } = useParams();
  const navigate = useNavigate();

  const votes = useAlignStore((s) => s.votes);
  const reset = useAlignStore((s) => s.reset);

  const matches = useMemo(() => {
    return ITEMS.filter(
      (item) =>
        votes.A[item.id] === "like" &&
        votes.B[item.id] === "like"
    );
  }, [votes]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Matches</h2>
      <p>{matches.length} matches</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {matches.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt=""
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
          />
        ))}
      </div>

      <button
        onClick={() => {
          reset();
          navigate(`/rooms/${code}/swipe`);
        }}
        style={{ marginTop: 20 }}
      >
        Start again
      </button>
    </div>
  );
}