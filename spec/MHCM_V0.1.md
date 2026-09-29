# Mandala-HNK Computational Model — MHCM v0.1

**Status:** ARCHITECTURE BASELINE / FORMALIZATION IN PROGRESS
**Data:** 2026-09-29

## Invariant
Mandala-HNK = Encoding + Grammar + Computational Substrate

TEXT <-> AST <-> MANDALA <-> GLYPH <-> HNK-IR

## Structural space
- 12 fundamental HENUVOKODAN keys/letters.
- 432 MF = 72 sectors x 6 layers: generative Glyph Field.
- 463 ACTIVE = 432 MF + 9 external + 22 center: active Code Space candidate.
- 504 physical slots = 463 active + 41 reserved.
- HNK40 = genesis/validation corpus, not total capacity.

## Core objects
Cell: physical/logical Mandala position.
Address: stable identifier resolving a position.
Edge: permitted relation/traversal.
Path: ordered traversal over addresses/edges.
Glyph: GLYPH = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM.
Transform: explicit/testable transformation.
Composition: combination rule preserving provenance/decodability.
Type: semantic class only when explicitly specified.
Operator: executable/compositional semantic mapped to HNK-IR.
Program: valid computational composition representable through the pipeline.

Structural validity does not imply linguistic canon.

## Conversion contract
TEXT -> AST -> MANDALA/GLYPH -> HNK-IR -> RUNTIME

Round-trip guarantees are declared per feature, never assumed globally.

## KODESCRIPT V0
KODE SOURCE -> AST -> HNK-IR -> RUNTIME WORLD

world -> entity -> property -> event -> action

UI, Backend, Data, Network, AI and Automation expand only after the minimal slice is executable/reproducible.

## Canonical gate
Research candidates from CODEX-HNK/Glyph Genesis enter with provenance and validation evidence. HNK-KODE retains promotion authority for glyphs, lexemes, grammar and language semantics.

## Next work
Machine-readable Address schema; Edge/Path rules; transform registry; AST schema; HNK-IR schema; deterministic codecs; round-trip tests; candidate/canonical state machine.
