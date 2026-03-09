import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function Landing() {
  return (
    <PageShell
      title="ALIGN"
      subtitle="Match interior taste together."
    >
      <Link to="/signin">Go to Sign In</Link>
    </PageShell>
  );
}