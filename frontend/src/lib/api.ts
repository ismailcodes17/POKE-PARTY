const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export type Pokemon = {
  id: number;
  name: string;
  sprite_url: string | null;
  types: string[];
  abilities: string[];
  stats: Record<string, number>;
};

export type TeamMember = {
  id: string;
  pokemon_id: number;
  pokemon_name: string;
  sprite_url: string | null;
  slot_number: number;
};

export type Team = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function fetchPokemon(name: string) {
  return request<Pokemon>(`/pokemon/${name.toLowerCase()}`);
}

export function listTeams() {
  return request<Team[]>("/teams");
}

export function getTeam(teamId: string) {
  return request<Team>(`/teams/${teamId}`);
}

export function createTeam(name: string) {
  return request<Team>("/teams", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function addMember(teamId: string, pokemon_name: string, slot_number: number) {
  return request<Team>(`/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ pokemon_name, slot_number }),
  });
}

export function removeMember(teamId: string, memberId: string) {
  return request<void>(`/teams/${teamId}/members/${memberId}`, {
    method: "DELETE",
  });
}

export function deleteTeam(teamId: string) {
  return request<void>(`/teams/${teamId}`, {
    method: "DELETE",
  });
}