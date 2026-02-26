import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";

export default function Swipe() {
  const { code } = useParams();
  const navigate = useNavigate();

  const index = useAlignStore((s) => s.index);
  const currentUser = useAlignStore((s) => s.currentUser);
  const vote = useAlignStore((s) => s.vote);
  const next = useAlignStore((s) => s.next);
  const switchUser = useAlignStore((s) => s.switchUser);

  const total = ITEMS.length;
  const current = useMemo(() => ITEMS[index], [index]);

  const handleVote = (value: "like" | "dislike" | "skip") => {
    if (!current) return;

    vote(current.id, value);

    const isLast = index >= total - 1;

    if (isLast) {
      if (currentUser === "A") {
        switchUser();
        return;
      } else {
        navigate(`/rooms/${code}/results`);
        return;
      }
    }

    next();
  };

  if (!current) return <div style={{ padding: 24 }}>No items</div>;

  return (
    <div style={{ padding: 24, maxWidth: 460 }}>
      <h2>User {currentUser}</h2>

      <div style={{ opacity: 0.7 }}>
        {index + 1}/{total}
      </div>

      <img
        src={current.src}
        alt=""
        style={{
          width: "100%",
          aspectRatio: "1/1",
          objectFit: "cover",
          borderRadius: 18,
        }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={() => handleVote("dislike")}>No</button>
        <button onClick={() => handleVote("skip")}>Skip</button>
        <button onClick={() => handleVote("like")}>Like</button>
      </div>
    </div>
  );
}