"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTeam, removeMember, type Team } from "@/lib/api";

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setTeam(await getTeam(params.id));
      setError("");
    } catch {
      setError("Team not found");
    }
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function handleRemove(memberId: string) {
    await removeMember(params.id, memberId);
    await load();
  }

  if (error) {
    return (
      <main style={{ width: "min(900px, 100%)", margin: "24px auto", padding: "0 16px" }}>
        {error}
      </main>
    );
  }

  if (!team) {
    return (
      <main style={{ width: "min(900px, 100%)", margin: "24px auto", padding: "0 16px" }}>
        Loading...
      </main>
    );
  }

  const slots = [1, 2, 3, 4, 5, 6];

  return (
    <main
      style={{
        width: "min(900px, 100%)",
        margin: "24px auto",
        padding: "0 16px 32px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ wordBreak: "break-word" }}>{team.name}</h1>
      <p>{team.members.length}/6 members</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {slots.map((slot) => {
          const member = team.members.find((m) => m.slot_number === slot);
          return (
            <div
              key={slot}
              style={{
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                minHeight: 160,
              }}
            >
              <strong>Slot {slot}</strong>
              {member ? (
                <>
                  {member.sprite_url && (
                    <img
                      src={member.sprite_url}
                      alt={member.pokemon_name}
                      width={96}
                      height={96}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  )}
                  <div style={{ textTransform: "capitalize" }}>{member.pokemon_name}</div>
                  <button onClick={() => handleRemove(member.id)} style={{ marginTop: 8 }}>
                    Remove
                  </button>
                </>
              ) : (
                <p style={{ color: "#888" }}>Empty</p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
