# Welcome to your new TanStack Start app

## Getting Started

To run this application:

Copy file **.env.example** then create a new file **.env**, pase content to it.

```bash
npm install
npm run dev
```

## Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

### E2E testing with Playwright

Install Playwright browser (Chromium):

```bash
npx playwright install chromium
```

Run end-to-end tests:

```bash
npm run e2e
```

Open Playwright UI mode:

```bash
npm run e2e:ui
```

Run headed browser mode:

```bash
npm run e2e:headed
```

Debug tests interactively:

```bash
npm run e2e:debug
```

Open HTML report:

```bash
npm run e2e:report
```

## Tech stacks

1. Framework: React + Vite, TypeScript
2. Styling: Tailwind CSS, ShadCN
3. Router: TanStack Router
4. Query, caching: Axios, TanStack Query
5. Form: React Hook Form
6. Validation: Zod
7. State managing: Zustand (optional)
8. Linting: ESLint, Prettier, Husky + lint-staged

## Stay in touch

- Author - TuAnhInTech
- Website - [https://tuanhintech.com/](https://tuanhintech.com/)
