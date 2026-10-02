# M36 — Conformance Bundle Round-Trip Gate — Verification Ledger

Date: 2026-10-02
Issue: #125

## Repository-visible implementation
- integrates M34 bundle creation;
- integrates M35 verified import;
- compares serialized bundle equivalence;
- deterministic result;
- explicit failure-stage classification;
- immutable gate result;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M36.1–M36.5 round-trip implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
The M36 gate proves portability/integrity of the conformance bundle round trip. It is not manifestation execution evidence.
