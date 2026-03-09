import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PageShell from "../components/PageShell";
import Button from "../components/Button";

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
  const [debug, setDebug] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setDebug("Creating room...\n");

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData.user;

      setDebug((d) => d + `getUser error: ${userErr?.message ?? "none"}\n`);
      setDebug((d) => d + `user: ${user?.id ?? "null"}\n`);

      if (userErr) {
        alert(userErr.message);
        return;
      }

      if (!user) {
        alert("Not authenticated");
        return;
      }

      const code = generateCode();
      setDebug((d) => d + `code: ${code}\n`);

      const { error: roomInsertErr } = await supabase
        .from("rooms")
        .insert({ code, created_by: user.id });

      setDebug((d) => d + `rooms insert error: ${roomInsertErr?.message ?? "none"}\n`);

      if (roomInsertErr) return;

      const { data: room, error: roomFetchErr } = await supabase
        .from("rooms")
        .select("id")
        .eq("code", code)
        .single();

      setDebug((d) => d + `rooms fetch error: ${roomFetchErr?.message ?? "none"}\n`);

      if (roomFetchErr || !room) return;

      const { error: memberErr } = await supabase
        .from("room_members")
        .insert({ room_id: room.id, user_id: user.id });

      setDebug((d) => d + `members insert error: ${memberErr?.message ?? "none"}\n`);

      if (memberErr) return;

      await navigator.clipboard.writeText(code);
      setDebug((d) => d + `copied code to clipboard\n`);

      navigate(`/rooms/${code}/waiting`);
    } catch (e) {
      console.error("Unexpected create room error:", e);
      alert("Unexpected error creating room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Create room"
      subtitle="Create a shared room and invite the second person with a code."
    >
      <Button fullWidth onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </Button>

      {debug && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "rgba(0,0,0,0.05)",
            borderRadius: 12,
            whiteSpace: "pre-wrap",
            overflow: "auto",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {debug}
        </pre>
      )}
    </PageShell>
  );
}