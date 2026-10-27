import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokéParty",
  description: "Build and save Pokémon teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", color: "#fff", background: "#000", fontFamily: "sans-serif" }}>
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage:
              "url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png), url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png), url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png), url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "240px",
            backgroundPosition: "6% 18%, 92% 12%, 8% 78%, 90% 72%",
            filter: "grayscale(1)",
            opacity: 0.28,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
        <header
          style={{
            background: "#000",
            color: "white",
            padding: "12px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            borderBottom: "1px solid #222",
          }}
        >
          <strong style={{ marginRight: 8 }}>PokéParty</strong>
          <Link href="/" style={{ color: "white" }}>
            Search
          </Link>
          <Link href="/teams" style={{ color: "white" }}>
            Teams
          </Link>
        </header>
        {children}
        <footer style={{ padding: "20px 16px", fontSize: 14 }}>
          <a href="https://ismailsportfolio.vercel.app" style={{ color: "#fff" }}>
            Ismail Jeylani
          </a>
        </footer>
        </div>
      </body>
    </html>
  );
}
