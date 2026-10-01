# HNK40 — New Plate Source Binding V1

Status: `SOURCE_BINDING_GATE_READY`
Authority: `RESEARCH / NON-CANONICAL`
Parent: `HNK40-VISUAL-RECONCILIATION-V1`

## Purpose

Bind the newly supplied HENUVOKODAN visual plates to reproducible specimen identities before any G01–G40 geometric comparison.

The plates are evidence supplied by the Creator, but raster presentation alone does not justify silently assigning a visual specimen to a Gxx identity when labels, geometry or board-to-board mappings conflict.

## Evidence policy

Each plate/specimen SHALL receive:

- `plateId`
- `specimenId`
- visible label(s), if any
- claimed G/P identity, if visibly present
- source type (`CHAT_RASTER`, later optionally `VECTOR_SOURCE`)
- crop/bounds provenance when extractable
- geometry state
- authority state
- conflict notes

## Initial plate families observed

The supplied board set contains candidate material for:

- ten sephirotic proto-glyphs (`P01–P10` candidate layer)
- HNK40 / G01–G40 matrices
- four-world projections
- HNK-SIMPLE / HNK-CODEX / HNK-MAGNUM
- HNK-ISO
- HNK-RADIAL
- HNK-GLYPH
- HNK-SIGIL
- Color-72
- ligatures / HENUVOKODAN composition
- HNK-Verse visual bible / applications

These family labels describe observed board intent; they do not promote individual mappings.

## Binding states

Allowed states:

- `PLATE_REGISTERED`
- `SPECIMEN_LABEL_VISIBLE`
- `GXX_CLAIMED_BY_PLATE`
- `VECTOR_SOURCE_RECOVERED`
- `RASTER_ONLY`
- `BOARD_CONFLICT`
- `GEOMETRY_READY`
- `GEOMETRY_NOT_READY`
- `HUMAN_IDENTITY_REQUIRED`

## Comparison prohibition

A specimen SHALL NOT enter deterministic Candidate-D/E5 comparison until either:

1. an exact vector source is recovered; or
2. a raster specimen has a stable, provenance-preserving geometric extraction sufficient to reconstruct its topology without inventing strokes.

OCR/text recognition alone is not geometric evidence.

## Human authority rule

Because these new boards were supplied directly in the project conversation, an explicit Creator decision can resolve which visible specimen is intended to represent a particular Gxx/Pxx. Such a decision is a canonical identity assignment within HNK, but it does not retroactively make machine-inferred geometry authoritative.

## Next machine artifact

`data/benchmarks/hnk40-new-plate-source-binding.v1.json`

Until exact specimen geometry is bound, reconciliation records remain `PENDING_NEW_PLATE` rather than being scored visually by impression.