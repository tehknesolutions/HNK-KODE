# M25 — Provenance Graph & Source Lineage — Verification Ledger

Date: 2026-10-02
Issue: #99

## Repository-visible implementation

- derived artifacts can carry explicit source-artifact references;
- source references include stable artifact identity, optional seal digest and semantic identity;
- source references are normalized deterministically;
- duplicate, self-referential or ambiguous source lineage is rejected;
- provenance has a deterministic SHA-256 fingerprint;
- graph verification is read-only;
- provenance remains distinct from M20 identity lineage;
- provenance never upgrades execution/evidence state;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M25.1–M25.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

Provenance explains derivation and source lineage. It is not execution evidence and does not grant authority.