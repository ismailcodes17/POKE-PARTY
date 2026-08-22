import uuid


def test_create_and_list_team(client):
    name = f"Test Squad {uuid.uuid4().hex[:8]}"
    create = client.post("/api/v1/teams", json={"name": name})
    assert create.status_code == 201
    team = create.json()
    assert team["name"] == name

    listed = client.get("/api/v1/teams")
    assert listed.status_code == 200
    assert any(t["id"] == team["id"] for t in listed.json())


def test_get_missing_team(client):
    missing_id = "00000000-0000-0000-0000-000000000000"
    res = client.get(f"/api/v1/teams/{missing_id}")
    assert res.status_code == 404


def test_add_member_and_six_limit(client):
    create = client.post(
        "/api/v1/teams",
        json={"name": f"Limit Squad {uuid.uuid4().hex[:8]}"},
    )
    assert create.status_code == 201
    team_id = create.json()["id"]

    names = ["pikachu", "bulbasaur", "charmander", "squirtle", "eevee", "mew"]

    for i, name in enumerate(names, start=1):
        res = client.post(
            f"/api/v1/teams/{team_id}/members",
            json={"pokemon_name": name, "slot_number": i},
        )
        assert res.status_code == 201, res.text

    seventh = client.post(
        f"/api/v1/teams/{team_id}/members",
        json={"pokemon_name": "ditto", "slot_number": 1},
    )
    assert seventh.status_code == 409
