import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import type { Style } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";

const FILTERS: (Style | "all")[] = ["all", "cozy", "minimal", "boho", "industrial", "vintage", "japandi"];

export default function Results() {
  const { code } = useParams();
  const navigate = useNavigate();

  const votes = useAlignStore((s) => s.votes);
  const reset = useAlignStore((s) => s.reset);

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const liked = useMemo(() => ITEMS.filter((i) => votes[i.id] === "like"), [votes]);

  const filtered = useMemo(() => {
    if (filter === "all") return liked;
    return liked.filter((i) => i.style === filter);
  }, [liked, filter]);

  const handleSwipeAgain = () => {
    reset();
    navigate(`/rooms/${code}/swipe`);
  };

  const handleNewRoom = () => {
    reset();
    navigate("/rooms");
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2>Matches</h2>
      <div style={{ opacity: 0.7, marginTop: -6 }}>Images you liked (MVP)</div>
      <div style={{ marginTop: 6, opacity: 0.7 }}>{liked.length} total</div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 14, paddingBottom: 6 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.12)",
              background: filter === f ? "black" : "white",
              color: filter === f ? "white" : "black",
              whiteSpace: "nowrap",
            }}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        {filtered.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt={item.alt ?? ""}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 16 }}
          />
        ))}
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <button onClick={handleSwipeAgain}>Swipe again</button>
        <button onClick={handleNewRoom}>New room</button>
      </div>
    </div>
  );
}