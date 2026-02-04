# Phase 0: Research & Decisions

**Feature**: Projects Organizer Page  
**Branch**: `001-projects-organizer`  
**Date**: 2026-02-04

## Overview

This document captures research findings and technical decisions for implementing the projects organizer feature. All unknowns from the Technical Context have been resolved through analysis of the existing codebase.

---

## 1. TanStack Router Dynamic Route Parameters

### Decision
Use TanStack Router's path parameter syntax: `path: '/$projectSlug/kanban'` to define dynamic segments.

### Rationale
- TanStack Router v1.131.35 supports path parameters using the `$` prefix convention
- Parameters are type-safe and accessible via `useParams()` hook
- Existing codebase already uses TanStack Router, so this is the natural choice
- Pattern matches React Router v6 conventions which the team may be familiar with

### Alternatives Considered
- **Query parameters** (`/kanban?project=xyz`): Rejected because slugs are primary navigation identifiers, not filters
- **Custom route matching**: Rejected due to unnecessary complexity when framework supports it natively

### Implementation Notes
```typescript
// Route definition pattern
const kanbanRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'kanban',
  component: KanbanRouteComponent,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$projectSlug',
  component: ProjectLayoutComponent,
});

// Access parameter
import { useParams } from '@tanstack/solid-router';
const params = useParams();
const projectSlug = params.projectSlug;
```

### References
- TanStack Router docs: https://tanstack.com/router/latest/docs/framework/solid/guide/route-trees#path-params
- Existing codebase: `frontend/src/main.tsx` (current routing setup)

---

## 2. Mock Data Strategy for Projects

### Decision
Create an in-memory mock array of project objects in `frontend/src/api.ts`, co-located with existing API functions.

### Rationale
- Spec explicitly states "only implement state with mock-data"
- Consistency with existing API layer structure
- Easy to replace with real API calls later
- No backend changes required for this iteration

### Alternatives Considered
- **LocalStorage**: Rejected because spec doesn't require persistence across sessions
- **Backend implementation**: Rejected because spec explicitly says mock data only
- **Separate mock file**: Rejected to keep API concerns in one place

### Implementation Notes
```typescript
// In frontend/src/api.ts
export type Project = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Comanager Core', slug: 'comanager-core', createdAt: '2026-01-15T10:00:00Z' },
  { id: '2', name: 'Marketing Website', slug: 'marketing-website', createdAt: '2026-01-20T14:30:00Z' },
  { id: '3', name: 'Mobile App MVP', slug: 'mobile-app-mvp', createdAt: '2026-02-01T09:15:00Z' },
];

export const getProjects = async (): Promise<Project[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PROJECTS;
};

export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_PROJECTS.find(p => p.slug === slug);
};
```

### References
- Existing pattern: `DEFAULT_PROJECT_ID` constant in `frontend/src/api.ts`

---

## 3. Layout Header Adaptation Strategy

### Decision
Make `AppShell.tsx` project-aware by using TanStack Router's `useParams()` and conditional rendering based on route context.

### Rationale
- `AppShell` is already the centralized layout component
- TanStack Router provides route context via hooks
- Conditional rendering keeps the single layout component pattern (avoids duplication)
- Aligns with SolidJS minimal components principle

### Alternatives Considered
- **Separate ProjectLayout component**: Rejected because it violates minimal components principle (layout not reused in different contexts)
- **Route-level header override**: Rejected because header logic would scatter across multiple route files
- **Context API for project state**: Rejected as over-engineering; route params are sufficient

### Implementation Notes
```typescript
// In frontend/src/layouts/AppShell.tsx
import { useParams, useLocation, useNavigate } from '@tanstack/solid-router';
import { createResource, Show } from 'solid-js';
import { getProjectBySlug } from '../api';

export function AppShell() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only fetch project if we're in a project route
  const [project] = createResource(
    () => params.projectSlug,
    (slug) => slug ? getProjectBySlug(slug) : undefined
  );
  
  const isProjectRoute = () => !!params.projectSlug;
  const isRootRoute = () => location.pathname === '/';
  
  return (
    <div class="min-h-screen bg-gray-50 ...">
      <aside>
        <div class="mb-8 flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Comanager</p>
            <Show when={isProjectRoute()} fallback={<p class="text-lg font-semibold">Workspace</p>}>
              <div class="flex items-center gap-2">
                <button onClick={() => navigate('/')} class="...">←</button>
                <p class="text-lg font-semibold truncate max-w-[150px]" title={project()?.name}>
                  {project()?.name || 'Loading...'}
                </p>
              </div>
            </Show>
          </div>
        </div>
        {/* ... rest of sidebar */}
      </aside>
      {/* ... rest of layout */}
    </div>
  );
}
```

### References
- Existing file: `frontend/src/layouts/AppShell.tsx`
- SolidJS reactivity docs for `createResource`: https://www.solidjs.com/docs/latest/api#createresource

---

## 4. Project Name Truncation Approach

### Decision
Use CSS `truncate` utility (already available via Tailwind) with a `max-w-[Npx]` constraint and HTML `title` attribute for full name on hover.

### Rationale
- Tailwind CSS is already configured in the project (v4.1.13)
- CSS truncation is performant and accessible
- `title` attribute provides UX fallback for long names
- No JavaScript measurement needed

### Alternatives Considered
- **JavaScript string slicing**: Rejected because CSS handles it better across different fonts/sizes
- **Dynamic width calculation**: Rejected as over-engineering for this use case
- **Multi-line with ellipsis**: Rejected because spec asks for truncation to fit

### Implementation Notes
```tsx
<p 
  class="text-lg font-semibold truncate max-w-[150px]" 
  title={project()?.name}
>
  {project()?.name}
</p>
```

The `max-w-[150px]` value can be adjusted based on the actual sidebar width and visual testing.

### References
- Tailwind CSS truncate utility: https://tailwindcss.com/docs/text-overflow
- Existing usage: `postcss.config.mjs`, `package.json` (Tailwind v4.1.13)

---

## 5. Navigation Items Update Strategy

### Decision
Navigation items in the sidebar will be updated to use relative routing within projects when a `projectSlug` is active.

### Rationale
- Preserves the existing `navItems` array pattern
- TanStack Router supports relative navigation
- Sidebar links should stay contextual to the current project
- Avoids breaking navigation when switching projects

### Alternatives Considered
- **Absolute paths always**: Rejected because switching projects would lose context
- **Duplicate nav arrays**: Rejected to avoid code duplication
- **Programmatic link generation**: Rejected as unnecessarily complex

### Implementation Notes
```typescript
// In AppShell.tsx
const navItems = () => {
  const slug = params.projectSlug;
  const prefix = slug ? `/${slug}` : '';
  
  return [
    { label: 'Kanban Board', to: `${prefix}/kanban` },
    { label: 'Chat', to: `${prefix}/chat` },
    { label: 'Specifications', to: `${prefix}/specifications` },
    { label: 'Environment', to: `${prefix}/environment` },
    { label: 'Context', to: `${prefix}/context` },
    { label: 'Memory', to: `${prefix}/memory` },
    { label: 'Settings', to: `${prefix}/settings` },
  ];
};
```

Special case: When on the root `/` route (projects organizer), navigation items should be hidden or show a different set appropriate for the organizer view.

### References
- Existing code: `AppShell.tsx` lines 4-12 (current navItems array)

---

## 6. Default Project Handling

### Decision
Remove the current `DEFAULT_PROJECT_ID` constant and require explicit project selection. The root `/` route shows the organizer; there is no "default" project auto-navigation.

### Rationale
- Spec clearly states `/` should show the projects list, not redirect
- Forces intentional project selection (better UX)
- Aligns with multi-project architecture
- Current `DEFAULT_PROJECT_ID` was a placeholder for single-project mode

### Alternatives Considered
- **Redirect to last-used project**: Rejected because spec doesn't mention persistence
- **Auto-select first project**: Rejected because spec requires explicit user action
- **Keep default for backward compat**: Rejected because this feature replaces the old behavior

### Implementation Notes
```typescript
// In main.tsx - BEFORE
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/kanban" />,
});

// In main.tsx - AFTER
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProjectsOrganizerComponent,
});

// Projects route becomes parent
const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$projectSlug',
  component: ProjectLayoutWrapper, // Optional intermediate component
});

const kanbanRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'kanban',
  component: KanbanRouteComponent,
});
```

### Migration Impact
- API calls currently using `DEFAULT_PROJECT_ID` will need to accept `projectSlug` from route params
- Existing routes must be nested under the `$projectSlug` route

### References
- Current code: `frontend/src/main.tsx` lines 47-51 (indexRoute)
- Current code: `frontend/src/api.ts` line 3 (DEFAULT_PROJECT_ID)

---

## Summary of Key Technologies & Patterns

| Area | Technology/Pattern | Version/Details |
|------|-------------------|-----------------|
| Frontend Framework | SolidJS | 1.9.9 |
| Routing | TanStack Router | 1.131.35 |
| Styling | Tailwind CSS | 4.1.13 |
| Build Tool | Vite | 7.1.10 |
| Type System | TypeScript | 5.9.2 |
| Backend | Go + Fiber | Go 1.25.6, Fiber v2 |
| Data (Mock) | In-memory arrays | N/A |

---

## Open Questions & Future Considerations

### Resolved
✅ How to handle project slug in routes → Use TanStack Router path params  
✅ Where to store mock data → In `api.ts` as exported constant  
✅ How to show project name in header → Conditional rendering in AppShell  
✅ How to truncate long names → CSS truncate utility + max-width  
✅ Should `/` redirect or show list → Show list per spec  

### Deferred (Not in Scope)
- Actual project creation implementation (spec only requires the button to be visible)
- Project persistence (spec explicitly says mock data)
- Project editing/deletion
- Project search/filtering
- Empty state when no projects exist (noted as edge case, not required for P1-P3 stories)

---

**Research Complete**: All technical decisions documented. Ready to proceed to Phase 1 (Design & Contracts).
