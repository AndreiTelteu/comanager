---

description: "Task list for kanban and chat core"
---

# Tasks: Kanban Board and Chat Core

**Input**: Design documents from `/specs/001-kanban-chat-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested. Do not add test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify backend dependencies in go.mod (add Fiber, golang-migrate, modernc.org/sqlite) in go.mod
- [ ] T002 Verify frontend dependencies (TanStack Router, Tailwind v4) in frontend/package.json
- [ ] T003 [P] Add migration embed scaffold in internal/embed/embed.go
- [ ] T004 [P] Add backend config defaults for LISTEN_HOST/LISTEN_PORT in internal/server/config.go

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create project discovery and data directory initialization in internal/server/server.go
- [ ] T006 Implement per-project SQLite connection management in internal/server/server.go
- [ ] T007 Add embedded migration runner using golang-migrate in internal/server/server.go
- [ ] T008 Create base SQL migrations for projects, boards, columns, tasks, chat threads, chat messages in internal/embed/migrations/001_init.sql
- [ ] T009 Seed default board, columns, and chat thread if empty in internal/server/server.go
- [ ] T010 [P] Add data access helpers for board/task/chat queries in internal/server/repository.go
- [ ] T011 [P] Wire API router base and middleware in internal/handlers/routes.go

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Manage tasks on a kanban board (Priority: P1) 🎯 MVP

**Goal**: Create tasks and move them across columns with persisted state.

**Independent Test**: Create a task, move it across columns, reload the app, and confirm it stays in the new column.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement board read endpoint in internal/handlers/api.go (GET /projects/{projectId}/board)
- [ ] T013 [P] [US1] Implement task create endpoint in internal/handlers/api.go (POST /projects/{projectId}/tasks)
- [ ] T014 [P] [US1] Implement task update/move endpoint in internal/handlers/api.go (PATCH /projects/{projectId}/tasks/{taskId})
- [ ] T015 [P] [US1] Add API client helpers for board/tasks in frontend/src/api.ts
- [ ] T016 [US1] Build Kanban route and data loader in frontend/src/routes/kanban.tsx
- [ ] T017 [US1] Implement Kanban board UI with columns and task cards in frontend/src/components/kanban/Board.tsx
- [ ] T018 [US1] Add create-task form and validation in frontend/src/components/kanban/CreateTask.tsx
- [ ] T019 [US1] Implement drag-and-drop interactions and persistence in frontend/src/components/kanban/Board.tsx
- [ ] T020 [US1] Persist task ordering and column placement updates via API in frontend/src/components/kanban/Board.tsx

**Checkpoint**: User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - Navigate between Kanban and Chat (Priority: P2)

**Goal**: Provide left navigation with links to Kanban, Chat, and placeholders.

**Independent Test**: Navigate between Kanban and Chat using the left menu and confirm state persists.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create app shell layout with sidebar in frontend/src/layouts/AppShell.tsx
- [ ] T022 [P] [US2] Define routes for Kanban, Chat, and placeholders in frontend/src/main.tsx
- [ ] T023 [US2] Implement placeholder pages in frontend/src/routes/placeholders.tsx
- [ ] T024 [US2] Style sidebar and active state in frontend/src/styles.css

**Checkpoint**: User Story 2 is fully functional and independently testable

---

## Phase 5: User Story 3 - Chat about development tasks (Priority: P3)

**Goal**: Provide a chat timeline with user messages and informational responses.

**Independent Test**: Send a message and confirm it appears with an informational system response.

### Implementation for User Story 3

- [ ] T025 [P] [US3] Implement chat list endpoint in internal/handlers/api.go (GET /projects/{projectId}/chat)
- [ ] T026 [P] [US3] Implement chat create endpoint with informational response in internal/handlers/api.go (POST /projects/{projectId}/chat)
- [ ] T027 [P] [US3] Add API client helpers for chat in frontend/src/api.ts
- [ ] T028 [US3] Build Chat route and data loader in frontend/src/routes/chat.tsx
- [ ] T029 [US3] Implement chat timeline UI in frontend/src/components/chat/ChatTimeline.tsx
- [ ] T030 [US3] Implement chat input and send flow with validation in frontend/src/components/chat/ChatInput.tsx

**Checkpoint**: User Story 3 is fully functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T031 [P] Add light/dark theme toggle and persistence in frontend/src/components/ThemeToggle.tsx
- [ ] T032 Update global styles and layout polish in frontend/src/styles.css
- [ ] T033 Validate quickstart steps and update docs if needed in specs/001-kanban-chat-core/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - no dependencies
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - no dependencies

### Parallel Opportunities

- Phase 1: T003 and T004 can run in parallel
- Phase 2: T010 and T011 can run in parallel
- Phase 3 (US1): T012, T013, T014, T015 can run in parallel
- Phase 4 (US2): T021 and T022 can run in parallel
- Phase 5 (US3): T025, T026, T027 can run in parallel
- Phase 6: T031 and T032 can run in parallel

---

## Parallel Example: User Story 1

- T012 [P] [US1] Implement board read endpoint in internal/handlers/api.go (GET /projects/{projectId}/board)
- T013 [P] [US1] Implement task create endpoint in internal/handlers/api.go (POST /projects/{projectId}/tasks)
- T014 [P] [US1] Implement task update/move endpoint in internal/handlers/api.go (PATCH /projects/{projectId}/tasks/{taskId})
- T015 [P] [US1] Add API client helpers for board/tasks in frontend/src/api.ts

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Polish & cross-cutting improvements
