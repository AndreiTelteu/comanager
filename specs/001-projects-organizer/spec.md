# Feature Specification: Projects Organizer Page

**Feature Branch**: `001-projects-organizer`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "lets specify a new feature, new page, projects organizer "/". on pageload it will show the existing projects (only implement state with mock-data). and a button to create a new project. when you open a project it opens `/{project-slug}/kanban`. you should change all the existing routes to accept this new slug parameter, in tanstack router. in the layout ui, top-left under COMANAGER instead of Workspace you should show the project name, truncated to max width to fit, with a back button to to back to "/" all projects list/overview."

## User Scenarios & Testing *(mandatory)*

**Testing Policy**: If tests are requested, they MUST be Cypress E2E tests only.

### User Story 1 - Browse projects and open a project (Priority: P1)

As a user
I want to see a list of existing projects on the projects organizer page
So that I can open a project and continue work in its kanban view.

**Why this priority**: This is the core navigation path for getting into a project.

**Independent Test**: Can be fully tested by loading the organizer page, verifying mock projects are listed, and selecting one to navigate to its kanban page.

**Acceptance Scenarios**:

1. **Given** the projects organizer page is loaded, **When** the page renders, **Then** a list of existing projects from mock data is visible.
2. **Given** a project is listed, **When** I select it, **Then** I am routed to `/{project-slug}/kanban` for that project.

---

### User Story 2 - Return to projects overview (Priority: P2)

As a user
I want to return to the projects organizer from within a project
So that I can switch to a different project.

**Why this priority**: Enables navigation back to the overview without manual URL changes.

**Independent Test**: Can be fully tested by opening a project and using the back control in the layout to return to the organizer.

**Acceptance Scenarios**:

1. **Given** I am viewing a project route, **When** I use the back button in the layout, **Then** I am routed to `/` and the organizer list is visible.

---

### User Story 3 - Start creating a project (Priority: P3)

As a user
I want a clear action to create a new project
So that I can begin adding a new project when ready.

**Why this priority**: Establishes the primary call-to-action on the organizer page.

**Independent Test**: Can be fully tested by loading the organizer page and verifying a create project button is present.

**Acceptance Scenarios**:

1. **Given** I am on the projects organizer page, **When** the page renders, **Then** a "Create project" button is visible and actionable.

---

### Edge Cases

- What happens when the mock project list is empty?
- How does the layout behave if the project name is longer than the available space?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a projects organizer page at `/` that lists existing projects using mock data on initial load.
- **FR-002**: System MUST provide a visible "Create project" call-to-action on the organizer page.
- **FR-003**: System MUST route to `/{project-slug}/kanban` when a project is opened from the organizer list.
- **FR-004**: System MUST update all existing TanStack Router routes to include the `projectSlug` parameter where applicable.
- **FR-005**: System MUST display the active project name in the layout header when on project routes.
- **FR-006**: System MUST truncate long project names to fit the available header space.
- **FR-007**: System MUST provide a back button in the layout header that returns the user to `/`.

### Key Entities *(include if feature involves data)*

- **Project**: Represents a workspace with attributes including name and slug, used for routing and display.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open any listed project and reach its kanban page without manual URL edits.
- **SC-002**: Users can return to the projects organizer within one action from any project route.
- **SC-003**: The organizer page renders mock projects and the create button on first load without errors.
