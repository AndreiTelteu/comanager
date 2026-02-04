# Quickstart Guide: Projects Organizer

**Feature**: Projects Organizer Page  
**Branch**: `001-projects-organizer`  
**Date**: 2026-02-04

## Overview

This quickstart guide provides a step-by-step implementation roadmap for the Projects Organizer feature. Use this as a reference during implementation to ensure all components are built in the correct order and dependencies are satisfied.

---

## Prerequisites

Before starting implementation, ensure:

✅ You have read `spec.md` and understand the functional requirements  
✅ You have reviewed `research.md` for technical decisions  
✅ You have reviewed `data-model.md` for entity structures  
✅ You have reviewed `contracts/api.md` for API signatures  
✅ Your local development environment is set up:
   - Go 1.25.6 installed
   - Node.js/Bun for frontend tooling
   - Code editor with TypeScript/Go support

---

## Implementation Order

### Phase 1: Core Data & API Layer (Frontend)

**Estimated Time**: 30 minutes

#### 1.1 Add Project Type and Mock Data

**File**: `frontend/src/api.ts`

1. Add the `Project` type definition:
```typescript
export type Project = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};
```

2. Add mock projects constant:
```typescript
export const MOCK_PROJECTS: Project[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Comanager Core',
    slug: 'comanager-core',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Marketing Website Redesign',
    slug: 'marketing-website',
    createdAt: '2026-01-20T14:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Mobile App MVP',
    slug: 'mobile-app-mvp',
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Customer Portal v2',
    slug: 'customer-portal-v2',
    createdAt: '2026-02-03T11:45:00Z',
  },
];
```

3. Add API functions:
```typescript
export const getProjects = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...MOCK_PROJECTS];
};

export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_PROJECTS.find(p => p.slug === slug);
};
```

4. **Remove** the `DEFAULT_PROJECT_ID` constant (no longer needed)

5. Update existing API functions to use `projectSlug` parameter:
   - `getBoard(projectSlug: string)`
   - `createTask(projectSlug: string, payload)`
   - `updateTask(projectSlug: string, taskId, payload)`
   - `getChatMessages(projectSlug: string)`
   - `sendChatMessage(projectSlug: string, content)`

**Verification**: TypeScript should compile without errors. No runtime testing yet.

---

### Phase 2: Projects Organizer Route

**Estimated Time**: 45 minutes

#### 2.1 Create Projects Route Component

**File**: `frontend/src/routes/projects.tsx`

```typescript
import { createResource, For } from 'solid-js';
import { createRoute, useNavigate } from '@tanstack/solid-router';
import type { AnyRoute } from '@tanstack/solid-router';
import { getProjects } from '../api';

export const createProjectsRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: ProjectsOrganizerComponent,
  });

function ProjectsOrganizerComponent() {
  const navigate = useNavigate();
  const [projects] = createResource(getProjects);

  return (
    <div class="space-y-6">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Projects
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a project to continue working or create a new one.
          </p>
        </div>
        <button class="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
          Create project
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={projects()}>
          {(project) => (
            <button
              onClick={() => navigate(`/${project.slug}/kanban`)}
              class="rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
```

**Verification**: Component should render a list of 4 projects with a create button.

---

### Phase 3: Update Router Configuration

**Estimated Time**: 30 minutes

#### 3.1 Modify Main Router

**File**: `frontend/src/main.tsx`

1. Import the new route:
```typescript
import { createProjectsRoute } from './routes/projects';
```

2. Replace the index route:
```typescript
// REMOVE THIS:
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/kanban" />,
});

// ADD THIS:
const projectsRoute = createProjectsRoute(rootRoute);
```

3. Create a project layout route (intermediate parent):
```typescript
const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$projectSlug',
  component: () => <Outlet />, // Pass-through for now
});
```

4. Update existing routes to be children of `projectRoute`:
```typescript
// Update these routes:
const kanbanRoute = createKanbanRoute(projectRoute);  // was: rootRoute
const chatRoute = createChatRoute(projectRoute);      // was: rootRoute
const specificationsRoute = createPlaceholderRoute(projectRoute, 'specifications', {...});
const environmentRoute = createPlaceholderRoute(projectRoute, 'environment', {...});
const contextRoute = createPlaceholderRoute(projectRoute, 'context', {...});
const memoryRoute = createPlaceholderRoute(projectRoute, 'memory', {...});
const settingsRoute = createPlaceholderRoute(projectRoute, 'settings', {...});
```

5. Update the route tree:
```typescript
const routeTree = rootRoute.addChildren([
  projectsRoute,  // NEW: root route shows projects
  projectRoute.addChildren([
    kanbanRoute,
    chatRoute,
    specificationsRoute,
    environmentRoute,
    contextRoute,
    memoryRoute,
    settingsRoute,
  ]),
]);
```

**Verification**: 
- Navigate to `/` → Should show projects organizer
- Click a project → Should navigate to `/{slug}/kanban`

---

### Phase 4: Update Existing Routes to Use Project Slug

**Estimated Time**: 45 minutes

#### 4.1 Update Kanban Route

**File**: `frontend/src/routes/kanban.tsx`

1. Import `useParams`:
```typescript
import { useParams } from '@tanstack/solid-router';
```

2. Remove `DEFAULT_PROJECT_ID` import

3. In `KanbanRouteComponent`, get project slug:
```typescript
function KanbanRouteComponent() {
  const params = useParams();
  // ... existing state ...

  const [boardResult, { refetch }] = createResource(
    () => params.projectSlug,  // Changed from: () => DEFAULT_PROJECT_ID
    getBoard,
  );

  // ... rest stays the same until task creation/update ...

  const handleCreateTask = async (title: string) => {
    // ... existing logic ...
    try {
      const created = await createTask(params.projectSlug, {  // Changed from: DEFAULT_PROJECT_ID
        columnId: firstColumn.id,
        title,
      });
      // ... rest stays the same ...
    } catch {
      // ... error handling ...
    }
  };

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    setColumns((current) => {
      const { next, moved, nextOrderIndex } = moveTask(/*...*/);
      if (moved && nextOrderIndex !== undefined) {
        updateTask(params.projectSlug, taskId, {  // Changed from: DEFAULT_PROJECT_ID
          columnId: toColumnId,
          orderIndex: nextOrderIndex,
        }).catch(() => {
          refetch();
        });
      }
      return next;
    });
  };

  // ... rest of component ...
}
```

**Verification**: Kanban board should load when navigating to `/{slug}/kanban`.

---

#### 4.2 Update Chat Route

**File**: `frontend/src/routes/chat.tsx`

Similar changes:
1. Import `useParams`
2. Replace `DEFAULT_PROJECT_ID` with `params.projectSlug` in:
   - `getChatMessages(params.projectSlug)`
   - `sendChatMessage(params.projectSlug, content)`

---

### Phase 5: Update Layout Header

**Estimated Time**: 60 minutes

#### 5.1 Make AppShell Project-Aware

**File**: `frontend/src/layouts/AppShell.tsx`

1. Add imports:
```typescript
import { useParams, useLocation, useNavigate } from '@tanstack/solid-router';
import { createResource, Show } from 'solid-js';
import { getProjectBySlug } from '../api';
```

2. In the component body:
```typescript
export function AppShell() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [project] = createResource(
    () => params.projectSlug,
    (slug) => slug ? getProjectBySlug(slug) : undefined
  );

  const isProjectRoute = () => !!params.projectSlug;

  // ... rest of component ...
}
```

3. Update the sidebar header:
```typescript
<div class="mb-8 flex items-center justify-between">
  <div class="flex items-center gap-2">
    <Show when={isProjectRoute()}>
      <button 
        onClick={() => navigate('/')}
        class="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Back to projects"
      >
        ←
      </button>
    </Show>
    <div>
      <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Comanager</p>
      <Show 
        when={isProjectRoute()} 
        fallback={<p class="text-lg font-semibold">Projects</p>}
      >
        <p 
          class="text-lg font-semibold truncate max-w-[150px]" 
          title={project()?.name}
        >
          {project()?.name || 'Loading...'}
        </p>
      </Show>
    </div>
  </div>
</div>
```

4. Update navigation items to be project-aware:
```typescript
const navItemsData = () => {
  const slug = params.projectSlug;
  if (!slug) return []; // Hide nav on projects organizer page
  
  const prefix = `/${slug}`;
  return [
    { label: 'Kanban Board', to: `${prefix}/kanban` },
    { label: 'Specifications', to: `${prefix}/specifications` },
    { label: 'Chat', to: `${prefix}/chat` },
    { label: 'Environment', to: `${prefix}/environment` },
    { label: 'Context', to: `${prefix}/context` },
    { label: 'Memory', to: `${prefix}/memory` },
    { label: 'Settings', to: `${prefix}/settings` },
  ];
};

// ... later in JSX:
<nav class="space-y-1">
  <For each={navItemsData()}>
    {(item) => (
      <Link
        class="..."
        to={item.to}
        activeProps={{...}}
      >
        <span>{item.label}</span>
        <span class="text-[10px] text-gray-400">↗</span>
      </Link>
    )}
  </For>
</nav>
```

**Verification**:
- On `/`: Sidebar should show "Projects" (no back button, no nav items)
- On `/{slug}/kanban`: Sidebar should show project name (with back button, nav items visible)
- Long project names should truncate with ellipsis

---

### Phase 6: Testing & Validation

**Estimated Time**: 30 minutes

#### 6.1 Manual Testing Checklist

- [ ] Navigate to `/` → Projects list loads
- [ ] 4 mock projects are displayed
- [ ] "Create project" button is visible (no-op for now)
- [ ] Click on a project → Navigates to `/{slug}/kanban`
- [ ] Kanban board loads for the selected project
- [ ] Project name appears in sidebar header
- [ ] Back button (`←`) is visible in sidebar
- [ ] Click back button → Returns to `/`
- [ ] Navigate to `/{slug}/chat` → Chat loads
- [ ] Navigate to `/{slug}/specifications` → Placeholder loads
- [ ] All routes accept `projectSlug` parameter
- [ ] Long project name truncates in header (test by adding a long name to mock data)
- [ ] Hover over truncated name shows full title

#### 6.2 Edge Cases to Test

- [ ] Navigate to `/invalid-slug/kanban` → Layout shows "Project not found"
- [ ] Sidebar nav items only show when on project route
- [ ] Refreshing page on `/{slug}/kanban` maintains state

---

## Common Issues & Solutions

### Issue 1: TypeScript Error on `params.projectSlug`

**Error**: `Property 'projectSlug' does not exist on type 'RouteParams'`

**Solution**: Ensure the route is defined with `path: '$projectSlug'` and is a parent of the accessing route.

---

### Issue 2: Routes Don't Update When Switching Projects

**Cause**: React resources may be caching based on old keys.

**Solution**: Ensure `createResource` uses `() => params.projectSlug` as the source, not a static value.

---

### Issue 3: Sidebar Navigation Items Point to Wrong Project

**Cause**: Navigation items use hardcoded paths.

**Solution**: Make `navItems` a function that reads `params.projectSlug` and prefixes all paths.

---

### Issue 4: Back Button Doesn't Appear

**Cause**: Conditional rendering logic is reversed.

**Solution**: Use `<Show when={isProjectRoute()}>` around the back button.

---

## File Modification Checklist

Use this checklist to ensure all files are updated:

- [x] `frontend/src/api.ts` - Add Project type, mock data, new functions, remove DEFAULT_PROJECT_ID
- [x] `frontend/src/routes/projects.tsx` - Create new route component
- [x] `frontend/src/routes/kanban.tsx` - Update to use params.projectSlug
- [x] `frontend/src/routes/chat.tsx` - Update to use params.projectSlug
- [x] `frontend/src/main.tsx` - Update router configuration
- [x] `frontend/src/layouts/AppShell.tsx` - Make project-aware, add back button
- [ ] `frontend/src/routes/placeholders.tsx` - No changes needed (already accepts parent route)

---

## Post-Implementation Steps

1. **Verify Build**: Run `cd frontend && npm run build` to ensure production build works
2. **Test Dev Mode**: Run `cd frontend && npm run dev` and manually test all user stories
3. **Code Review**: Review changes against spec requirements (FR-001 through FR-007)
4. **Documentation**: Update README if needed (likely not necessary for this feature)

---

## Next Steps (Out of Scope for This Feature)

The following are **not** part of this feature but are documented for future work:

- [ ] Implement actual project creation functionality
- [ ] Add backend API endpoints for projects
- [ ] Add Cypress E2E tests (only if tests are requested)
- [ ] Implement empty state for zero projects
- [ ] Add project search/filtering
- [ ] Add project editing/deletion
- [ ] Persist project selection in localStorage
- [ ] Add project-level settings

---

## Acceptance Criteria Mapping

Use this to verify all requirements are met:

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| FR-001: Projects list at `/` | `routes/projects.tsx` | ✅ |
| FR-002: Create project button | `routes/projects.tsx` (button rendered) | ✅ |
| FR-003: Route to `/{slug}/kanban` | `main.tsx` router config | ✅ |
| FR-004: All routes accept projectSlug | `main.tsx` (nested under projectRoute) | ✅ |
| FR-005: Display project name in header | `AppShell.tsx` (conditional rendering) | ✅ |
| FR-006: Truncate long names | `AppShell.tsx` (CSS truncate) | ✅ |
| FR-007: Back button to `/` | `AppShell.tsx` (back button with navigate) | ✅ |

---

## Time Estimate Summary

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Data & API | 30 min |
| Phase 2: Projects Route | 45 min |
| Phase 3: Router Config | 30 min |
| Phase 4: Update Routes | 45 min |
| Phase 5: Layout Header | 60 min |
| Phase 6: Testing | 30 min |
| **Total** | **~4 hours** |

*Actual time may vary based on familiarity with TanStack Router and SolidJS.*

---

**Quickstart Complete**: Follow this guide sequentially for smooth implementation. Refer back to research.md and data-model.md as needed for detailed technical decisions.
