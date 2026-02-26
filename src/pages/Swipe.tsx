import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";

export default function Swipe() {
  const { code } = useParams();
  const navigate = useNavigate();

  const index = useAlignStore((s) => s.index);
  const vote = useAlignStore((s) => s.vote);
  const next = useAlignStore((s) => s.next);

  const total = ITEMS.length;

  const current = useMemo(() => ITEMS[index], [index]);

  const handleVote = (value: "like" | "dislike" | "skip") => {
    if (!current) return;

    vote(current.id, value);

    const isLast = index >= total - 1;
    if (isLast) {
      navigate(`/rooms/${code}/results`);
      return;
    }

    next();
  };

  if (!current) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Swipe</h2>
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>Room: {code}</div>
        <div>
          {index + 1}/{total}
        </div>
      </div>

      <img
        src={current.src}
        alt={current.alt ?? ""}
        style={{ width: "100%", maxWidth: 420, aspectRatio: "1/1", objectFit: "cover", borderRadius: 16 }}
      />

      <div style={{ marginTop: 12, opacity: 0.7 }}>{current.style}</div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => handleVote("dislike")}>No</button>
        <button onClick={() => handleVote("skip")}>Skip</button>
        <button onClick={() => handleVote("like")}>Like</button>
      </div>
    </div>
  );
}