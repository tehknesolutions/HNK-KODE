# M27 — Provenance Snapshot Diff & Derivation Change Audit — Verification Ledger

Date: 2026-10-02
Issue: #103

## Repository-visible implementation
- deterministic read-only comparison of two provenance snapshots;
- root validation and ambiguous graph rejection;
- direct-parent additions/removals;
- parent-order changes reported separately;
- transitive ancestor additions/removals;
- immutable comparison result;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M27.1–M27.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
Provenance diff describes derivation changes only. It does not mutate graphs, execute anything, or upgrade evidence.