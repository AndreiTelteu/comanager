# Implementation Plan: Kanban Board and Chat Core

**Branch**: `001-kanban-chat-core` | **Date**: February 3, 2026 | **Spec**: [specs/001-kanban-chat-core/spec.md](specs/001-kanban-chat-core/spec.md)
**Input**: Feature specification from `/specs/001-kanban-chat-core/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a SolidJS Kanban board and Chat UI backed by a Go Fiber API. Persist board and chat state per project in a SQLite database stored under /app/data/<project>/, automatically migrating and hydrating schema on startup. Use embedded SQL migrations with a Go migration library and a pure-Go SQLite driver to keep Docker builds simple.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Go 1.25 (backend), TypeScript + SolidJS (frontend)  
**Primary Dependencies**: Fiber, TanStack Solid Router, Tailwind CSS v4, golang-migrate (iofs), modernc.org/sqlite  
**Storage**: Per-project SQLite databases under /app/data/<project>/project.db with file attachments under /app/data/<project>/attachments  
**Testing**: Cypress (E2E only; no unit tests)  
**Target Platform**: Linux containers and local dev on Linux  
**Project Type**: Web application (Go API + SolidJS SPA)  
**Performance Goals**: Responsive UI (target 60 fps interactions) and local API responses under 200ms p95  
**Constraints**: Automatic startup migrations; data persists via Docker volumes; no external services required  
**Scale/Scope**: Single-node deployment, single workspace per user, low-to-moderate concurrency

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- E2E-only testing: if tests are requested, they MUST be Cypress E2E tests.
- Frontend UI uses SolidJS best practices with minimal components.
- Components are created only for reuse across routes/flows.
- Architecture stays aligned with Go (Fiber) backend + SolidJS (Vite) SPA.

**Result**: Pass (no violations).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
cmd/
└── server/
  └── main.go
internal/
├── handlers/
├── server/
└── embed/
frontend/
├── src/
└── public/
```

**Structure Decision**: Web application with Go backend under cmd/ + internal/ and SolidJS SPA under frontend/.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations to track.

## Phase 0: Research

- Decision: Use golang-migrate with embedded SQL migrations (iofs source) for startup migrations.
- Decision: Use modernc.org/sqlite (pure Go) to avoid CGO build complexity in Docker.
- Decision: Implement light/dark theme via html data attribute and persisted preference.

See research notes in [specs/001-kanban-chat-core/research.md](specs/001-kanban-chat-core/research.md).

## Phase 1: Design

- Data model defined in [specs/001-kanban-chat-core/data-model.md](specs/001-kanban-chat-core/data-model.md).
- API contracts defined in [specs/001-kanban-chat-core/contracts/openapi.yaml](specs/001-kanban-chat-core/contracts/openapi.yaml).
- Quickstart steps defined in [specs/001-kanban-chat-core/quickstart.md](specs/001-kanban-chat-core/quickstart.md).

## Phase 2: Implementation Plan

1. Backend: add project discovery for /app/data, create missing project folders, and ensure project.db exists.
2. Backend: implement SQLite connection management per project and run embedded migrations on startup for each project database.
3. Backend: seed required tables (board columns, default board, chat thread) if empty.
4. Backend: add API endpoints for projects, board columns/tasks, and chat messages.
5. Frontend: replace demo routes with left-side navigation (Kanban, Chat, placeholders) and route structure via TanStack Router.
6. Frontend: implement Kanban board UI with drag-and-drop and create-task flow.
7. Frontend: implement chat UI with timeline, message input, and informational system responses.
8. Frontend: add light/dark theme toggle with persisted preference and clean modern styling.
9. Docker: validate /app/data volume usage and ensure SQLite driver/build compatibility with the chosen Go driver.
10. Manual test: verify migrations run, data persists, and navigation + UI flows match acceptance scenarios.

## Constitution Check (Post-Design)

- E2E-only testing: No tests requested; plan avoids unit testing.
- SolidJS minimal components: UI stays route-centric, components only for reuse.
- Architecture aligned with Go Fiber backend + SolidJS SPA.

**Result**: Pass.
