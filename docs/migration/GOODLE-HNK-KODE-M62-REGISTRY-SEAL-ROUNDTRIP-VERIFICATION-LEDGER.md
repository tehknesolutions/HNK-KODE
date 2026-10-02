# M62 — Verified Anchor Archive Registry Seal Round-Trip — Verification Ledger

Date: 2026-10-02
Issue: #184

## Repository-visible contract
- accepts only valid M60 `m60-v1` registry seals with `PROTOCOL_CONFORMANCE`;
- independently imports/verifies through M61;
- requires exact semantic equality between source and reconstructed seal;
- preserves seal digest, entry count, canonical archive digests, protocol and evidence class;
- classifies invalid input, M61 failure and equivalence mismatch deterministically;
- returns immutable round-trip state.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M62.1–M62.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured in this GitHub-only change. |
| GitHub Actions | UNVERIFIED_INFRA | Supplementary and non-blocking. |

## Governance
M62 proves seal portability/integrity through M61 only. It never creates `EXECUTION_EVIDENCE`, manifestation execution authority, governance authority, or canon authority.
