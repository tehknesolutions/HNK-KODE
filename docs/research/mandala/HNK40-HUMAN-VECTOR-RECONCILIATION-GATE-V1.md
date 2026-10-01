# HNK40 — Human / Vector Reconciliation Gate V1

Status: `OPEN / 40 OF 40 ROUTED`
Authority: `RESEARCH / NON-CANONICAL`

## Purpose

Resolve the final visual identity of the new HNK40 plate without allowing raster artifacts or Candidate D legacy decoration to silently become canon.

## Current disposition

All 40 glyph slots now have an explicit route:

- `37/40` — `VECTOR_OR_HUMAN_TRACE_REQUIRED`.
- `3/40` — `MACHINE_MEASURED_REVIEW_REQUIRED`: G18, G28, G39.
- `0/40` — automatically promoted to visual canon.

G17 and G20 retain the independent `DERIVED_AMBIGUOUS` structural guard.

## Evidence stack per Gxx

Each reconciliation record MUST preserve, where available:

1. E5 structural identity/status.
2. Candidate D core primitive P01–P10 and family transform.
3. Candidate D auxiliary markers as a separate, non-required layer.
4. Exact new-plate source hash and crop provenance.
5. Raster skeleton evidence and QA disposition.
6. Human/vector trace geometry with provenance.
7. Machine comparison metrics, when valid.
8. Creator decision.

## Human trace rules

A trace is evidence reconstruction, not redesign.

The tracer MUST:

- follow the visible centerline/primary stroke of the new plate;
- ignore glow, anti-aliasing, printed labels and cell boundaries;
- preserve visible junctions, open/closed terminals and disconnected intentional marks;
- never add a stroke solely because Candidate D contains it;
- never remove a visible stroke solely to match Candidate D;
- store normalized vector coordinates and a deterministic hash;
- bind the trace to its exact Gxx source crop.

If the raster does not resolve a stroke unambiguously, disposition is `CREATOR_DECISION_REQUIRED`, not guessed geometry.

## Reconciliation classes

After vector/trace evidence exists, each Gxx may be proposed as one of:

- `PRESERVED` — new plate retains Candidate D core geometry.
- `TRANSFORMED` — same core identity under an allowed geometric/style transformation.
- `REDESIGNED` — new plate intentionally establishes materially different geometry.
- `CONFLICT` — evidence sources disagree and no automatic resolution is valid.
- `UNRESOLVED` — insufficient evidence.

These are proposals until Creator approval.

## Creator Human Gate

For each glyph the Human Gate SHALL expose side-by-side:

`E5 identity | Candidate D core | new plate crop | recovered trace | machine metrics | proposed class`

Creator decisions:

- `APPROVE_NEW_PLATE`
- `KEEP_CANDIDATE_D`
- `APPROVE_TRANSFORM`
- `REQUEST_RETRACE`
- `DEFER`

Only explicit approval can produce `VISUAL-CANON-V2`.

## Execution batches

To keep review tractable, reconciliation proceeds in four row-major batches:

- Batch A: G01–G10
- Batch B: G11–G20
- Batch C: G21–G30
- Batch D: G31–G40

G18/G28/G39 carry their existing machine measurements into their respective batches but remain Human Gate items.

## Completion condition

The gate closes only when all 40 records have provenance-preserving vector/trace evidence or an explicit Creator disposition. No unresolved item is silently defaulted to Candidate D or to the new plate.
