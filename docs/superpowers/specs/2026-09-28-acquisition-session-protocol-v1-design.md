# Acquisition Session Protocol V1 — Design Spec

**Status:** Design frozen for review  
**Date:** 2026-09-28  
**Scope:** KODESCRIPT / Family Expansion Corpus V1

## Purpose

Test whether a participant learns transferable structural rules rather than merely memorizing known glyphs. The experiment must preserve strict separation between geometry, phonology, semantics, grammar, and canon.

## Experimental Architecture

The protocol is progressive and stateful:

`BASELINE → ACQUISITION → CONTRAST → RECOGNITION_TRANSFER → PRODUCTION_TRANSFER → FEEDBACK`

A single `sessionId` links the full evidence trail. TRAIN teaches structural regularities; the 32 deterministic contrast pairs measure structural discrimination; HOLDOUT remains unavailable to training and calibration and is revealed only during transfer.

## Holdout Rule

HOLDOUT uses progressive testing. Recognition occurs first. Its answer is locked without correctness feedback. Production follows without access to the recognition result or correction. Feedback becomes available only after both phases are complete.

No HOLDOUT item may influence training, threshold calibration, stimulus selection, or protocol tuning for the same protocol version.

## Components

1. **Protocol Engine** — enforces legal phase transitions and stimulus visibility.
2. **Evidence Store** — records immutable append-only raw events.
3. **Scoring** — derives exact scores without mutating evidence.
4. **Analysis** — computes aggregate metrics, distance curves, and pre-registered interpretations.

Each component must be independently testable and communicate through explicit data contracts.

## Evidence Contract

Every response records at minimum: `participantId`, `sessionId`, `stimulusId`, `phase`, `response`, `responseTimeMs`, presentation order, structural distance metadata, and timestamp/order metadata sufficient to reproduce the session sequence.

Raw evidence is append-only. Derived scores and interpretations are separate artifacts and may always be regenerated from the raw evidence plus the versioned protocol.

## Scoring

Exact scoring remains primary:

- `RT = recognitionCorrect / recognitionTotal`
- `PT = productionExact / productionTotal`
- `RPG = RT - PT`
- `CA = contrastCorrect / contrastTotal`

Production may additionally expose structural partial diagnostics, but partial credit never replaces the exact-production result.

`G(d)` reports recognition and production performance across increasing structural-distance bands. Aggregate accuracy must not erase the distance curve.

## Interpretation

V1 does not define an arbitrary universal percentage for “language acquired.” Interpretation is pre-registered and may report: `INSUFFICIENT_EVIDENCE`, `MEMORIZATION_COMPATIBLE`, `STRUCTURAL_TRANSFER_OBSERVED`, or `PRODUCTIVE_TRANSFER_OBSERVED` only when the versioned criteria support that conclusion.

Thresholds and interpretation rules must be fixed without using HOLDOUT outcomes. Changing them creates a new protocol version rather than silently reinterpreting V1 evidence.

## Structural Boundary

The experiment measures structural acquisition only. Geometry does not automatically create or validate a lexeme, phoneme, semantic value, grammatical role, sacred correspondence, or canonical HNK binding.

The FEC registry and confusion metric remain structural-only inputs. Linguistic/canonical promotion requires its own independent evidence and authority gates.

## Required Invariants

- HOLDOUT is never used for acquisition or calibration.
- Recognition cannot expose correctness before Production is locked.
- Production cannot read recognition correctness or feedback.
- Raw evidence is never rewritten by scoring or analysis.
- Scoring is deterministic and reproducible.
- Session phase transitions are explicit and reject illegal transitions.
- Every result identifies the protocol/data versions that generated it.
- Semantic, phonological, grammatical, and canonical bindings remain outside structural scoring.

## V1 Success Criterion

V1 succeeds as an experimental architecture when it can reproducibly distinguish memorization-compatible performance from transfer to structurally novel families while preserving HOLDOUT integrity and separately measuring recognition and productive transfer as a function of structural distance.

It does not, by itself, establish linguistic or canonical acquisition.

## Implementation Boundary

Implementation should add versioned protocol/data schemas, a small deterministic protocol state machine, append-only evidence validation, pure scoring/analysis functions, and tests for leakage and illegal transitions. No UI, persistence service, participant authentication, adaptive training, or automatic canonical binding belongs in V1.
