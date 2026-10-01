# HNK40 — Candidate D Partial Diff Gate V1

Status: `READY_FOR_PARTIAL_SCORING`
Authority: `RESEARCH / NON-CANONICAL`

## Inputs

### New plate raster extraction

Pass 4 froze the raster-only automatic path at:

- `17/40 FREEZE_READY_RASTER`
- `23/40 VECTOR_OR_HUMAN_TRACE_REQUIRED`
- `G17/G20 DERIVED_AMBIGUOUS` remains independently guarded.

### Candidate D vector grammar

Historical Candidate D SVG provides exact `P01–P10` primitives and `G01–G40` symbols. The G symbols contain a core proto-glyph/family transform plus Candidate-D-specific marker geometry.

## Comparison layers

Candidate D SHALL be decomposed before scoring:

1. `CORE_FORM` — referenced P01–P10 geometry.
2. `FAMILY_TRANSFORM` — rotation/reflection applied by G family.
3. `CANDIDATE_D_MARKERS` — auxiliary corner circle / border line geometry.
4. `NEW_PLATE_ORNAMENT` — raster styling/glow, excluded from structural score.

The score MUST compare layers 1+2 against the stable new-plate skeleton. Layer 3 is recorded separately and MUST NOT create a structural conflict by itself.

## Eligible set

The exact 17-member set SHALL be derived from QA Passes 2–4, not guessed from artwork. Only records with final disposition `FREEZE_READY_RASTER` may enter automatic scoring.

## Metrics

For every eligible Gxx:

- normalize both geometries to a common 0–1 bounding box;
- preserve aspect ratio;
- compare skeleton topology;
- compute endpoint/component deltas;
- compute bidirectional nearest-skeleton distance;
- compute tolerant overlap after rasterizing Candidate D core at a fixed resolution;
- report whether rotation/reflection is intrinsic to Candidate D family grammar;
- keep style/marker differences outside the structural score.

## Result classes

- `CORE_PRESERVED`
- `CORE_PRESERVED_WITH_STYLING`
- `STRUCTURAL_VARIANT`
- `VISUAL_REDESIGN`
- `REVIEW_REQUIRED`

No result promotes canon automatically.

## Safety gates

- No scoring for the 23 unresolved raster specimens.
- No automatic collapse of G17/G20 E5 ambiguity.
- No semantic/phonological inference from geometry.
- No Candidate D auxiliary marker may be required merely because Candidate D used it.
- Human Gate remains mandatory for `VISUAL-CANON-V2`.

## Execution target

Produce `data/benchmarks/hnk40-candidate-d-partial-diff.v1.json` containing the 17 eligible records, exact source hashes/refs, metrics and result classes. In parallel, route the remaining 23 to vector recovery or explicit human trace.