# M15 — Audit Query & Evidence Timeline — Verification Ledger

Date: 2026-10-02
Issue: #76

## Repository-visible implementation

- read-only audit query layer;
- filters for semanticId, observationId, capabilityId, target, authority and state;
- deterministic append-order preservation;
- timeline reconstruction with explicit sequence index;
- missing records return an explicit empty result;
- returned records and timeline entries are immutable snapshots;
- query layer does not mutate, upgrade, delete or reconcile historical records;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M15.1–M15.5 contract implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

Audit query is observational only. It reconstructs stored history without changing the authority or evidence state.