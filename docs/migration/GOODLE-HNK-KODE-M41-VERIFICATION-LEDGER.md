# M41 — Certificate Import & Independent Verification Boundary — Verification Ledger

Date: 2026-10-02
Issue: #138

## Repository-visible implementation
- structural M40 certificate validation;
- exact M29→M39 protocol validation;
- fixed `PROTOCOL_CONFORMANCE` evidence class;
- independent SHA-256 digest recomputation;
- rejects digest tampering, protocol mutation and evidence-class promotion;
- preserves sourceDigest and immutable stage snapshot;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M41.1–M41.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M41 independently verifies M40 protocol-conformance certificates only. It cannot create or promote `EXECUTION_EVIDENCE`.
