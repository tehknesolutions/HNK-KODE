# HNK40 Skeleton QA — Pass 1

Status: `REVIEWED_RASTER_EVIDENCE / FREEZE_NOT_YET_GRANTED`
Authority: `RESEARCH / NON-CANONICAL`
Parent source registry: `data/benchmarks/hnk40-new-plate-specimen-registry.v1.json`

## Evidence reviewed

The QA pass reviews the provenance-bound 4×10 raster montage derived from the exact source board:

`HNK-IDIOMA--canvas-iso-arquitetura-do-glifo-sistema-completo-40-caracteres.png`

Source binding already fixes:

- SHA-256: `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`
- source size: `1536×1024`
- matrix region: `[424,533,1163,719]`
- 40 row-major G01–G40 crops with individual SHA-256 values.

## Pass-1 visual findings

The montage is sufficient to confirm that all forty matrix cells contain a visible luminous primary glyph candidate and that the row-major crop grid is coherent with the board layout.

However, the montage also confirms the extraction hazard already recorded in the registry: each cell includes adjacent printed annotation. Those annotations are visually distinct from the luminous glyphs, but a threshold-only mask can still capture bright text, cell rules, glow, punctuation or diacritics.

Therefore Pass 1 does **not** promote the current 40 skeleton candidates to frozen geometry.

## QA decision

```text
SOURCE CROPS          40/40  PASS
VISIBLE PRIMARY GLYPH 40/40  PASS
ROW-MAJOR IDENTITY    40/40  PASS
ANNOTATION SEPARATION visual PASS / machine mask must prove
SKELETON FREEZE       HOLD
CANDIDATE-D SCORING   HOLD
```

## Required freeze gate

Before skeleton freeze, the extraction artifact for every Gxx must preserve and expose:

1. immutable parent crop SHA-256;
2. exact glyph-only ROI or mask bounds;
3. mask SHA-256;
4. skeleton SHA-256;
5. connected-component count before/after cleanup;
6. skeleton pixel count;
7. endpoint count;
8. junction count;
9. explicit border-touch flags;
10. review state.

### Automatic HOLD conditions

A specimen remains HOLD if any of the following is true:

- skeleton touches the annotation-side exclusion zone;
- retained component intersects printed cell text;
- border/cell-rule pixels survive cleanup;
- glow bridges two strokes that are visually disconnected;
- a visible stroke is lost under thresholding;
- topology changes materially across a small threshold perturbation;
- more than one plausible glyph-only component survives without a deterministic rule.

## Threshold stability requirement

The next pass SHALL test at least three nearby luminous-mask thresholds and compare topology. A skeleton is `STABLE` only if the core graph invariants (component count, endpoints, junctions and cycle structure) remain invariant or differences are confined to non-structural terminal pixels.

This avoids freezing a skeleton that exists only because of one arbitrary raster threshold.

## Special guards

- `G17` and `G20`: even a stable raster skeleton cannot resolve the pre-existing E5 ambiguity automatically.
- Candidate D similarity is not allowed to repair or choose the raster skeleton; extraction must be completed independently first.
- Printed phonetic/character annotations in the board remain claims of the board, not geometry.

## Next artifact

`data/benchmarks/hnk40-skeleton-qa.v1.json`

It should contain 40 per-glyph QA records and only enable Candidate D comparison when all accepted specimens satisfy the freeze gate.