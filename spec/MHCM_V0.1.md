# Mandala-HNK Computational Model — MHCM v0.1

**Status:** ARCHITECTURE BASELINE / FORMALIZATION IN PROGRESS
**Data:** 2026-09-29

Mandala-HNK = Encoding + Grammar + Computational Substrate
TEXT <-> AST <-> MANDALA <-> GLYPH <-> HNK-IR

## Structural space
12 fundamental HENUVOKODAN keys/letters. 432 MF = 72 sectors x 6 layers. 463 ACTIVE = 432 MF + 9 external + 22 center. 504 physical slots = 463 active + 41 reserved. HNK40 is a genesis/validation corpus, not total language capacity.

## Core model
Cell = Mandala position. Address = stable position identifier. Edge = permitted relation/traversal. Path = ordered traversal. Glyph = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM. Transform semantics must be explicit/testable. Composition preserves provenance/decodability. Type and Operator require explicit semantic specification. Program is a valid computational composition representable through HNK-IR.

Structural validity != linguistic canon.

## Conversion
TEXT -> AST -> MANDALA/GLYPH -> HNK-IR -> RUNTIME
Round-trip guarantees are declared per feature, not assumed globally.

## KODESCRIPT V0
KODE SOURCE -> AST -> HNK-IR -> RUNTIME WORLD
world -> entity -> property -> event -> action

UI, Backend, Data, Network, AI and Automation expand after the minimal slice is executable/reproducible.

## Canonical gate
CODEX-HNK/Glyph Genesis candidates enter with provenance and validation evidence. HNK-KODE retains promotion authority for glyphs, lexemes, grammar and language semantics.

## Next
Machine-readable Address schema; Edge/Path validation; transform registry; AST schema; HNK-IR schema; deterministic codecs; round-trip tests; candidate/canonical state machine.
