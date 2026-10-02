# M45 — Registry Seal Import & Independent Verification Boundary — Verification Ledger

Date: 2026-10-02
Issue: #146

## Repository-visible implementation
- accepts M44 registry seals only;
- independently validates version, kind, exact protocol and fixed `PROTOCOL_CONFORMANCE` evidence class;
- validates entry count, entry structure and unique digests;
- independently canonicalizes by certificate digest and rejects non-canonical order;
- independently recomputes SHA-256 and rejects tampering;
- returns immutable imported seal and nested entries;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M45.1–M45.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M45 independently verifies registry integrity only. `PROTOCOL_CONFORMANCE` cannot be promoted to `EXECUTION_EVIDENCE` by import or verification.
