import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Waiting() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      const { data: room, error } = await supabase
        .from("rooms")
        .select("id")
        .eq("code", code)
        .maybeSingle();

      if (error || !room) {
        alert("Room not found");
        navigate("/rooms");
        return;
      }

      setRoomId(room.id);
      setLoading(false);
    };

    loadRoom();
  }, [code, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const checkMembers = async () => {
      const { data, error } = await supabase
        .from("room_members")
        .select("user_id")
        .eq("room_id", roomId);

      if (!error && data) {
        setMembersCount(data.length);
      }
    };

    checkMembers();

    const interval = setInterval(checkMembers, 2000);

    return () => clearInterval(interval);
  }, [roomId]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading room...</div>;
  }

  const ready = membersCount >= 2;

  return (
    <div style={{ padding: 24, maxWidth: 460, margin: "0 auto" }}>
      <h2>Room Status</h2>

      <p>Room code: <strong>{code}</strong></p>

      {!ready && (
        <p>Waiting for second person...</p>
      )}

      {ready && (
        <p>Partner joined! You can start swiping.</p>
      )}

      <button
        onClick={() => navigate(`/rooms/${code}/swipe`)}
        disabled={!ready}
        style={{ marginTop: 16 }}
      >
        Start Swiping
      </button>

      <div style={{ marginTop: 10, opacity: 0.6 }}>
        Members in room: {membersCount}
      </div>
    </div>
  );
}