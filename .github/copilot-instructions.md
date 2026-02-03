# Copilot Instructions

## Build, test, lint
- Backend build: `go build ./cmd/server`
- Backend dev (live reload): `air -c .air.toml` (used in `docker-compose.dev.yml`)
- Frontend dev: `cd frontend && bun run dev -- --host 0.0.0.0 --port 3000`
- Frontend build (outputs into backend embed dir): `cd frontend && bun run build`
- Docker build: `docker compose build`
- No automated tests or lint scripts are currently configured.

## High-level architecture
- Go backend (Fiber) in `cmd/server` + `internal/server` registers routes via `internal/handlers`.
- API routes live under `/api` (currently only `/api/health`).
- SPA frontend (Solid + TanStack Router) is built by Vite into `internal/embed/frontend/dist`.
- Backend serves the SPA from the embedded assets (`internal/embed` + `handlers/spa.go`) and falls back to `index.html` for client-side routing.
- Docker dev uses two services (Go + Vite) while production image embeds the built frontend into the Go binary.

## Key conventions
- Frontend build output must land in `internal/embed/frontend/dist`; the backend errors if assets are missing (run `bun run build`).
- SPA routing is declared in `frontend/src/main.tsx` with lazy routes for posts; use TanStack Router patterns when adding routes.
- Backend config uses `LISTEN_HOST`/`LISTEN_PORT` env vars (see `internal/server/config.go`).
