---
name: qc-testability-review
description: Review a user story's acceptance criteria for testability during the Requirements stage. Surfaces contradictions, placeholders, missing failure paths, and ambiguities. Returns questions — never answers.
allowed-tools: Read, Grep, Glob
---

# Testability review

Review a story's acceptance criteria and return questions the team should resolve before design starts.

## Do NOT use when

- The story is already in development — this runs **during Requirements**, alongside the BA
- The request is to write test cases → that happens at build/test-pass
- The request is to review existing test code → use `dev-code-review`

## The contract

**You return questions. You never return answers.**

Where a domain rule is needed and you do not know it, say so explicitly under `NOT KNOWN TO ME`. A confidently invented rule is worse than a blank.

## Inputs

- The user story and its acceptance criteria from `docs/stories/{story-id}/requirement.md`
- `knowledge/domain-notes.md` — read this before judging any criterion

## Procedure

1. Read `knowledge/domain-notes.md`.
2. Read the story's `requirement.md`.
3. Run each check in `references/checks.md` against the criteria.
4. Emit the output format below. Stop. Do not propose test cases.

## Output format

```
STORY: {story-id}

BLOCKING — cannot be built or tested as written
  Q1. <question>
      Quote: "<exact text from the requirement>"
      Why:   <what breaks if this is answered during execution instead>

AMBIGUOUS — buildable, but will produce the wrong test
  Q2. ...

MISSING — scope or behaviour with no criterion
  Q3. ...

NOT KNOWN TO ME — needs a product decision
  <list, or "none">

SUGGESTED VERIFICATION LEVEL (proposal only — the team decides)
  AC-n  component | api | e2e | charter | none   owner: Dev | Test
```

Every question must carry an exact quote from the story. A question without a quote is speculation — drop it.

## Self-check before emitting

- [ ] Every question quotes the story verbatim
- [ ] No question invents a domain rule not present in `knowledge/domain-notes.md`
- [ ] Anything uncertain appears under NOT KNOWN TO ME
- [ ] No test cases were written
- [ ] Fewer than 12 questions — if more, the story needs splitting, and say that instead
