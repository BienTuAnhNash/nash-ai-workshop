---
name: qc-generate-test-script
description: Generate automation test scripts from test cases using the Page Object Model. Sources from docs/stories/{story-id}/testcase.md. Framework conventions come from instructions/test-automation.md. Trigger on "generate test script", "write automation test", "automate test cases".
---

# Generate automation test scripts

Create automation test scripts from designed test cases. Follows the Page Object Model and the project's test automation conventions.

## Inputs

- The story ID — required
- `docs/stories/{story-id}/testcase.md` — the designed test cases
- `instructions/test-automation.md` — project-specific automation conventions (framework, structure, selectors, naming). **This is the single source of truth for coding patterns.**

## Workflow

### 1. Parse test cases

- Read `docs/stories/{story-id}/testcase.md`.
- Extract the user flow: navigation, interactions, expected outcomes.
- Identify logical pages or functional areas (e.g. Login page, Dashboard, Form page).
- Decide which page objects are needed.

### 2. Inspect existing automation assets

- Search the project's test automation directory (defined in `instructions/test-automation.md`) for:
  - Existing page object classes
  - Existing fixtures / helpers
  - Existing tests that cover part of the flow
- Reuse what exists. Do not duplicate.

### 3. Create or update page objects

When a required page is not yet modelled:

- Add a new file following the naming convention in `instructions/test-automation.md`.
- Implement using the Page Object Model:
  - Constructor accepts the page/driver object.
  - Define element locators as class properties.
  - Expose high-level methods (e.g. `navigateTo()`, `fillForm()`, `submit()`).
  - Use robust selectors — prefer role/text/label-based over brittle CSS/XPath.
- Do not duplicate locators already in other page objects.

### 4. Wire page objects into fixtures

- Update the fixture file to expose new page objects.
- Fixtures handle setup/wiring only — no test logic.

### 5. Generate the test file

- Create the test file following the project's directory structure and naming from `instructions/test-automation.md`.
- Use the fixture so tests receive page objects as arguments.
- Map each test case from `testcase.md` to a test function:
  - One test per test case.
  - Name matches the TC ID: e.g. `TC_US-01_AC1_Login_with_valid_credentials`.
  - All interactions go through page object methods — never use the raw page directly.
  - All assertions verify business-relevant outcomes.
- Apply data-driven testing when multiple test cases differ only by input data.

### 6. Ensure runnability

- Verify imports are correct and relative.
- Navigation uses `baseURL` from config where appropriate.
- No hardcoded URLs or arbitrary timeouts.
- Tests are independent and can run in any order.

### 7. Run and validate

- Run the generated tests.
- If a test fails: inspect, fix selectors/assertions, re-run.
- Report results to the user.

### 8. Summary

- List files created or modified.
- Report test results (passed / failed / blocked).

## Constraints

- Only modify files in the test automation directory — never touch application code.
- Follow `instructions/test-automation.md` for all conventions. When in doubt, follow that file.
- Do not introduce patterns that conflict with established conventions.
