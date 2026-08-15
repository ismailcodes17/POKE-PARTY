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
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f7f7f7" }}>
        <header
          style={{
            background: "#111",
            color: "white",
            padding: "12px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <strong style={{ marginRight: 8 }}>PokéParty</strong>
          <Link href="/" style={{ color: "white" }}>Search</Link>
          <Link href="/teams" style={{ color: "white" }}>Teams</Link>
        </header>
        {children}
      </body>
    </html>
  );
}