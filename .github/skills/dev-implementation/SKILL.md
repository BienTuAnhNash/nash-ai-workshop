---
name: dev-implementation
description: Implement features and write production-ready code by working through a task list one task at a time. Use when asked to implement a story, write code, build functionality, add an endpoint or component, fix a bug, or continue a partially-finished task list.
---

# Dev Implementation

Turn a task list into working, committed code — one task at a time, with the build green before each hand-back to the mob.

## First: load the project context

- `instructions/tech-stack.md` — conventions, build/run/test commands, non-functional guardrails (**always**)
- `docs/architecture/*.md` — architectural decisions, folder structure, coding conventions
- `knowledge/domain-notes.md` — glossary and decisions already made (**always**)
- `docs/design/*.md` — architecture, data model, API contracts (when adding endpoints or touching the data layer)

If a Figma URL is provided, load `dev-figma-implement-design` before writing UI code.

## Task-driven implementation (mandatory when a task list exists)

**Files:** `docs/dev/{story-id}/tasks.md` and `docs/dev/{story-id}/plan.md` (or under `.agent-artifacts/dev/` if that's your pod's layout).

### Loop

1. Read the tasks file → find `## Backend Tasks` and/or `## Frontend Tasks`.
2. Read the linked plan file for the design context behind the tasks.
3. Find the next unfinished task (`- [ ]` or `- [~]`). Skip anything already `- [x]`.
4. Mark it in progress: `- [ ]` → `- [~]`.
5. Read its sub-items and follow its `Ref:` link into the plan.
6. Implement it, following the plan's design and the project's existing patterns.
7. Validate — run the build and the tests.
8. Mark it done: `- [~]` → `- [x]`.
9. Repeat. When every task is `- [x]`, set the file header `Status` to `Completed`.

### Rules

- Implement **only** what the task list says. Anything else is scope creep — raise it, don't code it.
- Never re-implement a task already marked `- [x]`.
- One task at a time. Backend before frontend.
- If you're blocked, leave the task at `- [~]` and write the blocker into the file so the next driver sees it.
- If no task list exists and the change spans 3+ files, run `dev-planning` first.

## Ad-hoc implementation (no task list, 1–2 files)

1. Search for a similar existing implementation and follow its pattern.
2. Implement with input validation and error handling; keep secrets and personal data out of logs.
3. Build and run the tests.

## Bug fix rules

- Minimal change. No refactoring or feature work mixed into a fix.
- Find the root cause; don't patch the symptom.
- Add a regression test that fails before the fix and passes after.
- Search for the same mistake elsewhere in the codebase.

## Before you finish

Run the project's build, lint, and test commands (they're in `instructions/tech-stack.md`). Report what you ran and what the result was — including failures. Then hand back to the mob for review before committing.

## Mob working agreements this skill respects

- A human navigator reads every change before it's committed.
- Commits are small and scoped to one working slice.
- Every artifact — plan, tasks, code, tests — lives in the repo, never only in chat.
