# Comanager

Comanager is a product management workspace that blends a kanban board with a focused chat stream, helping teams plan and track development work in one place.

## Highlights

- Kanban board with drag-and-drop tasks across workflow columns.
- Chat timeline for capturing task intent and updates.
- Spec-driven development workflow aligned with the project specs.
- SPA frontend (Solid + TanStack Router) served by a Go (Fiber) backend.
- Docker-based dev and production setups.

## Quick start (local dev)

**Prerequisites**
- Go 1.25+
- Bun

**Backend (auto-reload)**
```bash
air -c .air.toml
```

**Frontend**
```bash
cd frontend
bun run dev -- --host 0.0.0.0 --port 3000
```

Open:
- Frontend: http://localhost:3000
- API health: http://localhost:8080/api/health

## Development with Docker

```bash
docker compose -f compose.yml up --build
```

## Production build

```bash
docker compose -f compose-prod.yml build
```

The backend serves the built SPA from `internal/embed/frontend/dist`.

## Project layout

```
cmd/server              Go entrypoint
internal/handlers       HTTP handlers (API + SPA)
internal/embed          Embedded frontend assets
frontend                Solid + Vite SPA
projects                Project workspaces + DBs
data                    Local runtime data
specs                   Spec-driven development artifacts
```

## License

MIT
