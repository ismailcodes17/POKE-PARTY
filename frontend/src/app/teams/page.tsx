"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createTeam, deleteTeam, listTeams, type Team } from "@/lib/api";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setTeams(await listTeams());
      setError("");
    } catch {
      setError("Could not load teams");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setError("");
    try {
      await createTeam(name.trim());
      setName("");
      await load();
    } catch {
      setError("Could not create team");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTeam(id);
      await load();
    } catch {
      setError("Could not delete team");
    }
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
      <h1>Teams</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New team name"
          style={{ flex: "1 1 220px", padding: 10, minWidth: 0 }}
        />
        <button onClick={handleCreate} style={{ padding: "10px 14px" }}>
          Create
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && teams.length === 0 && <p>No teams yet.</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {teams.map((team) => (
          <li
            key={team.id}
            style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Link href={`/teams/${team.id}`}>
                <strong>{team.name}</strong>
              </Link>
              <div>{team.members.length}/6 members</div>
            </div>
            <button onClick={() => handleDelete(team.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
