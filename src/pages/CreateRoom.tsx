import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return `ALIGN-${result}`;
}

export default function CreateRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState<string>("");

  const handleCreate = async () => {
    setLoading(true);
    setDebug("Creating room...\n");

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      setDebug((d) => d + `getUser error: ${userErr?.message ?? "none"}\n`);
      setDebug((d) => d + `user: ${userData?.user?.id ?? "null"}\n`);

      const user = userData.user;
      if (!user) {
        setDebug((d) => d + "NOT AUTHENTICATED\n");
        return;
      }

      const code = generateCode();
      setDebug((d) => d + `code: ${code}\n`);

      // ✅ IMPORTANT: no select() to avoid RLS select issues
      const { error: roomInsertErr } = await supabase
        .from("rooms")
        .insert({ code, created_by: user.id });

      setDebug((d) => d + `rooms insert error: ${roomInsertErr?.message ?? "none"}\n`);

      if (roomInsertErr) return;

      // Fetch room id by code
      const { data: room, error: roomFetchErr } = await supabase
        .from("rooms")
        .select("id, code")
        .eq("code", code)
        .single();

      setDebug((d) => d + `rooms fetch error: ${roomFetchErr?.message ?? "none"}\n`);
      if (roomFetchErr || !room) return;

      const { error: memberErr } = await supabase
        .from("room_members")
        .insert({ room_id: room.id, user_id: user.id });

      setDebug((d) => d + `members insert error: ${memberErr?.message ?? "none"}\n`);
      if (memberErr) return;

      setDebug((d) => d + `NAVIGATE -> /rooms/${code}/waiting\n`);
      navigate(`/rooms/${code}/waiting`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h2>Create Room</h2>

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </button>

      <pre
        style={{
          marginTop: 16,
          padding: 12,
          background: "rgba(0,0,0,0.06)",
          borderRadius: 10,
          whiteSpace: "pre-wrap",
          overflow: "auto",
        }}
      >
        {debug}
      </pre>
    </div>
  );
}