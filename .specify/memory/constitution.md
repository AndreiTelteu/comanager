<!--
Sync Impact Report
- Version change: N/A → 0.1.0
- Modified principles: None (initial adoption)
- Added sections: Core Principles, Technology & Architecture Constraints, Development Workflow & Quality Gates, Governance
- Removed sections: None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs: TODO(RATIFICATION_DATE): original ratification date unknown
-->
# Comanager Constitution

## Core Principles

### E2E-Only Testing with Cypress
Unit tests are forbidden. If tests are requested for a feature, implement
Cypress end-to-end tests only and keep coverage at the user-journey level.
Rationale: a single, consistent E2E testing strategy avoids mixed paradigms.

### SolidJS Minimal Components
Frontend work MUST follow SolidJS best practices and avoid over-componentizing.
Create components only when a UI element is reused across multiple routes or
flows; otherwise keep logic within the route/page. Rationale: reduce churn and
maintain straightforward UI structure.

### Architecture Alignment
Preserve the Go (Fiber) backend and SolidJS (Vite) SPA frontend architecture.
API routes remain under /api, and frontend builds must output to
internal/embed/frontend/dist so the backend can serve the SPA with an index.html
fallback. Rationale: maintain deployable parity between dev and production.

## Technology & Architecture Constraints

- Backend is Go with Fiber; do not introduce alternate server frameworks.
- Frontend is SolidJS with Vite; avoid switching frameworks.
- Build outputs for the SPA must land in internal/embed/frontend/dist.
- Runtime config uses LISTEN_HOST and LISTEN_PORT environment variables.

## Development Workflow & Quality Gates

- Before implementation, confirm requirements and acceptance scenarios are
  expressed as E2E behaviors suitable for Cypress.
- If tests are requested, write Cypress E2E tests only and keep them focused on
  independent user stories.
- Frontend changes must respect the minimal-component rule and SolidJS
  best-practice patterns.

## Governance

- This constitution supersedes all other development guidance.
- Amendments MUST update this document, include a semantic version bump, and
	update dependent templates and guidance files in .specify/templates/.
- Reviews MUST verify compliance with the Core Principles and Workflow gates.
- Versioning policy: MAJOR for breaking governance changes, MINOR for new
	principles/sections, PATCH for clarifications or wording adjustments.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original ratification date unknown | **Last Amended**: 2026-02-03
