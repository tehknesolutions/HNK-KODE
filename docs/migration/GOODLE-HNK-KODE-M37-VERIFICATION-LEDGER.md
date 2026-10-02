# M37 — Conformance Attestation Manifest — Verification Ledger

Date: 2026-10-02
Issue: #127

## Repository-visible implementation
- requires an M36 CONFORMANT_ROUND_TRIP result;
- creates deterministic protocol attestation manifest;
- records M29→M36 protocol identity and stage results;
- fixes evidenceClass to PROTOCOL_CONFORMANCE;
- SHA-256 manifest integrity digest;
- detects digest/evidence-class tampering;
- rejects non-conformant input;
- immutable manifest;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M37.1–M37.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M37 attests protocol conformance only. PROTOCOL_CONFORMANCE cannot be promoted into EXECUTION_EVIDENCE by this layer.
