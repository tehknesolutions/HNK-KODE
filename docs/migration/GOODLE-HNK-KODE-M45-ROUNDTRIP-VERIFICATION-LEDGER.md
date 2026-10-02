# M45 — Certificate Registry Seal Round-Trip Gate — Verification Ledger

Date: 2026-10-02
Issue: #147

## Repository-visible implementation
- accepts an M43 verified-certificate registry snapshot with fixed PROTOCOL_CONFORMANCE evidence class;
- creates the deterministic M44 registry seal;
- independently verifies the seal by recomputing SHA-256 and structural invariants;
- compares the canonical registry snapshot represented by the seal with the source snapshot;
- classifies failures at M44_SEAL, M44_VERIFY, or M45_EQUIVALENCE;
- preserves registry digest, entry count, canonical certificate digests, protocol and evidence class;
- returns immutable round-trip result and stages.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M45.1–M45.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured in this change. |
| GitHub Actions | UNVERIFIED_INFRA | Supplementary and non-blocking. |

## Naming reconciliation
Issue #146 is the M44 seal import/independent-verification boundary. Issue #147 is the explicit M43 → M44 → M45 round-trip gate. Both remain separately traceable.

## Invariant
M45 proves integrity/portability of a sealed protocol-conformance registry snapshot only. It never creates EXECUTION_EVIDENCE, manifestation execution authority, governance authority, or canon authority.
