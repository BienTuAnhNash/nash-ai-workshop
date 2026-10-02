---
name: qc-design-testcase
description: Design test cases from user stories. Covers all acceptance criteria with positive and negative scenarios. Sources from docs/stories/{story-id}/requirement.md. Trigger on "design test cases", "write test cases", "create test cases for story".
---

# Design test cases

Create structured test cases for a user story's acceptance criteria.

## Inputs

- The story ID — required
- `docs/stories/{story-id}/requirement.md` — acceptance criteria
- `knowledge/domain-notes.md` — domain terms; if a term is not defined, list it as unknown

## Workflow

1. Read `knowledge/domain-notes.md`.
2. Read `docs/stories/{story-id}/requirement.md`. Extract description and acceptance criteria.
3. Generate test cases per the rules below.
4. Write the output to `docs/stories/{story-id}/testcase.md`.
5. Re-read the output file and count totals using the procedure in *Verify totals*.

## Test case rules

- **Naming:** `TC_{story-id}_{AC-number}_{description}`, e.g. `TC_US-01_AC1_Login_with_valid_credentials`.
- Each test case focuses on a single acceptance criterion.
- Each test case includes positive and negative scenarios where applicable.
- Each test case is clear, concise, independent, and repeatable.
- Every acceptance criterion has at least one positive and two negative test cases.
- Cover edge cases where possible.

## Techniques to apply

- **Boundary Value Analysis** — edges of input ranges (min, max, min±1)
- **Equivalence Partitioning** — valid/invalid input groups
- **Decision Table Testing** — input/output combinations
- **State Transition Testing** — system state changes and workflows
- **Error Guessing** — likely error conditions from experience

## Output structure per test case

- **Title** — clear, descriptive name
- **Pre-conditions** — required system state and test data
- **Steps** — action and expected result, in a table
- **Test Data** — specific input values
- **Priority** — based on risk and AC importance
- **Type** — Positive or Negative

## Verify totals

After writing the file, re-read it and:

1. Count every `### TC_` heading — that is the total.
2. For each, read the `- **Type**:` line. Classify as Positive or Negative.
3. Verify: Total = Positive + Negative. If not, recount.
4. List which techniques were applied.
5. Append totals and techniques to the bottom of the file.
