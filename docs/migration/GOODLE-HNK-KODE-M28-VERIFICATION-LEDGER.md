# M28 — Provenance Change Impact Analysis — Verification Ledger

Date: 2026-10-02
Issue: #105

## Repository-visible implementation
- deterministic read-only impact analysis from M27 provenance diff;
- changed-source identification;
- direct affected-child detection;
- transitive descendant detection across both snapshots;
- explicit ordering-change propagation;
- invalid-input rejection;
- immutable impact result;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M28.1–M28.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
Impact analysis identifies derivation consequences only. It does not mutate provenance, execute anything, or upgrade evidence.