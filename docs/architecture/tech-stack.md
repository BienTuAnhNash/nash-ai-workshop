# Tech Stack

## 1) Core Platform

- Language: TypeScript
- UI Framework: React 19
- Build Tool: Vite 8
- Package Manager: npm

## 2) Routing and Data Flow

- Router: TanStack Router (file-based route structure)
- Server state + cache: TanStack Query
- HTTP client: Axios (still in the stack and ready when backend APIs are enabled)
- Local data layer: LocalStorage-based mini DB (used for demo/offline mode)

## 3) UI and Styling

- Styling: Tailwind CSS v4
- Component pattern: ShadCN UI + Radix primitives
- Utility: class-variance-authority, clsx, tailwind-merge
- Icons: lucide-react
- Notifications: sonner
- Progress UI: nprogress

## 4) Form and Validation

- Form handling: react-hook-form
- Schema validation: zod
- Resolver bridge: @hookform/resolvers

## 5) Testing

- Unit/Component tests: Vitest + Testing Library + jsdom
- E2E tests: Playwright

## 6) Code Quality and Dev Workflow

- Linting: ESLint
- Formatting: Prettier
- Git hooks: Husky

## 7) Current Architecture Note

- The app is currently optimized for workshop speed by using localStorage data.
- The service layer is already separated, so switching back to backend APIs later requires minimal changes.
