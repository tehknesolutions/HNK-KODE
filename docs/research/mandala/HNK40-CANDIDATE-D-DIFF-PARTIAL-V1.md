# HNK40 — Candidate D Partial Diff V1

Status: `ACTIVE / PARTIAL / NON-CANONICAL`

## Gate input

Raster QA now has:

- `17/40 FREEZE_READY_RASTER`
- `23/40 VECTOR_OR_HUMAN_TRACE_REQUIRED`

Candidate D historical SVG is recovered from `tehknesolutions/codex-hnk`, branch `research/hnk40-e5-hybrid-v1`, file `docs/architecture/HNK40_V2_CANDIDATE_GLYPH_SHEET_B.svg`.

The recovered SVG defines explicit `P01…P10` vector primitives and `G01…G40` symbols. The G families are generated structurally from the P forms plus world-family transforms/markers: G01–G10 base P01–P10, G11–G20 rotated 90°, G21–G30 mirrored on X, and G31–G40 rotated 180° (subject to exact per-symbol SVG definitions).

## Important comparison rule

Candidate D contains deliberate family markers (corner circles / boundary strokes) in addition to the P-form. The new HENUVOKODAN raster matrix visually presents character glyphs without guaranteeing those same Candidate-D marker semantics.

Therefore the first diff MUST separate:

1. `CORE_FORM` — proto-glyph/body topology;
2. `FAMILY_TRANSFORM` — rotation/reflection/orientation;
3. `CANDIDATE_D_MARKERS` — auxiliary circle/boundary stroke;
4. `NEW_PLATE_ORNAMENT` — glow/rendering/styling.

A mismatch in Candidate-D auxiliary markers is not automatically a core-form conflict.

## Partial comparison scope

Only the 17 `FREEZE_READY_RASTER` glyphs may enter automatic raster-vs-vector scoring in this pass. The remaining 23 stay excluded from deterministic scoring.

For every admitted Gxx, emit:

- Candidate D exact symbol identity;
- referenced Pxx;
- declared transform;
- marker geometry;
- frozen raster skeleton identity/hash;
- normalized core-form similarity;
- topology compatibility;
- classification: `PRESERVED`, `PRESERVED_WITH_STYLING`, `STRUCTURAL_VARIANT`, `VISUAL_REDESIGN`, `CONFLICT`, or `REVIEW_REQUIRED`.

## Ambiguity guard

`G17` and `G20` retain their independent E5 `DERIVED_AMBIGUOUS` state. Candidate D similarity cannot collapse that structural ambiguity.

## Current disposition

This commit opens the diff gate and records the recovered vector grammar. It does not fabricate scores from the 23 unresolved raster traces and does not promote Candidate D or the new plate to visual canon.

## Next execution

1. render the exact Candidate D G01–G40 symbols from SVG;
2. isolate `CORE_FORM` from Candidate-D markers;
3. compare the 17 stable raster skeletons against their same-ID Candidate D core forms;
4. emit machine-readable partial diff;
5. in parallel, recover/trace the remaining 23.