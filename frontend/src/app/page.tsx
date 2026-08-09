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
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>PokéParty</h1>
      <p>Search a Pokémon, then add it to a saved team.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. pikachu"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 14px" }}>
          Search
        </button>
      </div>
    </main>
  );
}






