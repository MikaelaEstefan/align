import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
        borderBottom: "1px solid #eee",
        paddingBottom: 12
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        ALIGN
      </div>

      <button
        onClick={handleLogout}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        Sign out
      </button>
    </div>
  );
}