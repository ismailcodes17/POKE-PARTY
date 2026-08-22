import { afterEach, describe, expect, it, vi } from "vitest";

const API_URL = "http://localhost:8000/api/v1";

describe("fetchPokemon", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("calls the backend pokemon endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 25,
        name: "pikachu",
        sprite_url: "https://example.com/pikachu.png",
        types: ["electric"],
        abilities: ["static"],
        stats: { hp: 35 },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchPokemon } = await import("@/lib/api");
    const data = await fetchPokemon("Pikachu");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/pokemon/pikachu`,
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    expect(data.name).toBe("pikachu");
  });

  it("throws when the backend returns an error", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => "Pokemon not found",
      }),
    );

    const { fetchPokemon } = await import("@/lib/api");
    await expect(fetchPokemon("missingno")).rejects.toThrow();
  });
});
