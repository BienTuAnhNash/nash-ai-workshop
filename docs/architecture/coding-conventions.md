# Coding Conventions

## 1) General Principles

- Prefer clear, readable, and maintainable code over premature optimization.
- Each function should focus on one main responsibility.
- Avoid magic values; use clearly named constants.
- Follow a fail-fast approach and validate early at boundaries (form input, service input).

## 2) TypeScript Rules

- Always define types for DTOs, responses, and domain models.
- Avoid any unless there is a clear reason and a short explanation.
- Prefer type narrowing and union types over manual type casting.
- Use interface for object contracts and type for utility/composition types.

## 3) Naming Conventions

- Components: PascalCase (example: SignInForm, AppSidebar).
- Hooks: camelCase, starting with use (example: useSignin, useMe).
- Functions/variables: camelCase with business-meaningful names.
- Constants: UPPER_SNAKE_CASE for global constants, camelCase for local constants.
- Route constants must be semantically correct and not misleading.

## 4) React Component Conventions

- Keep UI components presentational; avoid embedding deep business logic.
- Container/route components are responsible for data hooks and navigation.
- Maintain clear controlled states: loading, success, and error.
- Keep props interfaces close to their components for readability and maintenance.

## 5) State, Data and Services

- Do not call APIs/localStorage directly in components; always go through services/hooks.
- Separate the data layer by service to make switching from localStorage to backend APIs easier.
- Query keys should be stable, concise, and resource-oriented.
- For localStorage data, always normalize/validate before persisting.

## 6) Form and Validation

- All forms should use schema validation with zod.
- Error messages must be short and user-friendly.
- Form submission should use async/await with clear try/catch error handling.
- Submit button disabled state must reflect pending status.

## 7) Styling and UI

- Prefer Tailwind utility classes; avoid inline styles except for special cases.
- Use a variant pattern for components with multiple states.
- Custom className values should be merged through the project's standard utility.
- Keep spacing, typography, and radius consistent with existing design tokens.

## 8) Testing Conventions

- Unit tests should focus on behavior, not implementation details.
- Each test case should verify one primary expectation.
- Test names should follow: should + expected behavior.
- Unit tests belong in tests/components or tests/unit.
- E2E tests belong in tests/e2e and must run via dedicated Playwright scripts.

## 9) Imports and Project Structure

- Prefer aliases for imports in src; keep relative imports short and clear.
- Import order: external libraries, internal aliases, internal relative imports.
- Avoid circular dependencies between services, hooks, and components.
- Organize files by domain + layer for scalability.

## 10) Git and Review Practice

- Keep commits small and purpose-driven; do not mix large refactors with major features.
- PR descriptions should clearly state: problem, solution, and impact.
- Before merge, run lint, type-check, unit tests, and e2e smoke tests.
