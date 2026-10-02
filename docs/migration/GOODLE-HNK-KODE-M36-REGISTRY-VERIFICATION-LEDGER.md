# M36 — Verified Bundle Registry & Duplicate/Conflict Semantics — Verification Ledger

Date: 2026-10-02
Issue: #128

## Repository-visible implementation
- accepts only M35 `IMPORTED_VERIFIED` results with successful verification;
- deterministic registry key is the verified bundle digest;
- exact duplicate registration is idempotent;
- conflicting payload under an existing digest is rejected;
- registry entries and snapshots are immutable at the caller boundary;
- verified protocol, source digest, stages, ledger, creation timestamp and digest are preserved;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | Registry implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured in this change. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
Registry membership is audit/catalog evidence only. Registration does not execute a manifestation and does not grant execution, canon, or governance authority.
