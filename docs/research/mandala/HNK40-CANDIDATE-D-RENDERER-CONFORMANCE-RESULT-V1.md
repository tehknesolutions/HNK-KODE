# HNK40 — Candidate D Renderer Conformance Result V1

Status: `RENDERER_CONFORMANT / SCORING_INPUT_HOLD`
Authority: `RESEARCH / NON-CANONICAL`

## Exact renderer

Candidate D core geometry was rendered from the recovered SVG primitives with CairoSVG, preserving SVG arc commands, line/polyline/circle geometry, stroke width 4.5, round line caps/joins and the family transforms used by G01–G40.

Candidate-D-specific corner circles/border lines were excluded from the structural render, as required by the partial-diff gate.

## Connectivity correction

Skeleton topology MUST use 8-neighbour connectivity. A 4-neighbour connected-component count fragments diagonal SVG strokes and is invalid for this alphabet. Any exploratory numbers produced with 4-neighbour labelling are rejected and MUST NOT enter the benchmark registry.

## Renderer sanity evidence

Identity-family primitive renders were non-empty and structurally coherent under 8-neighbour topology. Representative examples:

- P05: 341 skeleton px, 5 endpoints, 9 junction px, 1 component.
- P06: 336 skeleton px, 0 endpoints, 0 junction px, 2 components (outer diamond + inner circle).
- P08: 366 skeleton px, 0 endpoints, 7 junction px, 1 component.

This clears the Candidate D renderer itself.

## New finding: raster skeleton topology quality

When the 17 previously threshold-stable new-plate skeletons were normalized and compared using the corrected 8-neighbour topology, many retained multiple disconnected raster fragments. Threshold stability alone therefore proves repeatability, not topological cleanliness.

Consequently:

- the label `FREEZE_READY_RASTER` remains valid as a *stable extraction* disposition;
- it is NOT sufficient by itself for topology-sensitive Candidate D scoring;
- no numeric Candidate D result class from this exploratory comparison is accepted;
- the 17 require a topology-cleanliness gate (or provenance-preserving trace) before structural classification.

## Gate update

Candidate D exact renderer: `PASS`.

New-plate 17 stable skeletons: `TOPOLOGY_QA_REQUIRED`.

Remaining 23: `VECTOR_OR_HUMAN_TRACE_REQUIRED`.

G17/G20: retain independent `DERIVED_AMBIGUOUS` guard.

## Next execution

For each of the 17 stable raster skeletons, inspect component structure against the original crop and separate true disconnected glyph components from raster/glow fragments without inventing strokes. Only topology-clean records may proceed to numeric Candidate D scoring. Records that cannot be cleaned provenance-preservingly are escalated to `HUMAN_TRACE_REQUIRED`.