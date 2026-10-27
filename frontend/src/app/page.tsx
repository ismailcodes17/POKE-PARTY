"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (!name.trim()) return;
    router.push(`/pokemon/${name.trim().toLowerCase()}`);
  }

  return (
    <main
      style={{
        width: "min(700px, 100%)",
        margin: "24px auto",
        padding: "0 16px 32px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 8 }}>PokéParty</h1>
      <p style={{ color: "#c4c4c4" }}>Search a Pokémon, then add it to a saved team.</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 16,
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. pikachu"
          style={{ flex: "1 1 220px", padding: 12, minWidth: 0, background: "#111", color: "#fff", border: "1px solid #333", borderRadius: 10 }}
        />
        <button onClick={handleSearch} style={{ padding: "12px 16px", flex: "0 0 auto", background: "#fff", color: "#000", border: 0, borderRadius: 999, fontWeight: 700 }}>
          Search
        </button>
      </div>
    </main>
  );
}
