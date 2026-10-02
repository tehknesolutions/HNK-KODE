# M50 — Sealed Snapshot Anchor Import & Independent Verification — Verification Ledger

Date: 2026-10-02
Issue: #157

## Repository-visible implementation
- accepts M49 `ANCHORED` artifacts only;
- validates version, kind, exact M29→M39 protocol and fixed `PROTOCOL_CONFORMANCE`;
- independently recomputes SHA-256;
- validates sealDigest binding;
- rejects malformed anchors, digest tampering, protocol mutation and evidence-class promotion;
- preserves immutable imported anchor/snapshot data;
- public API export added.

## Verification classification
| Evidence | State | Notes |
| --- | --- | --- |
| Repository/static contract inspection | VERIFIED_PASS | M50.1–M50.5 implementation and focused tests are present. |
| Executable Node test suite | NOT_RUN | No fresh stdout/stderr + exit code captured. |
| GitHub Actions | UNVERIFIED_INFRA | External executor remains supplementary and non-blocking. |

## Invariant
M50 independently verifies M49 anchor integrity only. It does not create `EXECUTION_EVIDENCE` or manifestation execution authority.
