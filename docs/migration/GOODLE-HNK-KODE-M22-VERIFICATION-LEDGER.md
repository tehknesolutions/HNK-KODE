# M22 — Artifact / Timeline Merge Planning — Verification Ledger

Date: 2026-10-02
Issue: #92

## Repository-visible implementation

- merge planning requires M20 lineage compatibility;
- deterministic operation classes: unchanged, retained, additions, removals and conflicts;
- conflicts require explicit resolution policy;
- planner never silently chooses a conflicting source;
- source artifacts remain unmodified;
- plan is immutable and deterministic;
- execution/evidence states remain source facts;
- public API export added.

## Verification classification

| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M22.1–M22.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant

Merge planning produces an explicit proposal; it does not merge histories, mutate artifacts, or grant execution authority.