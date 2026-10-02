# HNK40 — Non-Blocking Execution Policy V1

Status: `ACTIVE`

Primary execution environment: `GPT + GitHub`.

## Rule

Local runtimes, GitHub Actions, deployment providers, desktop tools, CI runners and other external services are optional evidence/acceleration layers. Their absence, failure, quota, authentication state or unavailability MUST NOT block architectural work, source work, research artifacts, code generation, repository commits, issue tracking, batch progression or non-destructive validation that can be performed through GPT + GitHub.

## Uncertainty handling

Uncertainty is recorded as metadata and debt, not converted into a pipeline stop by default:

- `PENDING`
- `AMBIGUOUS`
- `REVIEW_REQUIRED`
- `DEFERRED`

The pipeline continues around these states. Only an irreversible canonical mutation requiring Creator authority is a hard gate.

## HNK40 application

- Batch A Creator decisions may remain pending while Batch B/C/D research proceeds.
- G17/G20 ambiguity remains recorded but does not block G11–G20 or later batches.
- G18 prior machine `REVIEW_REQUIRED` evidence is retained but does not block tracing/reconciliation.
- No local render/test/build requirement is a prerequisite for continuing the HNK40 visual reconciliation.
- Candidate D comparison, trace artifacts, hashes, reconciliation proposals and documentation may all progress through repository evidence.

## Canon boundary

`RESEARCH PROGRESS != CANON PROMOTION`.

Research should advance aggressively. Canon mutation remains conservative and requires explicit Creator authority only where the choice is genuinely irreversible or semantically canonical.

## Default workflow

`produce -> commit to GitHub -> validate with available evidence -> annotate uncertainty -> continue -> consolidate -> Creator decides true canon points`
