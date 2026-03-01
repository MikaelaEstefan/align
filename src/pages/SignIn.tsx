import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, mandá directo a Rooms
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/rooms");
    });
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);

    const redirectTo = `${window.location.origin}/rooms`;
      import.meta.env.PROD
        ? window.location.origin // en Vercel/producción
        : "http://localhost:5173"; // en local

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
    // Si no hay error,  redirige a Google 
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in</h2>

      <button onClick={signInWithGoogle} disabled={loading}>
        {loading ? "Redirecting..." : "Continue with Google"}
      </button>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => navigate("/rooms")}>
          Continue (MVP without auth)
        </button>
      </div>
    </div>
  );
}