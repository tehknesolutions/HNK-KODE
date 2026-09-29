# Mandala-HNK Computational Model — MHCM v0.1

**Status:** ARCHITECTURE BASELINE / FORMALIZATION IN PROGRESS
**Data:** 2026-09-29
**Structural authority:** CODEX-HNK `HNK-MANDALA-ROOT-V1` v1.0.0
**Authority state:** consumed versioned ROOT contract

## Invariant

Mandala-HNK = Encoding + Grammar + Computational Substrate

TEXT <-> AST <-> MANDALA <-> GLYPH <-> HNK-IR

MHCM is a Mandala computational projection/addressing model around the canonical computational pipeline. It does not create a second parser, semantic authority, IR or runtime beside haKodan.

## Structural space

The following constants are consumed from CODEX-HNK contract `contracts/HNK_MANDALA_ROOT_V1.md`, Contract ID `HNK-MANDALA-ROOT-V1`, version `1.0.0`:

- 12 fundamental HENUVOKODAN keys/letters.
- 432 MF = 72 sectors × 6 layers: generative Glyph Field.
- 463 ACTIVE = 432 MF + 9 external + 22 center.
- 504 physical slots = 463 active + 41 reserved.
- HNK40 = genesis/validation corpus, not total language capacity.

These values are not independently re-canonized by HNK-KODE. If the CODEX ROOT contract changes version, this specification must explicitly reconcile before adopting the new structural definition.

## Core objects

Cell: physical/logical Mandala position.

Address: stable identifier resolving a position.

Edge: permitted relation/traversal.

Path: ordered traversal over addresses/edges.

Glyph structural form:

`GLYPH = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM`

Transform: explicit/testable transformation.

Composition: combination rule preserving provenance/decodability.

Type: semantic class only when explicitly specified.

Operator: executable/compositional semantic mapped to HNK-IR.

Program: valid computational composition representable through the canonical pipeline.

Structural validity does not imply linguistic canon.

## Authority boundary

CODEX-HNK retains authority over source geometry, structural Mandala identity, ROOT constants and their version history.

HNK-KODE retains authority over linguistic/computational bindings and manifestations built on the consumed ROOT structure: lexemes, grammar, semantic IDs, language meaning, compilation semantics and language-facing glyph bindings.

A structurally valid PATH or geometric Glyph candidate cannot be promoted by HNK-KODE into new ROOT geometry. Conversely, CODEX structural geometry does not automatically assign linguistic meaning.

## Computational reconciliation

Canonical executable direction:

HNK / PT-BR / EN -> Semantic IDs -> Canonical AST -> HOM -> HNK-IR <-> MHCM -> haKodan pre-opcode/execution model -> bytecode/runtime/manifestation

MHCM therefore complements HNK-IR with Mandala addressing, PATH/Glyph projection and related computational representation. haKodan remains the executable compiler/runtime line.

## KODESCRIPT V0

Minimal semantic surface:

world -> entity -> property -> event -> action

The earlier experimental `KODE SOURCE -> AST -> HNK-IR -> RUNTIME WORLD` slice is retained only as provenance/test evidence until equivalent haKodan-native coverage exists. It must not evolve into a parallel runtime.

## Canonical gate

CODEX-HNK/Glyph Genesis structural candidates enter HNK-KODE with ROOT contract/version plus provenance and validation evidence.

HNK-KODE promotion authority applies to linguistic/computational bindings and manifestations, not to independent promotion of source geometry.

Research validity != structural canon != linguistic canon.

## Next work

- machine-readable ROOT contract reference in MHCM artifacts;
- Address/Edge/Path validation against the consumed ROOT version;
- transform registry;
- deterministic codecs;
- round-trip tests;
- candidate/canonical state machine;
- haKodan-native integration coverage replacing the experimental runtime slice.
