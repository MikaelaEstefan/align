import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in</h2>

      <button onClick={() => navigate("/rooms")}>Continue</button>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        (MVP: por ahora “Continue” entra directo)
      </p>
    </div>
  );
}