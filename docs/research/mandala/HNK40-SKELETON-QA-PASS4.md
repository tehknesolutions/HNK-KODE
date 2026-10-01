# HNK40 Skeleton QA — Pass 4

Status: `EXECUTED / FINAL_RASTER_DISPOSITION`
Authority: `RESEARCH / NON-CANONICAL`

## Input

25 glyphs remaining in quarantine after Pass 3.

Exact provenance-bound source: `HNK-IDIOMA--canvas-iso-arquitetura-do-glifo-sistema-completo-40-caracteres.png` (1536×1024), SHA-256 `f67dab0e19dbd62ef57dfc69b8c3dc16ef36b29dcce8a5910b965f50f20827d9`.

Frozen matrix body: `[357,536] → [1162,716]`, 10×4 row-major. Per-cell ROI remains left 60% with 3 px inset to avoid adjacent printed annotation.

## Method

Color-agnostic luminance segmentation was applied independently to every remaining ROI.

For each glyph:

1. convert the exact crop to grayscale;
2. compute its local Otsu threshold;
3. evaluate `Otsu-12`, `Otsu`, `Otsu+12`;
4. remove connected components smaller than 4 px;
5. skeletonize each mask;
6. compute skeleton pixels, endpoints, junction pixels and connected components;
7. compare adjacent thresholds with 1 px tolerant skeleton overlap;
8. accept only when overlap >= 0.78 and endpoint/component topology remains stable.

This pass deliberately removes the warm-hue dependency identified in Passes 2–3.

## Result

```text
input quarantine = 25
new FREEZE_READY = 2
G18 G25

cumulative FREEZE_READY = 17 / 40
VECTOR_OR_HUMAN_TRACE_REQUIRED = 23 / 40
```

The remaining 23 are:

```text
G01 G02 G03 G04 G07 G08 G10 G11 G13 G16
G17 G19 G20 G21 G22 G23 G27 G29 G30 G31
G37 G38 G40
```

## Decision

The raster-only automatic extraction path is now exhausted. The 23 remaining specimens MUST NOT be forced through weaker thresholds merely to reach 40/40.

Disposition:

- 17 glyphs: `FREEZE_READY_RASTER`.
- 23 glyphs: `VECTOR_OR_HUMAN_TRACE_REQUIRED`.
- G17/G20 retain `DERIVED_AMBIGUOUS` independently of extraction disposition.
- Candidate D deterministic scoring may begin for the 17 freeze-ready glyphs.
- Full 40/40 Candidate D scoring remains blocked until the other 23 receive provenance-preserving vector recovery or explicit human trace/review.

## Next gate

Run Candidate D comparison on the 17 stable raster skeletons as a partial, non-canonical diff while opening vector/human trace recovery for the 23 unresolved specimens.