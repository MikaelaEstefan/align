import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Waiting() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      const { data } = await supabase
        .from("room_members")
        .select("user_id")
        .eq("room_id", roomId);

      if (data) {
        setMembersCount(data.length);
      }
    };

    checkMembers();

    const interval = setInterval(checkMembers, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  const copyCode = async () => {
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading room...</div>;
  }

  const ready = membersCount >= 2;

  return (
    <div style={{ padding: 24, maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
      <h2>Invite your partner</h2>

      <p style={{ opacity: 0.7 }}>
        Share this code so they can join your room
      </p>

      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 2,
          margin: "16px 0",
          padding: 12,
          borderRadius: 12,
          background: "#f3f3f3",
        }}
      >
        {code}
      </div>

      <button onClick={copyCode}>
        {copied ? "Copied!" : "Copy code"}
      </button>

      <div style={{ marginTop: 24 }}>
        {!ready && (
          <p style={{ opacity: 0.7 }}>
            Waiting for second person...
          </p>
        )}

        {ready && (
          <p style={{ fontWeight: 500 }}>
            Partner joined! Ready to swipe.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate(`/rooms/${code}/swipe`)}
        disabled={!ready}
        style={{ marginTop: 16 }}
      >
        Start Swiping
      </button>

      <div style={{ marginTop: 12, opacity: 0.6 }}>
        Members in room: {membersCount}
      </div>
    </div>
  );
}