from uuid import UUID

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.team import Team, TeamMember
from app.schemas.team import TeamCreate, TeamMemberCreate, TeamRead
from app.services.pokeapi import get_pokemon

from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine
from fastapi import FastAPI

from fastapi import HTTPException
from app.services.pokeapi import get_pokemon

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://poke-party-git-main-ismailcodes17s-projects.vercel.app",
        "https://poke-party-ismailcodes17s-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.get("/api/v1/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "error"

    return {
        "status": "ok" if db_status == "ok" else "error",
        "app": settings.APP_NAME,
        "database": db_status,
    }
@app.get("/api/v1/pokemon/{name}")
def read_pokemon(name: str):
    try:
        return get_pokemon(name)
    except ValueError:
        raise HTTPException(status_code=404, detail="Pokemon not found")
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.post("/api/v1/teams", response_model=TeamRead, status_code=201)
def create_team(payload: TeamCreate, db: Session = Depends(get_db)):
    team = Team(name=payload.name.strip())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@app.get("/api/v1/teams", response_model=list[TeamRead])
def list_teams(db: Session = Depends(get_db)):
    return db.query(Team).options(joinedload(Team.members)).all()


@app.get("/api/v1/teams/{team_id}", response_model=TeamRead)
def get_team(team_id: UUID, db: Session = Depends(get_db)):
    team = (
        db.query(Team)
        .options(joinedload(Team.members))
        .filter(Team.id == team_id)
        .first()
    )
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@app.post("/api/v1/teams/{team_id}/members", response_model=TeamRead, status_code=201)
def add_member(team_id: UUID, payload: TeamMemberCreate, db: Session = Depends(get_db)):
    team = (
        db.query(Team)
        .options(joinedload(Team.members))
        .filter(Team.id == team_id)
        .first()
    )
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if len(team.members) >= 6:
        raise HTTPException(status_code=409, detail="Team already has 6 members")

    if any(m.slot_number == payload.slot_number for m in team.members):
        raise HTTPException(status_code=409, detail="Slot already occupied")

    try:
        pokemon = get_pokemon(payload.pokemon_name)
    except ValueError:
        raise HTTPException(status_code=404, detail="Pokemon not found")
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    member = TeamMember(
        team_id=team.id,
        pokemon_id=pokemon["id"],
        pokemon_name=pokemon["name"],
        sprite_url=pokemon["sprite_url"],
        slot_number=payload.slot_number,
    )
    db.add(member)
    db.commit()

    team = (
        db.query(Team)
        .options(joinedload(Team.members))
        .filter(Team.id == team_id)
        .first()
    )
    return team


@app.delete("/api/v1/teams/{team_id}/members/{member_id}", status_code=204)
def remove_member(team_id: UUID, member_id: UUID, db: Session = Depends(get_db)):
    member = (
        db.query(TeamMember)
        .filter(TeamMember.id == member_id, TeamMember.team_id == team_id)
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return None


@app.delete("/api/v1/teams/{team_id}", status_code=204)
def delete_team(team_id: UUID, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    db.delete(team)
    db.commit()
    return None