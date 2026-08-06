
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine
from fastapi import FastAPI

from fastapi import HTTPException
from app.services.pokeapi import get_pokemon
app = FastAPI()


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