# Phase 1: Data Model

**Feature**: Projects Organizer Page  
**Branch**: `001-projects-organizer`  
**Date**: 2026-02-04

## Overview

This document defines the data entities required for the projects organizer feature. Since the spec explicitly requires mock data only, this model reflects the frontend TypeScript types without backend persistence.

---

## Entities

### 1. Project

Represents a workspace/project that contains kanban boards, chat threads, and other resources.

#### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | `string` | Yes | Unique identifier (UUID format) | Must be non-empty |
| `name` | `string` | Yes | Human-readable project name | 1-100 characters |
| `slug` | `string` | Yes | URL-safe identifier for routing | Lowercase alphanumeric + hyphens, 1-50 chars |
| `createdAt` | `string` | Yes | ISO 8601 timestamp of creation | Valid ISO 8601 date-time |

#### TypeScript Definition

```typescript
export type Project = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};
```

#### Relationships
- One Project → One Board (existing entity, referenced via `projectId`)
- One Project → Many ChatMessages (existing entity, via `threadId` or project context)

#### State Transitions
No state machine required for this feature. Projects are read-only in this implementation (creation is out of scope).

---

## Modified Entities

### Existing: Board

**Current Definition** (from `api.ts`):
```typescript
export type Board = {
  id: string;
  projectId: string;  // ← Already has project reference
  name: string;
  columns: Column[];
};
```

**Changes**: None required. The `Board` entity already has a `projectId` field, which will now be populated with the selected project's ID instead of `DEFAULT_PROJECT_ID`.

---

### Existing: Task

**Current Definition** (from `api.ts`):
```typescript
export type Task = {
  id: string;
  columnId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};
```

**Changes**: None required. Tasks are scoped to columns, which are scoped to boards, which are scoped to projects.

---

### Existing: ChatMessage

**Current Definition** (from `api.ts`):
```typescript
export type ChatMessage = {
  id: string;
  threadId: string;
  role: 'user' | 'system';
  content: string;
  isInformational: boolean;
  createdAt: string;
};
```

**Changes**: None required. Chat messages are already associated with threads, which will be project-scoped via API routes.

---

## Mock Data Schema

### MOCK_PROJECTS

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

**Rationale**:
- 4 projects provide sufficient variety for testing navigation and UI
- Mix of short and longer names tests truncation behavior
- Different creation dates allow for potential sorting tests in the future
- UUID-like IDs maintain consistency with backend patterns

---

## Validation Rules

### Project Name
- **Length**: 1-100 characters
- **Format**: Any Unicode string (emojis allowed)
- **Uniqueness**: Not enforced in mock data (would be backend responsibility)

### Project Slug
- **Length**: 1-50 characters
- **Format**: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase alphanumeric with hyphens)
- **Uniqueness**: Must be unique (enforced in mock data array)
- **Constraints**: Cannot start or end with hyphen, no consecutive hyphens

**Slug Generation Logic** (not implemented in this phase, documented for future):
```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}
```

---

## API Contracts (Mock Implementation)

### Get All Projects

```typescript
/**
 * Retrieves all projects for the organizer page.
 * Mock implementation returns hardcoded array.
 */
export const getProjects = async (): Promise<Project[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...MOCK_PROJECTS]; // Return copy to prevent mutations
};
```

**Returns**: Array of `Project` objects, ordered by `createdAt` (newest first when displayed)

---

### Get Project by Slug

```typescript
/**
 * Retrieves a single project by its slug.
 * Used by layout header to display active project name.
 */
export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_PROJECTS.find(p => p.slug === slug);
};
```

**Parameters**:
- `slug` (string): The project slug from route params

**Returns**:
- `Project` object if found
- `undefined` if no project matches the slug

**Error Handling**: Returns `undefined` instead of throwing. Consuming code should handle missing projects gracefully.

---

## Data Flow Diagrams

### User Opens Project

```
┌─────────────────┐
│ User clicks     │
│ project card    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Navigate to             │
│ /{slug}/kanban          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AppShell detects        │
│ projectSlug param       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ getProjectBySlug(slug)  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Display project name    │
│ in header with back btn │
└─────────────────────────┘
```

### User Returns to Organizer

```
┌─────────────────┐
│ User clicks     │
│ back button     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Navigate to /           │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Projects organizer      │
│ route renders           │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ getProjects() called    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Display project list    │
│ with create button      │
└─────────────────────────┘
```

---

## Edge Cases & Error Handling

### Empty Project List
**Scenario**: `MOCK_PROJECTS` is an empty array  
**Handling**: Display empty state message (spec notes this as edge case)  
**Implementation**: Not required for P1-P3 user stories, but documented for completeness

```tsx
<Show when={projects().length > 0} fallback={
  <div class="text-center py-12">
    <p class="text-gray-500">No projects yet. Create your first project to get started.</p>
  </div>
}>
  {/* Project list */}
</Show>
```

---

### Project Not Found
**Scenario**: User navigates to `/{invalid-slug}/kanban`  
**Handling**: `getProjectBySlug` returns `undefined`, layout shows "Project not found" or "Loading..."  
**Implementation**: Display fallback text in header

```tsx
<p class="text-lg font-semibold">
  {project() ? project()!.name : 'Project not found'}
</p>
```

---

### Long Project Names
**Scenario**: Project name exceeds available header space  
**Handling**: CSS truncation with `title` attribute for full name on hover  
**Example**:

```tsx
<p 
  class="text-lg font-semibold truncate max-w-[150px]" 
  title={project()?.name}
>
  {project()?.name}
</p>
```

Input: `"Super Long Project Name That Should Be Truncated"`  
Display: `"Super Long Project Name..."`  
Hover: Full name in tooltip

---

## Database Schema (Future)

**Not implemented in this feature**, but documented for reference when transitioning from mock to real data:

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) >= 1 AND length(name) <= 100),
  slug TEXT NOT NULL UNIQUE CHECK(length(slug) >= 1 AND length(slug) <= 50),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
```

**Rationale**: SQLite is already in use (modernc.org/sqlite), so schema follows SQLite conventions.

---

## Summary

### New Entities
- ✅ **Project**: Core entity representing a workspace

### Modified Entities
- ✅ **Board**: No changes (already has `projectId`)
- ✅ **Task**: No changes (scoped via Board)
- ✅ **ChatMessage**: No changes (scoped via thread)

### Validation Implemented
- ✅ Project slug format (mock data follows pattern)
- ✅ Field constraints (types enforce structure)

### Mock Data
- ✅ 4 sample projects defined
- ✅ Variety in names and dates for testing

**Status**: Data model complete. Ready for contract generation (Phase 1, next step).
