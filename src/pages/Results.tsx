import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";
import { supabase } from "../lib/supabase";

type VoteRow = {
  item_id: string;
  value: "like" | "dislike" | "skip";
  user_id: string;
};

export default function Results() {
  const { code } = useParams();
  const navigate = useNavigate();
  const reset = useAlignStore((s) => s.reset);

  const [loading, setLoading] = useState(true);
  const [matchesIds, setMatchesIds] = useState<string[]>([]);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);

      const { data: room, error: roomErr } = await supabase
        .from("rooms")
        .select("id, code")
        .eq("code", code)
        .maybeSingle();

      if (roomErr || !room) {
        alert("Room not found");
        navigate("/rooms");
        return;
      }

      const { data: votes, error: votesErr } = await supabase
        .from("votes")
        .select("item_id, value, user_id")
        .eq("room_id", room.id)
        .eq("value", "like");

      if (votesErr) {
        console.error(votesErr);
        alert(votesErr.message);
        setLoading(false);
        return;
      }

      const likesByItem: Record<string, Set<string>> = {};

      (votes as VoteRow[]).forEach((vote) => {
        if (!likesByItem[vote.item_id]) {
          likesByItem[vote.item_id] = new Set();
        }
        likesByItem[vote.item_id].add(vote.user_id);
      });

      const matchedIds = Object.entries(likesByItem)
        .filter(([, userIds]) => userIds.size >= 2)
        .map(([itemId]) => itemId);

      setMatchesIds(matchedIds);
      setLoading(false);
    };

    loadMatches();
  }, [code, navigate]);

  const matches = useMemo(() => {
    return ITEMS.filter((item) => matchesIds.includes(item.id));
  }, [matchesIds]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading matches...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h2>Matches</h2>
      <p>{matches.length} matches</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {matches.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt={item.alt ?? ""}
            style={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              borderRadius: 16,
            }}
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