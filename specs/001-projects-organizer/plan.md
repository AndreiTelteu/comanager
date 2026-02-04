# Implementation Plan: Projects Organizer Page

**Branch**: `001-projects-organizer` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-projects-organizer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature introduces a projects organizer page at the root (`/`) route that displays a list of existing projects using mock data. Users can select a project to navigate to its kanban board at `/{project-slug}/kanban`, or initiate project creation via a visible button. All existing TanStack Router routes will be updated to include a `projectSlug` parameter. The layout header will display the active project name (truncated to fit) with a back button to return to the projects overview.

## Technical Context

**Language/Version**: TypeScript 5.9.2 (frontend), Go 1.25.6 (backend)  
**Primary Dependencies**: SolidJS 1.9.9, TanStack Router 1.131.35, Vite 7.1.10, Fiber v2 (backend)  
**Storage**: SQLite (modernc.org/sqlite 1.29.0) via Go backend  
**Testing**: Cypress (E2E only; no unit tests)  
**Target Platform**: Web (SPA with backend API)  
**Project Type**: Web application (Go/Fiber backend + SolidJS/Vite frontend)  
**Performance Goals**: Instant navigation (<100ms for route transitions), sub-200ms API responses  
**Constraints**: Must preserve existing SPA architecture, frontend output to internal/embed/frontend/dist  
**Scale/Scope**: Small to medium project count (10-100 projects), single-user application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **E2E-only testing**: Feature spec explicitly states "If tests are requested, they MUST be Cypress E2E tests only." - compliant.  
✅ **Frontend UI uses SolidJS best practices with minimal components**: Will reuse existing route creation patterns and minimal component approach.  
✅ **Components are created only for reuse across routes/flows**: Projects list will be in the route component; no new shared components needed unless reused.  
✅ **Architecture stays aligned with Go (Fiber) backend + SolidJS (Vite) SPA**: Changes are additive routing updates, no architecture changes.

**Status**: ✅ PASSED - No violations. This feature aligns with all constitution principles.

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

```text
backend/
└── internal/
    ├── server/          # Go/Fiber server setup
    ├── handlers/        # API route handlers
    ├── repository/      # Data access layer (SQLite)
    └── embed/          # Embedded frontend assets

frontend/
├── src/
│   ├── routes/         # SolidJS route components (projects.tsx, kanban.tsx, chat.tsx, etc.)
│   ├── layouts/        # AppShell layout with project-aware header
│   ├── components/     # Reusable UI components (kanban/, chat/, ThemeToggle)
│   ├── api.ts          # API client functions
│   └── main.tsx        # Router configuration
└── tests/              # (Future) Cypress E2E tests

cmd/
└── comanager/          # Main entry point
```

**Structure Decision**: Standard web application structure with Go backend and SolidJS frontend. Routes are co-located in `frontend/src/routes/`, layouts in `frontend/src/layouts/`. The router is configured in `main.tsx`. Backend API handlers follow RESTful patterns under `/api/projects/{projectId}/...` endpoints.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This section is intentionally left empty.

---

## Post-Phase 1 Constitution Re-Check

*Re-evaluation after Phase 1 design (research.md, data-model.md, contracts/*, quickstart.md completed)*

✅ **E2E-only testing**: Design does not introduce any unit tests. Testing section in contracts/api.md correctly specifies Cypress E2E tests only.  

✅ **Frontend UI uses SolidJS best practices with minimal components**: 
- Projects organizer is implemented as a route component (`routes/projects.tsx`)
- No new shared components created
- Uses existing patterns: `createResource`, `For`, `Show`
- Follows existing route creation pattern with `createRoute()`

✅ **Components are created only for reuse across routes/flows**: 
- Project list cards are inline in the route (not extracted as components)
- Layout modifications reuse existing `AppShell.tsx` component
- No unnecessary component abstraction

✅ **Architecture stays aligned with Go (Fiber) backend + SolidJS (Vite) SPA**: 
- Frontend changes only (mock data, no backend in this phase)
- Router updates use TanStack Router (already in use)
- Future API contracts documented in OpenAPI format ready for Go/Fiber implementation
- Build output path remains `internal/embed/frontend/dist`

**Post-Design Status**: ✅ PASSED - All design artifacts comply with constitution. Ready for Phase 2 (tasks generation).
