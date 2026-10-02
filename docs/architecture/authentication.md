# Authentication

## 1) Overview

This project uses a localStorage-based authentication flow for workshop/demo speed.
There is no backend API in the current mode.

- User data is stored in a local table: users
- Session data is stored in a local table: auth_sessions
- Auth read/write logic is centralized in the auth service layer

## 2) Main Components

- Service: src/services/authService.ts
- Local DB utility: src/libs/localDb.ts
- Auth query hook: src/hooks/queries/useGetMe.ts
- Auth mutation hooks:
  - src/hooks/mutations/auth/useSignin.ts
  - src/hooks/mutations/auth/useSigninup.ts
  - src/hooks/mutations/auth/useSingout.ts
- Route guards:
  - Protected routes: src/routes/\_authenticated/route.tsx
  - Guest routes: src/routes/\_guest/route.ts

## 3) Authentication Flow

### Sign Up

1. Validate form input with zod schema.
2. Normalize email to lowercase + trimmed value.
3. Check if email already exists in users table.
4. Create new user record with generated id and timestamps.
5. Save user to localStorage via localDb.insertOne.

### Sign In

1. Validate form input.
2. Normalize email.
3. Find matching user by email.
4. Compare password.
5. Create a current session record in auth_sessions.

### Get Current User (getMe)

1. Read current session from auth_sessions.
2. Resolve user by session.userId from users table.
3. Return user profile (without password).
4. If session is invalid, clear session and throw Unauthorized.

### Sign Out

1. Clear auth_sessions table.
2. Invalidate/remove me query in hooks.

## 4) Route Protection Strategy

- Guest area (\_guest):
  - If user is already authenticated, redirect to home (/).
- Authenticated area (\_authenticated):
  - Ensure me query is available before loading page.
  - If unauthorized, redirect to sign-in route.

## 5) Data Shape (Local Tables)

### users

- \_id: string
- name: string
- email: string
- password: string
- role: user | admin
- createdAt: ISO string
- updatedAt: ISO string

### auth_sessions

- \_id: current-session
- userId: string
- createdAt: ISO string

## 6) Error Handling

- Invalid credentials: throw "Invalid email or password"
- Duplicate email on sign-up: throw "Email already exists"
- Missing/invalid session: throw "Unauthorized"

Errors are surfaced to UI and displayed with toast notifications.

## 7) Security Note

This authentication approach is intended for demo/workshop usage only.

- Passwords are stored in plain text in localStorage.
- There is no token, encryption, refresh flow, or server-side validation.
- Do not use this approach for production.

## 8) Migration Path to Backend API

Because auth logic is already centralized in service/hook layers, migration is straightforward:

1. Replace localDb operations in authService with API calls.
2. Keep query/mutation hooks and route guards mostly unchanged.
3. Add token/session handling in axios interceptors if needed.
