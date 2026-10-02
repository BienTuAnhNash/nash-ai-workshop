# Nash AI Workshop

A lightweight React + TypeScript starter used for AI workshop demos.

This project is optimized for fast prototyping with:

- localStorage-based authentication/data flow (no backend required)
- clean folder architecture
- unit testing and e2e testing setup

## Requirements

- Node.js 20+
- npm 10+

## Quick Start

1. Install dependencies:

```bash
npm install
```

1. Create environment file from template:

```bash
cp .env.example .env
```

1. Start development server:

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` Start development server
- `npm run build` Build production bundle
- `npm run preview` Preview production build
- `npm run lint` Run ESLint
- `npm run type-check` Run TypeScript type check
- `npm run format` Run Prettier and ESLint fix
- `npm run test` Run unit/component tests (Vitest)
- `npm run test:watch` Run tests in watch mode

## Testing

### Unit and Component Tests

```bash
npm run test
```

### E2E Tests (Playwright)

Install browser once:

```bash
npx playwright install chromium
```

Run tests:

```bash
npm run e2e
```

Extra e2e commands:

- `npm run e2e:ui` Run Playwright UI mode
- `npm run e2e:headed` Run headed browser mode
- `npm run e2e:debug` Run debug mode
- `npm run e2e:report` Open HTML report

## Architecture Docs

- [Tech Stack](docs/architecture/tech-stack.md)
- [Folder Structure](docs/architecture/folder-structure.md)
- [Coding Conventions](docs/architecture/coding-conventions.md)
- [Authentication](docs/architecture/authentication.md)

## Tech Stack Summary

- React 19 + TypeScript + Vite 8
- TanStack Router + TanStack Query
- Tailwind CSS + ShadCN/Radix UI
- React Hook Form + Zod
- Vitest + Testing Library + Playwright

## Notes

- Current auth/data mode is localStorage-based for workshop/demo speed.
- Do not use this auth approach in production without backend security.

## Author

- TuAnhInTech
- [https://tuanhintech.com/](https://tuanhintech.com/)
