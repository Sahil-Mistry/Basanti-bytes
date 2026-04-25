import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Next.js + Vite</h1>
      <p>This is your home page.</p>
      <Link to="/about">Go to About</Link>
    </div>
  );
}
