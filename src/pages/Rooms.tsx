import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Button from "../components/Button";

export default function Rooms() {
  const navigate = useNavigate();

  return (
    <PageShell title="Rooms" subtitle="Create a new room or join an existing one.">
      <div style={{ display: "grid", gap: 12 }}>
        <Button fullWidth onClick={() => navigate("/rooms/create")}>
          Create room
        </Button>

        <Button
          fullWidth
          variant="secondary"
          onClick={() => navigate("/rooms/join")}
        >
          Join room
        </Button>
      </div>

      <h3 style={{ marginTop: 28, marginBottom: 12, fontSize: 18 }}>Recent rooms</h3>

      <div style={{ display: "grid", gap: 10 }}>
        <Button
          fullWidth
          variant="secondary"
          onClick={() => navigate("/rooms/ALIGN-DEMO1/waiting")}
        >
          Living room ideas
        </Button>

        <Button
          fullWidth
          variant="secondary"
          onClick={() => navigate("/rooms/ALIGN-DEMO2/waiting")}
        >
          Bedroom makeover
        </Button>
      </div>
    </PageShell>
  );
}