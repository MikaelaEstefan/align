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
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Not authenticated");
      return;
    }

    const code = generateCode();

    // 1️⃣ Crear room
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        code,
        created_by: user.id,
      })
      .select()
      .single();

    if (roomError) {
      console.error(roomError);
      alert(roomError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Agregar miembro
    const { error: memberError } = await supabase
      .from("room_members")
      .insert({
        room_id: room.id,
        user_id: user.id,
      });

    if (memberError) {
      console.error(memberError);
      alert(memberError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Redirigir
    navigate(`/rooms/${code}/waiting`);
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