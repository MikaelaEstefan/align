import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITEMS } from "../data/items";
import { useAlignStore } from "../store/useAlignStore";
import { supabase } from "../lib/supabase";

type VoteValue = "like" | "dislike" | "skip";

export default function Swipe() {
  const { code } = useParams();
  const navigate = useNavigate();

  const index = useAlignStore((s) => s.index);
  const next = useAlignStore((s) => s.next);
  const reset = useAlignStore((s) => s.reset);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [savingVote, setSavingVote] = useState(false);

  const total = ITEMS.length;
  const current = useMemo(() => ITEMS[index], [index]);

  useEffect(() => {
    const loadSessionAndRoom = async () => {
      setLoadingRoom(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData.user;

      if (userErr || !user) {
        alert("Not authenticated");
        navigate("/signin");
        return;
      }

      setUserId(user.id);

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
      setLoadingRoom(false);
    };

    loadSessionAndRoom();

    return () => {
      reset();
    };
  }, [code, navigate, reset]);

  const handleVote = async (value: VoteValue) => {
    if (!current || !roomId || !userId || !code) return;

    setSavingVote(true);

    const { error } = await supabase.from("votes").upsert(
      {
        room_id: roomId,
        user_id: userId,
        item_id: current.id,
        value,
      },
      {
        onConflict: "room_id,user_id,item_id",
      }
    );

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingVote(false);
      return;
    }

    const isLast = index >= total - 1;

    if (isLast) {
      navigate(`/rooms/${code}/results`);
      return;
    }

    next();
    setSavingVote(false);
  };

  if (loadingRoom) {
    return <div style={{ padding: 24 }}>Loading room...</div>;
  }

  if (!current) {
    return <div style={{ padding: 24 }}>No items</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 460, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ opacity: 0.7 }}>Room {code}</div>
        <div style={{ opacity: 0.7 }}>
          {index + 1}/{total}
        </div>
      </div>

      <img
        src={current.src}
        alt={current.alt ?? ""}
        style={{
          width: "100%",
          aspectRatio: "1/1",
          objectFit: "cover",
          borderRadius: 18,
        }}
      />

      <div style={{ marginTop: 10, opacity: 0.7 }}>{current.style}</div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => handleVote("dislike")} disabled={savingVote}>
          No
        </button>
        <button onClick={() => handleVote("skip")} disabled={savingVote}>
          Skip
        </button>
        <button onClick={() => handleVote("like")} disabled={savingVote}>
          Like
        </button>
      </div>
    </div>
  );
}