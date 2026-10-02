# HNK40 — Batch B Execution Plan V1

Status: `ACTIVE / NON-BLOCKING`
Scope: `G11-G20`
Authority: `RESEARCH_NON_CANONICAL`

Batch B continues under `HNK40-NONBLOCKING-EXECUTION-POLICY-V1`.

## Inputs already frozen

- Authoritative source raster SHA-256: `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`
- Batch B authoritative trace input: `data/benchmarks/hnk40-batch-b-trace-input.v1.json`
- G11-G20 crop boxes and registry hashes: frozen.
- G17/G20: `DERIVED_AMBIGUOUS` metadata retained.
- G18: prior `REVIEW_REQUIRED` machine evidence retained.

## Execution sequence

1. Inspect G11-G20 authoritative specimens.
2. Produce ordered trace proposals from source evidence.
3. Record uncertainty per glyph without stopping the batch.
4. Freeze deterministic geometry hashes for traceable geometry.
5. Compare against Candidate D only after source reconstruction.
6. Produce reconciliation proposals.
7. Assemble Batch B Creator Gate.
8. Continue directly into Batch C even if B contains pending/ambiguous items.

## Non-blocking semantics

`AMBIGUOUS`, `PENDING`, `REVIEW_REQUIRED`, and `CREATOR_DECISION_REQUIRED` are carried forward as metadata. They do not stop later glyphs or batches.

No local runtime, Actions workflow, CI runner, deployment service, desktop bridge, or external provider is required to advance this sequence.

## Canon boundary

Research artifacts and reconciliation proposals may advance 40/40. Only actual visual-canon promotion remains subject to explicit Creator authority.
