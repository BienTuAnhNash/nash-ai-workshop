---
name: dev-code-review
description: Review code for security, correctness, quality, and performance before it is committed or merged. Use when asked to review code, check a diff, audit code quality, look for vulnerabilities, or do a post-implementation self-review of a finished slice.
---

# Dev Code Review

Review in one fixed priority order — **Security → Correctness → Quality → Performance** — and report findings with a file:line anchor and a severity.

## First: load the project context

- `instructions/tech-stack.md` — conventions, naming, non-functional guardrails
- `docs/design/*.md` — API contracts and data model (when reviewing endpoint or schema changes)
- `docs/architecture/*.md` — architectural decisions, folder structure, coding conventions
- `knowledge/domain-notes.md` — business rules a reviewer would otherwise mistake for bugs

For full-stack changes, review both layers and explicitly flag frontend↔backend contract mismatches (field names, nullability, status codes).

## Review process

1. Understand what the change is supposed to do — read the story and the plan, not just the diff.
2. Walk the four focus areas in order.
3. Output structured feedback in the format below.

## Focus areas

### Security — always check first

- Input validation on every user-supplied value
- No injection paths (SQL, command, XSS, path traversal)
- No hardcoded or logged secrets
- Authentication and authorisation checks actually applied on protected routes
- Safe file handling; no sensitive data in responses or logs

### Correctness

- Logic errors, off-by-one, wrong boundary conditions
- Null / undefined / empty-collection handling
- Errors propagate — no silently swallowed exceptions
- Resources cleaned up (connections, streams, subscriptions, timers)

### Quality

- Follows the naming and structural conventions in `instructions/tech-stack.md`
- Single responsibility; no copy-pasted duplication
- Testable — dependencies injected rather than constructed inline
- No dead code or leftover debug output

### Performance

- No N+1 queries or per-item network calls in a loop
- Async / concurrent where it actually helps
- Caching where a value is expensive and stable
- No unbounded growth (leaked listeners, ever-growing in-memory collections)

## Output format

```markdown
## Code Review Summary

### Critical Issues (Must Fix)
- [SECURITY] Description — file:line
- [BUG] Description — file:line

### Improvements (Should Fix)
- [QUALITY] Description and suggestion — file:line
- [PERFORMANCE] Description and suggestion — file:line

### Suggestions (Nice to Have)
- Description

### Positive Observations
- What was done well
```

## Severity levels

| Level | Description | Action |
|---|---|---|
| Critical | Security vulnerability, data loss, crash | Must fix before commit |
| High | Bug, logic error | Should fix before commit |
| Medium | Code quality issue | Fix in this slice or log as follow-up |
| Low | Style, preference | Optional |

## Reviewer discipline

- Report what you actually verified. Don't claim a file is clean if you didn't open it.
- No finding without a concrete failure scenario — "this could be unsafe" is not a finding; "an empty `items` array reaches line 42 and throws" is.
- This review does **not** replace the human navigator read-through. It's a first pass that makes the human's pass faster.
