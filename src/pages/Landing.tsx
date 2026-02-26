import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: 24 }}>
      <h1>ALIGN</h1>
      <p>Match interior taste together.</p>
      <Link to="/signin">Go to Sign In</Link>
    </div>
  );
}