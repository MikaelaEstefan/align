import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ALIGN-${result}`;
}

export default function CreateRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    console.log("CLICK create room");
    setLoading(true);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      console.log("getUser", { user: userData?.user, userErr });

      const user = userData.user;

      if (!user) {
        alert("Not authenticated");
        return;
      }

      const code = generateCode();
      console.log("Generated code:", code);

      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({ code, created_by: user.id })
        .select()
        .single();

      console.log("rooms insert result", { room, roomError });

      if (roomError) {
        alert(roomError.message);
        return;
      }

      const { error: memberError } = await supabase
        .from("room_members")
        .insert({ room_id: room.id, user_id: user.id });

      console.log("members insert result", { memberError });

      if (memberError) {
        alert(memberError.message);
        return;
      }

      navigate(`/rooms/${code}/waiting`);
    } catch (e) {
      console.error("Create room unexpected error:", e);
      alert("Unexpected error creating room. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Room</h2>

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
}