# CrewMatch

Phase 1 is the data foundation for a marketplace connecting Filipino event freelancers with clients.

## Prerequisites

- Node.js 20+
- Docker Desktop

## Setup

```bash
cp .env.example .env
docker compose up -d postgres
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

The frontend placeholder runs with `cd frontend && npm install && npm run dev`.
The ML service runs on `http://localhost:8000/health`.
The pgAdmin database GUI runs at `http://localhost:5051`.

Log in to pgAdmin with the values in `.env`:

- Email: `PGADMIN_DEFAULT_EMAIL`
- Password: `PGADMIN_DEFAULT_PASSWORD`
- PostgreSQL host: `postgres`
- Port: `5432`
- Database: `crewmatch`
- Username: `crewmatch`
- Password: `crewmatch`

## Phase 1 layout

- `backend/` NestJS-ready TypeScript package and Prisma schema/seed
- `frontend/` TypeScript frontend placeholder
- `ml-service/` minimal FastAPI health endpoint
- `docs/erd.md` database ERD

CrewMatch PostgreSQL is exposed on host port 5433 to avoid conflicts with other local PostgreSQL containers.
