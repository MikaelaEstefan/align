import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./app/routes";
import { supabase } from "./lib/supabase";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/rooms");
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return <AppRoutes />;
}