# M20 — Cross-Artifact Identity & Lineage — Verification Ledger

Date: 2026-10-02
Issue: #87

## Repository-visible implementation

- deterministic lineage fingerprint derived from explicit identity fields;
- semanticId is mandatory for lineage comparison;
- target, adapter, capabilityId and authority must remain compatible;
- incompatible artifacts are explicitly rejected;
- compatible artifacts may be compared without merging or mutating timelines;
- lineage verification does not alter execution/evidence state;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M20.1–M20.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

Lineage compatibility proves identity continuity; it does not prove execution and never merges audit histories.