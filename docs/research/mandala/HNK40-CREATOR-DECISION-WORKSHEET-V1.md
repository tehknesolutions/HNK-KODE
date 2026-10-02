# HNK40 — Creator Decision Worksheet V1

Status: READY_FOR_EXPLICIT_DECISIONS
Authority: CREATOR_CANON_GATE

This worksheet does not make decisions. It is the direct intake surface for the existing Creator Decision Manifest.

## Decision vocabulary

- APPROVE_NEW_PLATE — promote source-derived geometry.
- RETAIN_CANDIDATE_D — promote Candidate D geometry.
- HYBRID — explicit per-glyph/family selection.
- RETRACE — return to research; no promotion.
- DEFER — leave canon unchanged.
- PENDING — no canon change.

## Current decision state

G01–G40: PENDING.

## Focused debt

G07 — upper-right mark requires an explicit decision.
G17 — DERIVED_AMBIGUOUS.
G18 — PRIOR_MACHINE_REVIEW_REQUIRED.
G20 — DERIVED_AMBIGUOUS.
G28 — PRIOR_MACHINE_REVIEW_REQUIRED.

## Intake format

A decision can be supplied as a compact sequence:

G01=...
G02=...
...
G40=...

Only explicit values from the declared vocabulary are actionable.

## Execution contract

After decisions are entered:
1. validate every value;
2. resolve the selected evidence reference;
3. create promotion records only for applicable decisions;
4. generate Visual Canon V2 only from promoted records;
5. preserve every non-selected alternative;
6. run downstream compatibility validation.

No decision is inferred from AS, prior research status, Candidate D similarity, or model judgment.