# Acquisition Session Protocol V1 — Compliance Matrix

**Scope:** KODESCRIPT / Family Expansion Corpus V1
**Source of truth:** `docs/superpowers/specs/2026-09-28-acquisition-session-protocol-v1-design.md`
**Audit rule:** every requirement is mapped only to implementation/tests that are actually present in the repository.

| Requirement / invariant | Implementation | Test evidence | Status |
|---|---|---|---|
| Progressive protocol: BASELINE → ACQUISITION → CONTRAST → RECOGNITION_TRANSFER → PRODUCTION_TRANSFER → FEEDBACK | `acquisition-session-protocol.mjs` | `acquisition-session-protocol.test.mjs`, `acquisition-session-terminal.test.mjs` | GREEN |
| Illegal phase transitions rejected | `acquisition-session-protocol.mjs` | protocol transition tests + end-to-end skip test | GREEN |
| FEEDBACK is terminal | `acquisition-session-protocol.mjs` | `acquisition-session-terminal.test.mjs` | GREEN |
| TRAIN/HOLDOUT/CONTRAST phase visibility | `acquisition-end-to-end.mjs` | `acquisition-end-to-end.test.mjs` | GREEN |
| HOLDOUT never enters same-version calibration | `acquisition-holdout-calibration-firewall.mjs` | `acquisition-holdout-calibration-firewall.test.mjs` | GREEN |
| Recognition correctness hidden until Production lock | `acquisition-holdout-feedback-lock.mjs`, `acquisition-holdout-guards.mjs` | holdout feedback/guard tests | GREEN |
| Production cannot read recognition correction | holdout feedback/guard state transitions | holdout feedback/guard tests | GREEN |
| Feedback only after Recognition + Production | `acquisition-holdout-feedback-lock.mjs` | `acquisition-holdout-feedback-lock.test.mjs` | GREEN |
| Raw evidence append-only and immutable | `acquisition-evidence-ledger.mjs` | evidence ledger tests | GREEN |
| Evidence has reproducible sequence metadata | `acquisition-evidence-ledger.mjs` | `acquisition-evidence-sequence.test.mjs` | GREEN |
| Evidence has protocol/data/criteria provenance | `acquisition-evidence-ledger.mjs` | `acquisition-version-traceability.test.mjs` | GREEN |
| Exact Recognition/Production scoring | `acquisition-exact-scoring.mjs` | `acquisition-exact-scoring.test.mjs` | GREEN |
| Structural partial diagnostics do not replace exact Production | `acquisition-exact-scoring.mjs` | exact-scoring tests | GREEN |
| RT/PT/RPG/CA deterministic metrics | `acquisition-session-metrics.mjs` | `acquisition-session-metrics.test.mjs` | GREEN |
| G(d) preserves distance bands | `acquisition-generalization-curve.mjs` | `acquisition-generalization-curve.test.mjs` | GREEN |
| G(d) result carries protocol/data provenance | `acquisition-generalization-curve.mjs` | `acquisition-curve-provenance.test.mjs` | GREEN |
| Cross-artifact provenance consistency | `acquisition-interpretation.mjs` | `acquisition-provenance-consistency.test.mjs` | GREEN |
| Versioned interpretation criteria | `acquisition-interpretation.mjs` | interpretation tests | GREEN |
| HOLDOUT outcomes cannot define criteria | `acquisition-interpretation.mjs` | interpretation criteria tests | GREEN |
| Structural-only FEC boundary | `acquisition-fec-integration.mjs` | `acquisition-structural-boundary.test.mjs` + FEC integration tests | GREEN |
| Semantic/phonological/grammatical/canonical bindings remain outside structural scoring | FEC structural boundary + canonical eligibility gates | boundary + language/canon tests | GREEN |
| Exact frontier preserves canonical 80/90/95 results | `acquisition-frequency-frontier.mjs` | frontier regression tests | GREEN |
| Exact frontier performance budget | optimized exact frontier | `acquisition-frequency-frontier-performance.test.mjs` | GREEN |
| FEC integration preserves HOLDOUT separation | `acquisition-fec-integration.mjs` | FEC integration tests | GREEN |

## Design-spec boundary

The source specification explicitly excludes UI, persistence service, participant authentication, adaptive training, and automatic canonical binding from V1. This matrix therefore does **not** treat their absence as a defect.

## V1 success criterion

The implemented architecture now has executable coverage for the protocol sequence, HOLDOUT integrity, immutable raw evidence, deterministic exact scoring, distance-conditioned G(d), version provenance, and the structural/linguistic boundary. The repository test gate is the evidence for implementation status; this matrix does not claim participant-level experimental validity or linguistic/canonical acquisition.
