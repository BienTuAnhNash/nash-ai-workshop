# Testability checks

Run in order against each user story's acceptance criteria.

---

## 1 · Internal contradiction

A criterion that conflicts with another criterion, with notes, or with stated scope.

**Look for:** the same concept governed by two different rules; a condition asserted in one criterion and denied in another.

**Question shape:** "AC-n says X. AC-m says Y. Which governs?"

**Severity:** BLOCKING.

---

## 2 · Unresolved placeholder inside a criterion

**Look for:** `TBD`, `to be confirmed`, `TBC`, `???`, empty bullets, a criterion that ends mid-sentence.

**When found, enumerate what is actually missing.** For a UI element: the text, its source, which step it appears on, whether it blocks progression.

**Question shape:** "AC-n contains a placeholder. To build and verify it we need: (1)… (2)… Can this be resolved now, or should it be split?"

**Severity:** BLOCKING.

---

## 3 · Scope named without criteria

**Look for:** features, user types, or variants named in the story title or description but not covered by any acceptance criterion.

**Question shape:** "The story mentions X but no criterion covers it. Is the behaviour identical to Y, or are there differences?"

**Severity:** MISSING.

---

## 4 · Constraint stated outside the criteria

**Look for:** rules in the description or notes rather than in an AC — anything phrased as "only", "no…applies", "not in this release".

Each has a testable consequence that will not be verified because nothing points at it.

**Question shape:** "The description states X. The testable consequence is Y. Should this become a criterion, or is it explicitly out of scope?"

**Severity:** MISSING.

---

## 5 · Missing failure paths

Check for a criterion covering each, proportional to consequence:

- The operation is rejected by an external system
- The user's session expires mid-flow
- The user navigates back after a side effect
- The operation is submitted twice (double click, refresh, retry)
- The flow is abandoned after a side effect but before completion
- An external dependency is unavailable or times out
- A permitted action is attempted by an unauthorised actor **directly**, not through the UI

**The last one matters most.** Hiding a control is not the same as refusing the action.

**Question shape:** "There is no criterion for X. Should it be a criterion, or an explicitly accepted risk?"

**Severity:** MISSING for payment/permission flows, AMBIGUOUS otherwise.

---

## 6 · Undefined source for a displayed value

**Look for:** labels, amounts, or messages in criteria with no stated origin (hardcoded, config, or content-managed).

**Question shape:** "AC-n specifies the value 'X'. Where does it come from? Does it differ by variant?"

**Severity:** AMBIGUOUS.

---

## 7 · Composed or calculated values without a rule

**Look for:** totals, percentages, surcharges, durations.

**Always ask:** fixed or proportional, where configured, rounding rule, what happens at zero.

**Severity:** BLOCKING where monetary.

---

## 8 · Ambiguous references

**Look for:** pronouns with more than one antecedent, role words used loosely ("user") where the system distinguishes several, step numbers that differ between variants.

**Question shape:** "AC-n says 'the user'. Which role does this apply to — all of them, or only X?"

**Severity:** AMBIGUOUS.

---

## 9 · Non-definite criteria

A criterion that a competent tester cannot judge as pass or fail without asking someone.

**Look for:** "should work correctly", "appropriate message", "as expected", "user-friendly". Each hides a decision that hasn't been made.

**Question shape:** "AC-n says 'appropriate message'. What is the exact message, or what determines it?"

**Severity:** AMBIGUOUS.
