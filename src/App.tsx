import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./app/routes";
import { supabase } from "./lib/supabase";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;

     
      const publicPaths = ["/", "/signin"];
      if (publicPaths.includes(location.pathname)) {
        navigate("/rooms", { replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return <AppRoutes />;
}