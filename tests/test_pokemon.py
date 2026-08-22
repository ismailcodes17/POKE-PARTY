def test_get_pikachu(client):
    res = client.get("/api/v1/pokemon/pikachu")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "pikachu"
    assert "electric" in data["types"]
    assert "stats" in data


def test_pokemon_not_found(client):
    res = client.get("/api/v1/pokemon/not-a-real-pokemon-xyz")
    assert res.status_code == 404
