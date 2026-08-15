"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTeam, removeMember, type Team } from "@/lib/api";
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4"
export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setTeam(await getTeam(params.id));
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

  if (error) return <main style={{ padding: 24 }}>{error}</main>;
  if (!team) return <main style={{ padding: 24 }}>Loading...</main>;

  const slots = [1, 2, 3, 4, 5, 6];

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>{team.name}</h1>
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
                    <img src={member.sprite_url} alt={member.pokemon_name} width={96} height={96} />
                  )}
                  <div style={{ textTransform: "capitalize" }}>{member.pokemon_name}</div>
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