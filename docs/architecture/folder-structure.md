# Folder Structure

## 1) Project Overview

```text
nash-ai-workshop/
|- docs/
|  |- architecture/
|- public/
|- src/
|- tests/
|- index.html
|- vite.config.ts
|- package.json
```

## 2) Source Code Layout (src)

```text
src/
|- assets/                # Static assets used by app code
|- components/
|  |- layout/             # Layout wrappers (app shell, page wrapper)
|  |- ui/                 # Reusable UI components
|- constants/             # App constants (routes, static keys)
|- enums/                 # Enum definitions
|- hooks/
|  |- mutations/          # TanStack Query mutation hooks
|  |  |- auth/
|  |- queries/            # TanStack Query query hooks
|- libs/                  # Shared libraries/utilities (query client, local db, helpers)
|- providers/             # Context/providers (QueryProvider, AuthProvider)
|- routes/                # TanStack Router file-based routes
|  |- _authenticated/     # Protected routes
|  |- _guest/             # Public/auth routes
|  |- __root.tsx          # Root route setup
|- schemas/               # Zod validation schemas
|- services/              # Business/data access layer
|- types/                 # Shared TypeScript types/interfaces
|- utils/                 # Common utility logic (dateTime, etc.)
|- main.tsx               # App entry point
|- routeTree.gen.ts       # Auto-generated route tree
```

## 3) Test Layout (tests)

```text
tests/
|- components/            # UI/component tests
|  |- ui/
|  |- pages/
|- unit/                  # Pure utility/business unit tests
|- e2e/                   # Playwright end-to-end tests
|  |- auth/
```

## 4) Documentation Layout (docs)

```text
docs/
|- architecture/          # Technical architecture documents
|- business/              # Business/domain notes
|- plans/                 # Planning and execution notes
```

## 5) Placement Rules

- Put reusable visual elements in src/components/ui.
- Put page-level shells/wrappers in src/components/layout.
- Put API/local storage access in src/services, not in route components.
- Put query/mutation wrappers in src/hooks/queries and src/hooks/mutations.
- Put validation contracts in src/schemas and shared types in src/types.
- Put pure helper functions in src/utils (or src/libs when shared infra-related).
- Put unit tests in tests/unit and component tests in tests/components.
- Put Playwright scenarios in tests/e2e.

## 6) Naming Guidelines

- Components: PascalCase file names when domain-specific; kebab-case for shared UI files is acceptable if already established.
- Hooks: useXxx.ts format.
- Services: xxxService.ts format.
- Schemas: xxxSchema.ts format.
- Tests: _.test.ts / _.test.tsx for unit/component, \*.spec.ts for e2e flows.
