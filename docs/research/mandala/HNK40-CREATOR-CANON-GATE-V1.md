# HNK40 — Consolidated Creator Canon Gate V1

Status: `READY_FOR_CREATOR_DECISION`
Authority: `CREATOR_GATE / NO AUTOMATIC CANON PROMOTION`
Scope: G01–G40

## Research state

- Source provenance: 40/40
- Direct visual inspection: 40/40
- Normalized source-visible traces: 40/40
- Candidate D inventory/comparison: 40/40
- Global reconciliation: 40/40
- Automatic canon promotion: 0/40

Research artifacts:
- `data/benchmarks/hnk40-global-reconciliation-v1.json`
- `data/benchmarks/hnk40-research-ledger-40.v2.json`
- `data/benchmarks/hnk40-batch-bcd-structural-diff.v1.json`
- `data/benchmarks/hnk40-g11-g40-geometry-fingerprints.v1.json`

## Decision model

The Creator may approve the recovered new-plate geometry, retain Candidate D, approve an explicit transformation relationship, request retrace, or defer.

`A.S.` means continue execution; it does **not** silently convert a research proposal into canon.

## Explicit debt requiring focused attention

| Glyph | Current issue | Available decision |
|---|---|---|
| G07 | upper-right mark unresolved | part of glyph / not part / retrace / defer |
| G17 | derived ambiguity retained | approve trace / retrace / defer |
| G18 | prior machine review retained | approve trace / retrace / defer |
| G20 | derived ambiguity retained | approve trace / retrace / defer |
| G28 | prior machine review retained | approve trace / retrace / defer |

## Global decision options

### Option A — Approve new-plate reconstruction
Promote the source-derived reconstruction for all glyphs whose evidence is accepted, while preserving unresolved items as deferred.

### Option B — Retain Candidate D
Keep Candidate D as the visual canon for selected glyphs and record the new plate as research evidence.

### Option C — Hybrid
Decide per glyph/family. This is the default mechanism if the Creator wants different treatment across the 40 glyphs.

### Option D — Retrace/defer
Keep the research evidence but leave selected glyphs outside canon until a future source review.

## Canon safety

No option above is executed automatically by this document. The gate is a decision surface only.

The repository remains fully usable without resolving every item immediately. Research, documentation, code, assets and subsequent HNK work may continue while decisions remain pending.

## Next execution after decision

1. Write `hnk40-creator-decisions.v1.json`.
2. Bind each decision to the relevant source, trace and comparison identifiers.
3. Promote only explicitly approved records.
4. Preserve all rejected/deferred alternatives as historical evidence.
5. Generate the final Visual Canon V2 manifest.
6. Produce the signed provenance/canon package for downstream HNK-KODE consumers.

## Operating rule

GPT + GitHub remain the primary execution environment. Local runtime, Actions, CI, deployment and external services are optional and non-blocking.
