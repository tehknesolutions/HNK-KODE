# M21 — Cross-Artifact Comparison & Diff — Verification Ledger

Date: 2026-10-02
Issue: #89

## Repository-visible implementation

- comparison requires M20 lineage compatibility;
- deterministic record identity uses semanticId, observationId and state;
- added, removed and changed records are reported separately;
- field-level changes are explicit;
- ordering changes are reported instead of silently normalized;
- incompatible lineage is rejected;
- diff snapshots are immutable;
- comparison is read-only and never upgrades execution/evidence state;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M21.1–M21.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

Comparison describes differences between snapshots; it does not merge, mutate, authorize, or verify execution.