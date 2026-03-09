import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PageShell from "../components/PageShell";
import Button from "../components/Button";

export default function Waiting() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadRoomAndMembers = async () => {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("id")
        .eq("code", code)
        .maybeSingle();

      if (roomError || !room) {
        alert("Room not found");
        navigate("/rooms");
        return;
      }

      setRoomId(room.id);

      const { data: members, error: membersError } = await supabase
        .from("room_members")
        .select("user_id")
        .eq("room_id", room.id);

      if (membersError) {
        console.error(membersError);
        alert(membersError.message);
        navigate("/rooms");
        return;
      }

      setMembersCount(members.length);
      setLoading(false);
    };

    loadRoomAndMembers();
  }, [code, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-members-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_members",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          const { data, error } = await supabase
            .from("room_members")
            .select("user_id")
            .eq("room_id", roomId);

          if (!error && data) {
            setMembersCount(data.length);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    return (
      <PageShell title="Room status" subtitle="Loading room...">
        <div />
      </PageShell>
    );
  }

  const ready = membersCount >= 2;

  return (
    <PageShell
      title="Invite your partner"
      subtitle="Share this code so the second person can join your room."
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 2,
          margin: "16px 0",
          padding: 14,
          borderRadius: 14,
          background: "#f3f3f3",
          textAlign: "center",
        }}
      >
        {code}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button fullWidth variant="secondary" onClick={copyCode}>
          {copied ? "Copied!" : "Copy code"}
        </Button>
      </div>

      <div
        style={{
          marginBottom: 18,
          padding: 14,
          borderRadius: 14,
          background: ready ? "#f6f6f6" : "#fafafa",
          border: "1px solid #ececec",
        }}
      >
        {!ready ? (
          <p style={{ margin: 0, opacity: 0.75 }}>
            Waiting for second person...
          </p>
        ) : (
          <p style={{ margin: 0, fontWeight: 500 }}>
            Partner joined! Ready to swipe.
          </p>
        )}
      </div>

      <Button
        fullWidth
        onClick={() => navigate(`/rooms/${code}/swipe`)}
        disabled={!ready}
      >
        Start swiping
      </Button>

      <div style={{ marginTop: 12, opacity: 0.6, fontSize: 14 }}>
        Members in room: {membersCount}
      </div>
    </PageShell>
  );
}