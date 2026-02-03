# Research: Kanban Board and Chat Core

## Migration library

**Decision**: Use golang-migrate with embedded SQL migrations (iofs source) and run migrations at startup before the API listens.

**Rationale**:
- Mature, widely used migration tooling with SQLite support.
- Embedding migrations keeps the binary self-contained.
- Explicit migration lifecycle fits container startup flows.

**Alternatives considered**:
- goose (supports embedded migrations, more moving parts)
- dbmate (simple SQL format, less common in Go)
- Atlas (powerful diff-based workflow, heavier tooling)

## SQLite driver

**Decision**: Use modernc.org/sqlite (pure Go) to avoid CGO build complexity in Docker.

**Rationale**:
- Simplifies builds in containers with no C toolchain required.
- Avoids platform-specific CGO constraints.

**Alternatives considered**:
- mattn/go-sqlite3 (CGO; faster and more mature but requires gcc and libc headers)

## Theming approach (SolidJS + Tailwind v4)

**Decision**: Use a light/dark theme toggle stored in localStorage and applied via a data attribute on the html element.

**Rationale**:
- Minimal component footprint and simple state management.
- Works with existing Tailwind setup and CSS variables.

**Alternatives considered**:
- Class-based "dark" toggle only (less explicit when adding additional themes)
- System-only theme (no user preference persistence)
