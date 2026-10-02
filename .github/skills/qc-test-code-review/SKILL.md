---
name: qc-test-code-review
description: Review automation test code for POM usage, duplication, data-driven patterns, and best practices. Trigger on "review test code", "review test script", "check test quality".
---

# Test code review

Review automation test changes for quality, structure, and maintainability.

## Scope

Files in the test automation directory: tests, page objects, fixtures, and related config.

## Review checklist

### 1. Page Object Model (POM)

- All UI interactions go through page object classes, not the raw page/driver.
- Each distinct page or component has its own class and file.
- Page objects encapsulate locators as class properties.
- High-level methods (e.g. `login`, `fillForm`, `submit`) instead of low-level click/fill sequences in tests.
- Robust, unique selectors — prefer role/text/label-based. XPath only when necessary.
- Navigation URLs encapsulated in page objects, not passed from tests.

### 2. Duplication and reuse

- No repeated step sequences across tests — move to page object methods.
- No duplicate locators across files — centralize in the appropriate page object.
- Reuse existing page objects, fixtures, and helpers instead of near-identical copies.

### 3. Data-driven testing

- When tests differ only by input data, recommend refactoring into data-driven tests.
- Shared or environment-specific data belongs in a data directory, not hardcoded.
- Data-driven tests keep each scenario clear with descriptive test titles.

### 4. Language and framework best practices

- Explicit types — avoid `any`.
- `const`/`let` over `var`. `async/await` for async operations.
- Strict equality. Descriptive names (PascalCase for classes, camelCase for methods).
- Built-in waiting via locators and assertions — no arbitrary timeouts.
- Assertions verify business-relevant outcomes, not just technical state.

### 5. Test design and maintainability

- Tests are independent — no hidden shared state.
- Setup/teardown via fixtures and page object methods.
- Small, focused tests with clear naming reflecting the behaviour under test.
- Step comments numbered sequentially.

## Output format

Structure feedback around:

1. **Structure & POM** — page objects, file organization, encapsulation
2. **Duplication & Reuse** — repeated flows/locators, suggested refactors
3. **Data-Driven Testing** — opportunities to convert to data-driven
4. **Quality & Best Practices** — type safety, readability, framework idioms

Prioritize high-impact issues first. Suggest concrete refactor patterns, not just problems. Do not fix code directly — provide guidance so the author learns.

## Reference

For project-specific conventions: `instructions/test-automation.md`.
