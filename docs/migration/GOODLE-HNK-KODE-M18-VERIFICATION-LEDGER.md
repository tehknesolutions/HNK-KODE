# M18 — Sealed Timeline Export & Portable Audit Artifact — Verification Ledger

Date: 2026-10-02
Issue: #83

## Repository-visible implementation

- export requires a valid M17 seal;
- exported artifact preserves records, chain and seal metadata;
- serialization is deterministic for identical inputs;
- embedded chain and seal can be verified after export;
- invalid or unsealed input is rejected;
- artifact is read-only and does not mutate audit history;
- exported artifact is an audit/integrity artifact, not execution evidence;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M18.1–M18.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

A portable sealed artifact preserves and verifies audit history; it does not create execution evidence or execution authority.