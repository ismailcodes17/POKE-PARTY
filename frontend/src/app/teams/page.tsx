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
    await deleteTeam(id);
    await load();
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>Teams</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New team name"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={handleCreate} style={{ padding: "10px 14px" }}>
          Create
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && teams.length === 0 && <p>No teams yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
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
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div>
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