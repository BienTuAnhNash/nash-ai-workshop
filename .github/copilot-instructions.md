# Copilot Instructions for Nash AI Workshop

## 1) Project context

- This repository is a workshop-oriented React application.
- Primary goal: fast delivery, clear structure, demo stability.
- Current runtime mode is frontend-only with localStorage data (no backend service).

## 2) Source of truth files

Always align work with these files before making decisions:

- .github/instructions/tech-stack.md
- .github/instructions/test-automation.md
- .github/instructions/ba-agent-rules.md
- docs/architecture/tech-stack.md
- docs/architecture/coding-conventions.md
- docs/architecture/folder-structure.md
- docs/architecture/authentication.md

If conflicts exist, prefer the most specific and most recently updated instruction file in .github/instructions.

## 3) Technology baseline

- Frontend: React 19 + TypeScript + Vite 8
- Router: TanStack Router
- Data/query: TanStack Query
- Validation/forms: zod + react-hook-form
- Styling: Tailwind CSS + ShadCN/Radix patterns
- Local data layer: localStorage mini DB
- Unit/component tests: Vitest + Testing Library + jsdom
- E2E tests: Playwright

## 4) Architecture and code rules

- Keep data access in service layer; do not call localStorage or API directly from UI components.
- Keep route components focused on composition, navigation, and screen-level flow.
- Keep reusable UI primitives inside src/components/ui.
- Keep utility logic pure and unit-testable.
- Prefer explicit types for DTOs, domain models, and service contracts.
- Avoid broad refactors unless the request explicitly asks for it.

## 5) Testing rules

- Unit/component tests belong in tests/components or tests/unit.
- E2E tests belong in tests/e2e.
- Do not mix E2E specs into unit/component folders.
- Use resilient selectors in E2E tests (role/label/text first).
- Avoid fixed delays in E2E tests; prefer waiting by URL/state/locator conditions.

## 6) Commands to validate changes

Run relevant checks before finalizing:

- npm run type-check
- npm run lint
- npm run test
- npm run e2e (only when scope includes E2E behavior)

If a command cannot run, report it clearly with reason and impact.

## 7) Security and reliability guardrails

- Validate user input at boundaries (forms/services).
- Never hardcode secrets.
- Do not log sensitive data.
- Do not swallow errors silently.
- Keep user-facing errors clear and safe.

## 8) Workshop harness alignment

Active collaboration modes in this repository include BA, Dev, and Test workflows.

- BA tasks should follow elicitation and artifact governance rules in .github/instructions/ba-agent-rules.md.
- Dev tasks should follow stack and implementation constraints in .github/instructions/tech-stack.md.
- Test tasks should follow structure and conventions in .github/instructions/test-automation.md.

## 9) Documentation policy

- Update related docs when behavior or architecture changes.
- Keep docs concise, practical, and executable.
- Prefer adding references to existing docs over duplicating content.
