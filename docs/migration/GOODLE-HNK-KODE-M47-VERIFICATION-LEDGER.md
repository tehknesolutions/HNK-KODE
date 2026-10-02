# M47 — Sealed Registry Independent Snapshot & Import Boundary — Verification Ledger

Date: 2026-10-02
Issue: #151

## Repository-visible implementation
- accepts M46 `REGISTRY_SEAL_ROUND_TRIP_CONFORMANT` results only;
- exports deterministic portable snapshot envelopes;
- binds envelope `sourceDigest` to the M44 seal digest;
- independently verifies envelope SHA-256;
- rejects malformed envelopes, digest tampering, source-digest mismatch and evidence-class promotion;
- reconstructs immutable sealed snapshot data;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M47.1–M47.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M47 proves transport integrity of a sealed protocol-conformance registry snapshot only. It does not create `EXECUTION_EVIDENCE` or manifestation execution authority.
