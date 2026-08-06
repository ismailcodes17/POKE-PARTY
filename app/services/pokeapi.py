import httpx


def get_pokemon(name: str) -> dict:
    url = f"https://pokeapi.co/api/v2/pokemon/{name.lower().strip()}"

    try:
        response = httpx.get(url, timeout=10.0)
    except Exception as e:
        raise RuntimeError(f"Could not reach PokéAPI: {e}")

    if response.status_code == 404:
        raise ValueError("Pokemon not found")

    if response.status_code != 200:
        raise RuntimeError(f"PokéAPI status {response.status_code}")

    data = response.json()

    return {
        "id": data["id"],
        "name": data["name"],
        "sprite_url": data["sprites"]["front_default"],
        "types": [t["type"]["name"] for t in data["types"]],
        "abilities": [a["ability"]["name"] for a in data["abilities"]],
        "stats": {
            s["stat"]["name"]: s["base_stat"]
            for s in data["stats"]
        },
    }