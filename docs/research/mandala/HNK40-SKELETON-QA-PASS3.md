# HNK40 Skeleton QA — Pass 3

Status: `EXECUTED / HOLD_PARTIAL`
Authority: `RESEARCH / NON-CANONICAL`

## Exact input

Conversation raster: `hnk40_plate.png`

- dimensions: `1536 × 1024`
- SHA-256: `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`
- matrix body inherited from Pass 2: `[357,536] → [1162,716]`
- quarantined input set: 30 glyphs

## Adaptive method

Pass 3 reprocessed only the 30 Pass-2 quarantined cells. For each cell:

1. preserve the row-major crop and left 60% glyph ROI;
2. convert RGB → HSV;
3. select warm luminous pixels (`H <= 45`, `S >= 45` in OpenCV HSV space);
4. derive a local Otsu luminance threshold from the warm-pixel population;
5. evaluate three local thresholds at `Otsu-10`, `Otsu`, `Otsu+10`, clamped to `[90,220]`;
6. remove connected components smaller than 4 px;
7. skeletonize each mask;
8. measure skeleton pixels, endpoints, junction pixels and connected components;
9. require 1-px-tolerant adjacent-threshold overlap >= 0.78 and stable endpoint/component topology.

This pass deliberately remains conservative. It does not alter the source crop or invent missing strokes.

## Result

Of the 30 quarantined cells:

```text
ADAPTIVE_FREEZE_READY = 5
REMAIN_QUARANTINED = 25
```

New adaptive freeze-ready set:

```text
G05 G14 G15 G24 G34
```

Pass-2 freeze-ready count was 10, so the current automatic freeze ceiling is:

```text
10 previous + 5 new = 15 / 40
```

The remaining 25 MUST NOT be promoted from raster extraction alone.

## Important diagnostic

Several cells retained excellent tolerant pixel overlap but changed connected-component or endpoint topology across the three local thresholds. That is evidence that glow/antialiasing fragmentation is still influencing the extracted graph.

Additionally, four quarantined cells (`G01`, `G04`, `G11`, `G21`, `G31` includes five direct-family positions, with G01/G04/G11/G21/G31 producing empty warm-mask skeletons under this adaptive rule where applicable) demonstrate that one color-selection rule is not universally valid across the board. Empty extraction is treated as extraction failure, never as an empty glyph.

## Gate decision

- Preserve all Pass-2 freeze-ready glyphs.
- Add `G05 G14 G15 G24 G34` to automatic freeze-ready status.
- Keep the other 25 in quarantine.
- Do not lower the topology criterion merely to reach 40/40.
- Do not run authoritative Candidate-D scoring on quarantined raster skeletons.
- `G17` and `G20` retain the independent E5 ambiguity guard.

## Next strategy

The remaining 25 require a color-agnostic topology-preserving extraction strategy. Recommended Pass 4:

```text
local contrast / luminance ridge extraction
→ multi-scale line response
→ border/text suppression
→ topology stability ensemble
→ per-glyph disposition
```

If Pass 4 still cannot freeze a specimen, the correct disposition is `VECTOR_OR_HUMAN_TRACE_REQUIRED`, not forced raster canonization.
