# HNK40 — Batch A Vector Trace Gate V1

Status: `TRACE WORKSPACE READY / HUMAN CENTERLINE PASS REQUIRED`
Authority: `RESEARCH / NON-CANONICAL`

## Scope

Batch A: G01–G10.

Source authority is frozen by `data/benchmarks/hnk40-batch-a-trace-input.v1.json` and the original specimen registry. The exact source raster is SHA-256 `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`.

## Preparation executed

The ten authoritative source crops were re-materialized from their registry crop boxes and enlarged 10× with high-quality resampling for visual centerline inspection. Enlargement is a review aid only; vector coordinates MUST remain normalized to each original authoritative crop.

## Trace policy

For G01–G10:

1. inspect the authoritative crop, not Candidate D;
2. identify visible primary centerline strokes and intentional disconnected marks;
3. encode each stroke as ordered normalized `[x,y]` points in `[0,1]²` relative to the original crop;
4. preserve stroke separation where visible;
5. do not infer hidden geometry from glow;
6. do not add Candidate D markers;
7. hash canonicalized normalized geometry after trace;
8. if a stroke/mark cannot be resolved visually, record it as `CREATOR_DECISION_REQUIRED` rather than guessing.

## Current visual routing

- G01–G06: `TRACE_FROM_SOURCE`
- G07: `TRACE_MAIN_BODY + CREATOR_DECISION_REQUIRED_FOR_UPPER_RIGHT_MARK`
- G08–G10: `TRACE_FROM_SOURCE`

This routing is not a vector result. It only states whether the source image is sufficiently legible to begin manual centerline reconstruction.

## Required output

`data/benchmarks/hnk40-batch-a-vector-traces.v1.json`

Each record must contain:

- `glyphId`
- authoritative `cropBoxPx`
- registry crop SHA-256
- `strokes[]` normalized coordinates
- `intentionalMarks[]` when applicable
- `unresolved[]`
- canonical geometry SHA-256
- trace confidence
- `CREATOR_DECISION_REQUIRED` flag

## Gate

No Candidate D comparison and no `PRESERVED / TRANSFORMED / REDESIGNED` proposal is valid until this trace artifact exists.