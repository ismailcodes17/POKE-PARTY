# PokéParty

Full-stack Pokémon team builder.

- Search Pokémon via PokéAPI
- Create teams of up to 6
- Save teams in PostgreSQL

## Live links

- App: https://poke-party.vercel.app
- API docs: https://poke-party-api.onrender.com/docs

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL
- Frontend: Next.js, TypeScript
- Deploy: Render (API + DB), Vercel (frontend)

## Architecture

Browser → Next.js → FastAPI → PostgreSQL / PokéAPI

## Local setup

### 1. Database

```bash
docker compose up -d db
```

### 2. Backend

Copy env file:

```bash
cp .env.example .env
```

Install + run:

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

API: http://127.0.0.1:8000/docs

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
bun install
bun run dev
```

App: http://localhost:3000

## Notes

- Never commit `.env` or `frontend/.env.local`
- Use `NEXT_PUBLIC_API_URL` for the API base URL
- Production CORS allows localhost and Vercel domains
