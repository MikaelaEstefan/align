import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";
import { supabase } from "../lib/supabase";
import PageShell from "../components/PageShell";
import Button from "../components/Button";

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
  const [roomId, setRoomId] = useState<string | null>(null);
  const [matchesIds, setMatchesIds] = useState<string[]>([]);

  const loadMatches = async (currentRoomId?: string) => {
    const targetRoomId = currentRoomId ?? roomId;
    if (!targetRoomId) return;

    const { data: votes, error: votesErr } = await supabase
      .from("votes")
      .select("item_id, value, user_id")
      .eq("room_id", targetRoomId)
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

  useEffect(() => {
    const loadRoomAndInitialMatches = async () => {
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

      setRoomId(room.id);
      await loadMatches(room.id);
    };

    loadRoomAndInitialMatches();
  }, [code, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`votes-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          await loadMatches(roomId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const matches = useMemo(() => {
    return ITEMS.filter((item) => matchesIds.includes(item.id));
  }, [matchesIds]);

  if (loading) {
    return (
      <PageShell title="Matches" subtitle="Loading results...">
        <div />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Matches"
      subtitle={`${matches.length} shared ${matches.length === 1 ? "match" : "matches"}`}
    >
      {matches.length === 0 ? (
        <div
          style={{
            opacity: 0.7,
            marginBottom: 20,
            padding: 14,
            borderRadius: 14,
            background: "#fafafa",
            border: "1px solid #ececec",
          }}
        >
          No shared likes yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {matches.map((item) => (
            <img
              key={item.id}
              src={item.src}
              alt={item.alt ?? ""}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
              }}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Button
          fullWidth
          onClick={() => {
            reset();
            navigate(`/rooms/${code}/swipe`);
          }}
        >
          Start again
        </Button>
      </div>
    </PageShell>
  );
}