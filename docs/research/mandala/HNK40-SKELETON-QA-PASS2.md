# HNK40 Skeleton QA — Pass 2

Status: `EXECUTED / HOLD_PARTIAL`
Authority: `RESEARCH / NON-CANONICAL`

## Input

Exact conversation raster previously provenance-bound as `hnk40_plate.png` (1536×1024), with G01–G40 matrix cells already bound row-major.

## Method

A reproducible threshold-stability pass was executed on all 40 cells:

- matrix body: `[357,536] → [1162,716]` px;
- 10 columns × 4 rows;
- per-cell glyph ROI: left 60%, 3 px inset, deliberately excluding the adjacent printed annotation area;
- HSV warm-luminous selection: `S >= 70`, warm hue, with `V` thresholds `145 / 160 / 175`;
- connected components smaller than 4 px removed;
- morphological skeletonization;
- topology descriptors: skeleton pixels, endpoints, junction pixels, connected components;
- threshold stability: 1 px tolerant skeleton overlap >= 0.78 plus stable endpoint/component topology.

## Result

```text
total = 40
FREEZE_READY = 10
QUARANTINE_REVIEW = 30
```

Quarantined by this conservative pass:

```text
G01 G02 G03 G04 G05 G07 G08 G10 G11 G13
G14 G15 G16 G17 G18 G19 G20 G21 G22 G23
G24 G25 G27 G29 G30 G31 G34 G37 G38 G40
```

The remaining 10 satisfy the current automatic threshold-stability gate.

## Interpretation

This is **not** a failure of the glyph set. It means the current raster extraction rule is too sensitive for 30 cells to freeze their geometry automatically. Glow, antialiasing, thin terminals and low-resolution cell rendering can change skeleton topology across nearby thresholds.

No quarantined glyph may be scored against Candidate D as though its raster skeleton were authoritative.

## Gate decision

- Freeze-ready candidates may proceed to provenance freeze after individual integrity record emission.
- Quarantined candidates require a second extraction strategy (adaptive/local segmentation and/or topology-preserving vector tracing) and comparison against the original cell.
- `G17` and `G20` retain their independent E5 ambiguity guard regardless of raster stability.
- Candidate D 40/40 scoring remains blocked until every row is either `FROZEN` or has an explicit review disposition.

## Next pass

`QA PASS 3 — adaptive extraction for the 30 quarantined cells → stability re-test → freeze/quarantine disposition → Candidate D diff`.
