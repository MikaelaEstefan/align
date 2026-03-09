import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PageShell from "../components/PageShell";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/rooms");
    });
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);

    const redirectTo = `${window.location.origin}/rooms`;

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
  };

  return (
    <PageShell
      title="Sign in"
      subtitle="Continue with Google to create or join a room."
    >
      <button onClick={signInWithGoogle} disabled={loading}>
        {loading ? "Redirecting..." : "Continue with Google"}
      </button>
    </PageShell>
  );
}