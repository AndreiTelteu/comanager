# Data Model: Kanban Board and Chat Core

## Entities

### Project (Workspace)
Represents a user project with its own persisted data directory and database.

- **id**: string (stable identifier; derived from folder name or generated slug)
- **name**: string
- **rootPath**: string (absolute path to project files under /app/projects)
- **dataPath**: string (absolute path under /app/data/<project>)
- **dbPath**: string (absolute path under /app/data/<project>/project.db)
- **createdAt**: datetime
- **updatedAt**: datetime

Relationships:
- Project has one Board.
- Project has one ChatThread.
- Project has many Attachments.

### Board
The kanban board for a project.

- **id**: string
- **projectId**: string (FK -> Project)
- **name**: string
- **createdAt**: datetime
- **updatedAt**: datetime

Relationships:
- Board has many Columns.

### Column
A workflow stage (e.g., To Do, In Progress, Done).

- **id**: string
- **boardId**: string (FK -> Board)
- **name**: string
- **orderIndex**: integer
- **createdAt**: datetime
- **updatedAt**: datetime

Relationships:
- Column has many Tasks.

### Task
A single work item on the board.

- **id**: string
- **columnId**: string (FK -> Column)
- **title**: string
- **orderIndex**: integer
- **createdAt**: datetime
- **updatedAt**: datetime

### ChatThread
The conversation container for a project.

- **id**: string
- **projectId**: string (FK -> Project)
- **createdAt**: datetime
- **updatedAt**: datetime

Relationships:
- ChatThread has many ChatMessages.

### ChatMessage
A user or system message in the chat.

- **id**: string
- **threadId**: string (FK -> ChatThread)
- **role**: string (user|system)
- **content**: text
- **isInformational**: boolean
- **createdAt**: datetime

### Attachment
A file stored under a project data directory.

- **id**: string
- **projectId**: string (FK -> Project)
- **fileName**: string
- **mimeType**: string
- **sizeBytes**: integer
- **storagePath**: string (absolute path under /app/data/<project>/attachments)
- **createdAt**: datetime

## Validation Rules

- Task title is required and must be <= 200 characters.
- Column orderIndex and Task orderIndex are contiguous within their parents.
- ChatMessage content is required; empty messages are rejected.
- System messages must set isInformational = true.

## State Transitions

- Task moves between columns by updating columnId and orderIndex.
- Column order is changed by updating orderIndex on multiple rows.
- Default board hydration creates three columns if none exist.
