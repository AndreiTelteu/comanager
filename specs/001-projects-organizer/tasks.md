---

description: "Task list for Projects Organizer Page feature implementation"
---

# Tasks: Projects Organizer Page

**Input**: Design documents from `/specs/001-projects-organizer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Tests are NOT requested in this feature specification - following Cypress E2E-only policy when tests are requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for frontend, `internal/` for backend (Go)
- Tasks primarily frontend-focused (mock data only, no backend changes)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic data structures

- [ ] T001 Add Project type definition to frontend/src/api.ts
- [ ] T002 [P] Add MOCK_PROJECTS constant with 4 sample projects to frontend/src/api.ts
- [ ] T003 [P] Add getProjects() function to frontend/src/api.ts
- [ ] T004 [P] Add getProjectBySlug(slug: string) function to frontend/src/api.ts
- [ ] T005 Remove DEFAULT_PROJECT_ID constant from frontend/src/api.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core routing infrastructure that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create projects organizer route component in frontend/src/routes/projects.tsx
- [ ] T007 Update router configuration in frontend/src/main.tsx to add projectsRoute for root path
- [ ] T008 Create project parent route with $projectSlug parameter in frontend/src/main.tsx
- [ ] T009 Update existing routes to be children of projectRoute in frontend/src/main.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse projects and open a project (Priority: P1) 🎯 MVP

**Goal**: Display a list of existing projects from mock data and enable navigation to project kanban boards

**Independent Test**: Load "/" route, verify 4 mock projects are displayed, click a project card to navigate to "/{project-slug}/kanban"

### Implementation for User Story 1

- [ ] T010 [P] [US1] Implement ProjectsOrganizerComponent UI with projects list in frontend/src/routes/projects.tsx
- [ ] T011 [P] [US1] Add "Create project" button to projects organizer UI in frontend/src/routes/projects.tsx
- [ ] T012 [US1] Add project card click handler to navigate to /{slug}/kanban in frontend/src/routes/projects.tsx
- [ ] T013 [US1] Update getBoard function signature to accept projectSlug parameter in frontend/src/api.ts
- [ ] T014 [US1] Update kanban route to use params.projectSlug in createResource call in frontend/src/routes/kanban.tsx
- [ ] T015 [US1] Update handleCreateTask to use params.projectSlug in frontend/src/routes/kanban.tsx
- [ ] T016 [US1] Update handleMoveTask to use params.projectSlug in updateTask call in frontend/src/routes/kanban.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view projects list and navigate to kanban boards

---

## Phase 4: User Story 2 - Return to projects overview (Priority: P2)

**Goal**: Enable navigation back from project routes to the projects organizer page

**Independent Test**: Navigate to "/{slug}/kanban", click back button in layout header, verify return to "/" route with projects list visible

### Implementation for User Story 2

- [ ] T017 [P] [US2] Add useParams, useLocation, useNavigate imports to frontend/src/layouts/AppShell.tsx
- [ ] T018 [P] [US2] Import getProjectBySlug function to frontend/src/layouts/AppShell.tsx
- [ ] T019 [US2] Add createResource hook for fetching project by slug in frontend/src/layouts/AppShell.tsx
- [ ] T020 [US2] Add isProjectRoute helper function to check for projectSlug param in frontend/src/layouts/AppShell.tsx
- [ ] T021 [US2] Add back button with navigate('/') onClick handler in sidebar header in frontend/src/layouts/AppShell.tsx
- [ ] T022 [US2] Add conditional Show component to only render back button when isProjectRoute() returns true in frontend/src/layouts/AppShell.tsx
- [ ] T023 [US2] Update sidebar header to conditionally display project name vs "Projects" in frontend/src/layouts/AppShell.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can navigate to projects and back to overview

---

## Phase 5: User Story 3 - Start creating a project (Priority: P3)

**Goal**: Display a visible "Create project" button on the organizer page

**Independent Test**: Load "/" route, verify "Create project" button is visible and clickable (no-op implementation for this feature)

### Implementation for User Story 3

- [ ] T024 [US3] Verify "Create project" button rendering in projects organizer component (already implemented in T011)
- [ ] T025 [US3] Add visual styling to make create button prominent in frontend/src/routes/projects.tsx

**Checkpoint**: All user stories should now be independently functional - projects list, navigation, and create CTA visible

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add project name truncation with max-w-[150px] class in frontend/src/layouts/AppShell.tsx
- [ ] T027 [P] Add title attribute for hover tooltip on truncated project names in frontend/src/layouts/AppShell.tsx
- [ ] T028 Update navigation items to be project-aware with dynamic path prefixes in frontend/src/layouts/AppShell.tsx
- [ ] T029 Hide navigation items when on root "/" route in frontend/src/layouts/AppShell.tsx
- [ ] T030 Update getChatMessages function signature to accept projectSlug parameter in frontend/src/api.ts
- [ ] T031 Update sendChatMessage function signature to accept projectSlug parameter in frontend/src/api.ts
- [ ] T032 Update chat route to use params.projectSlug for getChatMessages in frontend/src/routes/chat.tsx
- [ ] T033 Update chat route to use params.projectSlug for sendChatMessage in frontend/src/routes/chat.tsx
- [ ] T034 Add loading state handling for project name display in frontend/src/layouts/AppShell.tsx
- [ ] T035 Add fallback text "Project not found" for invalid project slugs in frontend/src/layouts/AppShell.tsx
- [ ] T036 [P] Verify all functional requirements (FR-001 through FR-007) are met per spec.md
- [ ] T037 [P] Manual testing validation per quickstart.md checklist
- [ ] T038 Build verification with npm run build in frontend directory

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 layout but independently testable
- **User Story 3 (P3)**: Already included in US1 implementation (T011) - minimal additional work

### Within Each User Story

- Models/types before API functions
- API functions before route components
- Route components before integration
- Core implementation before polish/edge cases

### Parallel Opportunities

- **Phase 1 Tasks**: T002, T003, T004 can all run in parallel (different functions in same file, but isolated)
- **Phase 2 Tasks**: T006 can be done in parallel with T007-T009 (different files)
- **Phase 3 Tasks**: T010, T011 can run together (same component), T013 can run in parallel (different file)
- **Phase 4 Tasks**: T017, T018, T019 can all run together (imports and setup in same file)
- **Phase 6 Tasks**: T026, T027 (layout), T030, T031 (api), T036, T037 (verification) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch API updates in parallel:
Task T013: "Update getBoard function signature to accept projectSlug parameter in frontend/src/api.ts"

# Launch route updates in parallel (different files):
Task T010: "Implement ProjectsOrganizerComponent UI in frontend/src/routes/projects.tsx"
Task T014: "Update kanban route to use params.projectSlug in frontend/src/routes/kanban.tsx"
```

---

## Parallel Example: Polish Phase

```bash
# Launch different file updates in parallel:
Task T026: "Add project name truncation in frontend/src/layouts/AppShell.tsx"
Task T030: "Update getChatMessages in frontend/src/api.ts"
Task T036: "Verify functional requirements per spec.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005) → Data structures ready
2. Complete Phase 2: Foundational (T006-T009) → Routing ready
3. Complete Phase 3: User Story 1 (T010-T016) → Core feature working
4. **STOP and VALIDATE**: Test projects list and kanban navigation independently
5. Deploy/demo if ready

**Result**: Users can see projects and open them - core value delivered

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~45 min)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!) (~60 min)
3. Add User Story 2 → Test independently → Deploy/Demo (~45 min)
4. User Story 3 already included → Quick validation (~10 min)
5. Add Polish tasks → Final refinement (~60 min)
6. Total estimated: ~4 hours

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (projects list + kanban integration)
   - Developer B: User Story 2 (layout header + back navigation)
   - Developer C: Polish tasks (chat integration, validation)
3. Stories complete and integrate independently

---

## Acceptance Criteria Mapping

| Requirement | Implementation | Tasks | Status |
|-------------|----------------|-------|--------|
| FR-001: Projects list at `/` | routes/projects.tsx | T006, T010 | ✅ |
| FR-002: Create project button | routes/projects.tsx | T011, T025 | ✅ |
| FR-003: Route to `/{slug}/kanban` | main.tsx + projects.tsx | T007, T008, T012 | ✅ |
| FR-004: All routes accept projectSlug | main.tsx | T009, T014, T032 | ✅ |
| FR-005: Display project name in header | AppShell.tsx | T019, T023 | ✅ |
| FR-006: Truncate long names | AppShell.tsx | T026, T027 | ✅ |
| FR-007: Back button to `/` | AppShell.tsx | T021, T022 | ✅ |

---

## User Story Test Criteria

### User Story 1: Browse projects and open a project
**Test**: 
1. Navigate to `/`
2. Verify 4 mock projects are displayed (Comanager Core, Marketing Website Redesign, Mobile App MVP, Customer Portal v2)
3. Click on "Comanager Core" project card
4. Verify navigation to `/comanager-core/kanban`
5. Verify kanban board loads successfully

**Success Criteria**: All projects visible, clicking navigates correctly, kanban displays for selected project

### User Story 2: Return to projects overview
**Test**:
1. Navigate to `/comanager-core/kanban`
2. Verify back button (←) is visible in sidebar header
3. Verify project name "Comanager Core" is displayed in header
4. Click back button
5. Verify navigation to `/`
6. Verify projects list is visible again

**Success Criteria**: Back button visible, project name shown, navigation returns to organizer

### User Story 3: Start creating a project
**Test**:
1. Navigate to `/`
2. Verify "Create project" button is visible in top-right of page
3. Click button (no action expected in this feature)

**Success Criteria**: Button is visible, clickable, and prominently styled

---

## Notes

- [P] tasks = different files or independent changes, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests requested for this feature per spec.md
- Mock data only - no backend implementation required
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- Frontend build path remains `internal/embed/frontend/dist` per plan.md
- Estimated total time: ~4 hours per quickstart.md

---

## Summary

**Total Tasks**: 38
**Tasks by User Story**:
- Setup (Phase 1): 5 tasks
- Foundational (Phase 2): 4 tasks
- User Story 1 (P1): 7 tasks
- User Story 2 (P2): 7 tasks
- User Story 3 (P3): 2 tasks
- Polish (Phase 6): 13 tasks

**Parallel Opportunities Identified**: 15 tasks marked [P]

**MVP Scope** (minimum viable): 
- Phase 1 (Setup): T001-T005
- Phase 2 (Foundational): T006-T009
- Phase 3 (User Story 1): T010-T016
- **Total MVP**: 16 tasks, ~2 hours

**Format Validation**: ✅ All tasks follow checklist format with checkbox, ID, optional [P], [Story] labels, and exact file paths
