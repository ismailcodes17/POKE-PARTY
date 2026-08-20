"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { addMember, fetchPokemon, listTeams, type Pokemon, type Team } from "@/lib/api";

export default function PokemonPage() {
  const params = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState("");
  const [slot, setSlot] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await fetchPokemon(params.name);
        setPokemon(p);
      } catch {
        setError("Could not load Pokémon");
        setLoading(false);
        return;
      }

      try {
        const t = await listTeams();
        setTeams(t);
        if (t[0]) setTeamId(t[0].id);
      } catch {
        // Pokémon can still show even if teams fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.name]);

  async function handleAdd() {
    if (!teamId) {
      setError("Create a team first on the Teams page");
      return;
    }
    setError("");
    setMessage("");
    try {
      await addMember(teamId, params.name, slot);
      setMessage(`Added to slot ${slot}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add member");
    }
  }

  if (loading) {
    return (
      <main style={{ width: "min(700px, 100%)", margin: "24px auto", padding: "0 16px" }}>
        Loading...
      </main>
    );
  }

  if (!pokemon) {
    return (
      <main style={{ width: "min(700px, 100%)", margin: "24px auto", padding: "0 16px" }}>
        {error || "Not found"}
      </main>
    );
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
      <h1 style={{ textTransform: "capitalize", wordBreak: "break-word" }}>{pokemon.name}</h1>

      {pokemon.sprite_url && (
        <img
          src={pokemon.sprite_url}
          alt={pokemon.name}
          width={140}
          height={140}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}

      <p>Types: {pokemon.types.join(", ")}</p>
      <p>Abilities: {pokemon.abilities.join(", ")}</p>

      <h3 style={{ marginTop: 24 }}>Add to team</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          style={{ padding: 8, flex: "1 1 160px", minWidth: 0 }}
        >
          {teams.length === 0 && <option value="">No teams yet</option>}
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={slot}
          onChange={(e) => setSlot(Number(e.target.value))}
          style={{ padding: 8, flex: "1 1 120px", minWidth: 0 }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Slot {n}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} style={{ padding: "8px 12px" }}>
          Add
        </button>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}
