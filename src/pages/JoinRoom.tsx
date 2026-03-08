import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);

    try {
      // 1) user
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

      // 2) find room by code
      const { data: room, error: roomErr } = await supabase
        .from("rooms")
        .select("id, code")
        .eq("code", trimmed)
        .single();

      if (roomErr || !room) {
        console.error(roomErr);
        alert("Room not found. Check the code and try again.");
        return;
      }

      // 3) (optional) check if already member to avoid duplicate insert errors
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

      // 4) insert membership if not exists
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

      // 5) go to waiting
      navigate(`/rooms/${room.code}/waiting`);
    } catch (e) {
      console.error("Unexpected join room error:", e);
      alert("Unexpected error joining room (check console).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Join room</h2>

      <input
        placeholder="Enter room code (e.g. ALIGN-AB12CD)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", maxWidth: 320 }}
      />

      <br />

      <button onClick={handleJoin} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}