# HNK40 — Candidate D Scoring Preflight V1

Status: `PREFLIGHT_EXECUTED / SCORING_HELD_FOR_RENDERER_CONFORMANCE`
Authority: `RESEARCH / NON-CANONICAL`

## Purpose

The 17 new-plate raster skeletons are now provenance-frozen and eligible for comparison. Before publishing numeric Candidate D scores, the Candidate D side must be rendered from its exact SVG grammar with a conformant renderer.

## Recovered Candidate D facts

The historical SVG defines exact primitives `P01–P10` and symbols `G01–G40`. Each G symbol references one primitive and applies its family transform, while auxiliary marker geometry is separate.

Observed family grammar:

- `G01–G10`: base P01–P10.
- `G11–G20`: P01–P10 rotated 90° around `(50,50)`.
- `G21–G30`: P01–P10 reflected horizontally via `translate(100 0) scale(-1 1)`.
- `G31–G40`: P01–P10 rotated 180° around `(50,50)`.

Candidate-D-specific marker circles/edge lines remain excluded from the structural core score.

## Preflight finding

A first internal metric pass using a simplified polyline/arc reconstruction was rejected before publication. It produced topology artifacts (fragmented connected components and unstable endpoint counts) on the Candidate D side. Those artifacts are properties of the approximate renderer, not evidence of glyph divergence.

Therefore **no numeric scores or preservation classes from that approximate pass are accepted or recorded**.

## Renderer conformance gate

Candidate D core rendering MUST satisfy all of the following before scoring:

1. parse the exact historical SVG primitives rather than hand-reconstructing them;
2. preserve SVG arc semantics, transforms, line caps and joins;
3. render `CORE_FORM + FAMILY_TRANSFORM` without Candidate D marker geometry;
4. rasterize at a fixed high resolution;
5. skeletonize only after rasterization;
6. verify that expected primitive topology remains stable across at least two render resolutions;
7. hash the rendered core and skeleton per Gxx;
8. only then compare against the 17 frozen new-plate skeletons.

## Current disposition

- New-plate frozen geometry: `17/17 READY`.
- Candidate D exact vector grammar: `RECOVERED`.
- Candidate D conformant structural render: `PENDING`.
- Numeric diff: `HELD`.
- 23 unresolved new-plate specimens: remain `VECTOR_OR_HUMAN_TRACE_REQUIRED`.
- G17/G20 E5 ambiguity: unchanged and protected.

## Next execution

Materialize exact Candidate D core renders/skeleton hashes through a conformant SVG path, run renderer-resolution conformance, then execute the four metric families and classifications for the 17 eligible glyphs.