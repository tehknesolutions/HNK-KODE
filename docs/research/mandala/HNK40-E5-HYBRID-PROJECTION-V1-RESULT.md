# HNK40 → E5 Hybrid Projection V1 — Gate Result

Status: RESEARCH_RESULT / NON-CANONICAL
Date: 2026-09-28
Rule: `HNK40-E5-V4-DIRECTION-DISTANCE@1`

## Provenance

Mirrored from `tehknesolutions/codex-hnk` branch `research/hnk40-e5-hybrid-v1`, commit `cd03906d`.

## Result

- Total legacy records: 40
- `DIRECT`: 4 (`G01`, `G11`, `G21`, `G31`)
- `DERIVED_UNIQUE`: 34
- `DERIVED_AMBIGUOUS`: 2 (`G17`, `G20`)
- `NO_E5_PROJECTION`: 0
- `PENDING_RULE`: 0

G17 and G20 retain both minimum-score candidates. Neither has a preferred projection. Acquisition exposes them as `CANDIDATE_SET`, not fabricated scalar targets.

Every emitted E5 candidate is a 12-node simple path. The generator validates G01…G40 identity, source edge geometry and Mandala addresses. Generation is non-mutating and byte-deterministic.

## Authority boundary

The V4 bridge is a structural research derivation. Projections have `authority: DERIVED_STRUCTURAL` and `canonical: false`.

This result does not canonize an E5 identity mapping and does not authorize semantic, phonetic, visual, numerological, PUA, CRC, transport-level, glyph-ordinal or lexicographic tie-breaking.

## Verification

The CODEX-HNK implementation gate completed with 14 tests, 14 pass, 0 fail before remote synchronization.
