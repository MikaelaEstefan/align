import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PageShell from "../components/PageShell";
import Button from "../components/Button";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData.user;

      if (userErr) {
        console.error(userErr);
        alert(userErr.message);
        return;
      }

      if (!user) {
        alert("Not authenticated");
        return;
      }

      const { data: room, error: roomErr } = await supabase
        .from("rooms")
        .select("id, code")
        .eq("code", trimmed)
        .maybeSingle();

      if (roomErr) {
        console.error(roomErr);
        alert(roomErr.message);
        return;
      }

      if (!room) {
        alert("Room not found. Check the code and try again.");
        return;
      }

      const { data: existing, error: existingErr } = await supabase
        .from("room_members")
        .select("room_id, user_id")
        .eq("room_id", room.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingErr) {
        console.error(existingErr);
        alert(existingErr.message);
        return;
      }

      if (!existing) {
        const { error: memberErr } = await supabase
          .from("room_members")
          .insert({ room_id: room.id, user_id: user.id });

        if (memberErr) {
          console.error(memberErr);
          alert(memberErr.message);
          return;
        }
      }

      navigate(`/rooms/${room.code}/waiting`);
    } catch (e) {
      console.error("Unexpected join room error:", e);
      alert("Unexpected error joining room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Join room"
      subtitle="Enter the shared code to join an existing room."
    >
      <input
        placeholder="Enter room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #d9d9d9",
          fontSize: 14,
          marginBottom: 14,
          boxSizing: "border-box",
        }}
      />

      <Button fullWidth onClick={handleJoin} disabled={loading}>
        {loading ? "Joining..." : "Join Room"}
      </Button>
    </PageShell>
  );
}