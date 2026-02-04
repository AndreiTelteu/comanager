# API Contracts: Projects Organizer

**Feature**: Projects Organizer Page  
**Branch**: `001-projects-organizer`  
**Date**: 2026-02-04  
**Status**: Mock Implementation (No Backend Changes)

## Overview

This document defines the API contracts for the projects organizer feature. Since the spec explicitly requires mock data only, these contracts describe the frontend TypeScript function signatures. When this feature is extended with real backend persistence, this document will serve as the specification for the REST API.

---

## Contract Style

**Current**: TypeScript function signatures (mock/frontend-only)  
**Future**: OpenAPI 3.0 specification for REST endpoints

---

## Contracts

### 1. Get All Projects

**Purpose**: Retrieve all projects for display on the organizer page.

#### TypeScript Signature (Current)

```typescript
/**
 * Get all projects.
 * 
 * @returns Promise resolving to an array of Project objects
 * @throws Never throws in mock implementation
 */
export const getProjects = async (): Promise<Project[]>
```

#### Future REST API (Reference Only)

```
GET /api/projects
```

**Response** (200 OK):
```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Comanager Core",
      "slug": "comanager-core",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

**Errors**: None in mock implementation

---

### 2. Get Project by Slug

**Purpose**: Retrieve a specific project by its slug for displaying in the layout header.

#### TypeScript Signature (Current)

```typescript
/**
 * Get a project by its slug.
 * 
 * @param slug - The URL-safe project identifier
 * @returns Promise resolving to a Project object or undefined if not found
 * @throws Never throws in mock implementation
 */
export const getProjectBySlug = async (
  slug: string
): Promise<Project | undefined>
```

#### Future REST API (Reference Only)

```
GET /api/projects/{slug}
```

**Path Parameters**:
- `slug` (string, required): Project slug

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Comanager Core",
  "slug": "comanager-core",
  "createdAt": "2026-01-15T10:00:00Z"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Project not found",
  "slug": "invalid-slug"
}
```

**Note**: Current mock implementation returns `undefined` instead of throwing/returning 404.

---

## Type Definitions

### Project

```typescript
/**
 * Represents a workspace/project.
 */
export type Project = {
  /** Unique identifier (UUID format) */
  id: string;
  
  /** Human-readable project name (1-100 characters) */
  name: string;
  
  /** URL-safe slug for routing (1-50 chars, lowercase alphanumeric + hyphens) */
  slug: string;
  
  /** ISO 8601 timestamp of when the project was created */
  createdAt: string;
};
```

---

## Modified Contracts

The following existing API functions will be updated to accept `projectSlug` from route params instead of using `DEFAULT_PROJECT_ID`:

### 3. Get Board (Modified)

#### Before
```typescript
export const getBoard = async (
  projectId = DEFAULT_PROJECT_ID
): Promise<Board>
```

#### After
```typescript
export const getBoard = async (
  projectSlug: string  // Now required, no default
): Promise<Board>
```

**Breaking Change**: Yes - callers must provide project slug explicitly.

**Migration**:
```typescript
// Before
const [board] = createResource(() => DEFAULT_PROJECT_ID, getBoard);

// After
const params = useParams();
const [board] = createResource(() => params.projectSlug, getBoard);
```

---

### 4. Create Task (Modified)

#### Before
```typescript
export const createTask = async (
  projectId: string,
  payload: { columnId: string; title: string }
): Promise<Task>
```

#### After
```typescript
export const createTask = async (
  projectSlug: string,  // Parameter name changed for clarity
  payload: { columnId: string; title: string }
): Promise<Task>
```

**Breaking Change**: Parameter name change (semantic only, signature compatible).

---

### 5. Update Task (Modified)

#### Before
```typescript
export const updateTask = async (
  projectId: string,
  taskId: string,
  payload: { columnId?: string; orderIndex?: number; title?: string }
): Promise<Task>
```

#### After
```typescript
export const updateTask = async (
  projectSlug: string,  // Parameter name changed for clarity
  taskId: string,
  payload: { columnId?: string; orderIndex?: number; title?: string }
): Promise<Task>
```

**Breaking Change**: Parameter name change (semantic only, signature compatible).

---

### 6. Get Chat Messages (Modified)

#### Before
```typescript
export const getChatMessages = async (
  projectId = DEFAULT_PROJECT_ID
): Promise<ChatMessage[]>
```

#### After
```typescript
export const getChatMessages = async (
  projectSlug: string  // Now required, no default
): Promise<ChatMessage[]>
```

**Breaking Change**: Yes - callers must provide project slug explicitly.

---

### 7. Send Chat Message (Modified)

#### Before
```typescript
export const sendChatMessage = async (
  projectId: string,
  content: string
): Promise<ChatMessage>
```

#### After
```typescript
export const sendChatMessage = async (
  projectSlug: string,  // Parameter name changed for clarity
  content: string
): Promise<ChatMessage>
```

**Breaking Change**: Parameter name change (semantic only, signature compatible).

---

## Future Backend API Routes (Reference)

When this feature is extended with real backend implementation, the following routes should be added:

```
GET    /api/projects              → List all projects
GET    /api/projects/{slug}       → Get project by slug
POST   /api/projects              → Create new project (out of scope for this feature)

# Existing routes remain, but project ID comes from slug lookup:
GET    /api/projects/{slug}/board
POST   /api/projects/{slug}/tasks
PATCH  /api/projects/{slug}/tasks/{taskId}
GET    /api/projects/{slug}/chat
POST   /api/projects/{slug}/chat
```

**Migration Path**: The mock functions can be replaced with actual `fetch()` calls to these endpoints with minimal caller changes (since function signatures already match).

---

## Error Handling Strategy

### Current (Mock)
- **Not Found**: Return `undefined` (for `getProjectBySlug`)
- **Empty List**: Return empty array (for `getProjects`)
- **Network Errors**: N/A (no network in mock)

### Future (Real API)
- **404 Not Found**: Throw error or return `undefined` (TBD)
- **500 Server Error**: Throw error with message
- **Network Failure**: Throw error with appropriate message

**Consistency Note**: Existing API functions (like `getBoard`) throw errors on failure. New project functions should match this pattern when implemented with real backend.

---

## Validation

### Client-Side (Frontend)
- Project slug format validation before navigation (optional, low priority)
- Project name length validation in future create form (out of scope)

### Server-Side (Future Backend)
- Slug uniqueness constraint
- Slug format regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Name length: 1-100 characters
- Required field validation

---

## Testing Contracts

### Unit Tests (If Permitted)
**Status**: ❌ Not allowed per constitution (E2E only)

### E2E Tests (Cypress)
When tests are requested, the following scenarios should be covered:

1. **GET /api/projects** (or mock equivalent)
   - Returns array of projects
   - Projects have all required fields
   - Empty array when no projects exist

2. **GET /api/projects/{slug}** (or mock equivalent)
   - Returns project when slug is valid
   - Returns undefined/404 when slug is invalid

3. **Navigation with project slug**
   - Kanban route accepts `projectSlug` param
   - Chat route accepts `projectSlug` param
   - Layout header displays correct project name

**Test Location**: `frontend/tests/e2e/projects.spec.ts` (future)

---

## OpenAPI 3.0 Specification (Future Reference)

When implementing the backend, use this as a starting point:

```yaml
openapi: 3.0.0
info:
  title: Comanager Projects API
  version: 1.0.0
  description: Project management endpoints for Comanager

paths:
  /api/projects:
    get:
      summary: List all projects
      operationId: listProjects
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  projects:
                    type: array
                    items:
                      $ref: '#/components/schemas/Project'

  /api/projects/{slug}:
    get:
      summary: Get project by slug
      operationId: getProjectBySlug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      responses:
        '200':
          description: Project found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        '404':
          description: Project not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                  slug:
                    type: string

components:
  schemas:
    Project:
      type: object
      required:
        - id
        - name
        - slug
        - createdAt
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: Human-readable project name
        slug:
          type: string
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
          minLength: 1
          maxLength: 50
          description: URL-safe identifier
        createdAt:
          type: string
          format: date-time
          description: ISO 8601 creation timestamp
```

---

## Summary

### New Contracts
- ✅ `getProjects()`: List all projects
- ✅ `getProjectBySlug(slug)`: Get single project

### Modified Contracts
- ✅ `getBoard(projectSlug)`: Now requires slug instead of using default
- ✅ `createTask(projectSlug, ...)`: Parameter renamed for clarity
- ✅ `updateTask(projectSlug, ...)`: Parameter renamed for clarity
- ✅ `getChatMessages(projectSlug)`: Now requires slug instead of using default
- ✅ `sendChatMessage(projectSlug, ...)`: Parameter renamed for clarity

### Removed Constants
- ✅ `DEFAULT_PROJECT_ID`: No longer needed

**Status**: Contracts defined. Implementation ready to begin.
