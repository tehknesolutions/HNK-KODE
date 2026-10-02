# M44 — Certificate Registry Seal — Verification Ledger

Date: 2026-10-02
Issue: #144

## Repository-visible implementation
- accepts M43 registry snapshots with fixed `PROTOCOL_CONFORMANCE` evidence class;
- canonical ordering by certificate digest;
- deterministic empty-registry behavior;
- SHA-256 seal over versioned canonical registry payload;
- verifies entry count, protocol, evidence class, canonical order and digest;
- detects content mutation and duplicate/conflicting digest entries;
- immutable seal and nested entry snapshots;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M44.1–M44.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M44 proves integrity of a protocol-conformance registry snapshot only. A valid registry seal is not `EXECUTION_EVIDENCE` and grants no manifestation execution authority.
