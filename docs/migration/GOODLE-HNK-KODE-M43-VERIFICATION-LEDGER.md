# M43 — Verified Certificate Registry — Verification Ledger

Date: 2026-10-02
Issue: #142

## Repository-visible implementation
- accepts M42 `CERTIFICATE_ROUND_TRIP_CONFORMANT` results only;
- fixed `PROTOCOL_CONFORMANCE` boundary;
- certificate digest indexing;
- deterministic first registration;
- idempotent identical re-registration;
- same-digest divergent-content conflict detection;
- immutable entries, nested stages and registry snapshots;
- digest lookup;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M43.1–M43.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
Registry membership records verified protocol conformance only. It does not create `EXECUTION_EVIDENCE` or manifestation execution authority.
