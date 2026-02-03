# Quickstart: Kanban Board and Chat Core

## Prerequisites

- Go 1.25
- Bun (frontend dev)
- Docker (optional for containerized dev)

## Development (local)

1. Start the backend (auto-reload):
   - Run: `air -c .air.toml`
2. Start the frontend dev server:
   - Run: `cd frontend && bun run dev -- --host 0.0.0.0 --port 3000`
3. Open the app:
   - Frontend: http://localhost:3000
   - API: http://localhost:8080/api/health

## Development (Docker)

- Run: `docker compose -f docker-compose.dev.yml up --build`

## Data and migrations

- Project data lives under /app/data/<project>/
- Each project folder contains:
  - project.db (SQLite database)
  - attachments/ (binary files)
- On backend startup, migrations run automatically for each project database and seed default board columns if missing.

## Production build

- Run: `docker compose build`
- The backend serves the built SPA from internal/embed/frontend/dist.
