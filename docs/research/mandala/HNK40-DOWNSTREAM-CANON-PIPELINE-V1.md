# HNK40 — Downstream Visual Canon V2 Pipeline V1

Status: READY
Authority: CREATOR_CANON_GATE
Current decision manifest: data/benchmarks/hnk40-creator-decisions.v1.json

## Current state

The Creator Decision Manifest contains G01-G40 as PENDING. Therefore Visual Canon V2 MUST NOT be generated as an approved-canon artifact yet.

## Promotion pipeline

1. Read explicit decision from creator-decisions manifest.
2. Validate that the decision is one of the declared states.
3. Resolve evidence references for the selected geometry.
4. Preserve the non-selected alternative as historical research evidence.
5. Generate a per-glyph promotion record.
6. Generate the Visual Canon V2 manifest only from explicitly promoted records.
7. Produce a downstream compatibility report for HNK-KODE consumers.

## Safety invariants

- PENDING never promotes.
- RETAIN_CANDIDATE_D never silently rewrites the source-derived trace.
- APPROVE_NEW_PLATE never deletes Candidate D evidence.
- HYBRID requires an explicit per-glyph or family-level mapping.
- RETRACE returns the glyph to research without canon promotion.
- DEFER leaves canon unchanged.
- Research artifacts remain immutable historical evidence.
- GPT + GitHub remain sufficient for execution; local runtime, Actions, CI and deployment are optional.

## Completion condition

The pipeline is complete only when every promoted glyph has: source provenance + selected geometry reference + decision record + deterministic fingerprint + promotion record.

Until then, the correct canonical state is PENDING.