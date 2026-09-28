# HNK-2647892 Mathematical Kernel

Status: RESEARCH BASELINE / NON-CANONICAL SEMANTICS
Date: 2026-09-28
Authority: HNK-KODE research layer

## Final N=12 result

The current verified mathematical baseline for the N=12 geometric identity space is:

**2,647,892 render-distinct geometric identities.**

This number is not a word count, vocabulary size, glyph count, or semantic inventory. It is a structural/geometric state-space result and must remain separate from linguistic meaning until explicit language rules are proven or canonically defined.

## Enumeration funnel

- Raw walks: 7,289,096,672
- Simple paths: 95,284,518
- Reversal-equivalence classes: 47,642,259
- Geometric classes: 2,647,892
- Render-distinct classes: 2,647,892

Observed collision result for the final representation: 0 coordinate/segment collisions; vertex/edge injectivity PASS.

## Independent symmetry derivation

A second derivation uses Burnside over the MF+CG automorphism group D9 (order 18):

- non-identity rotations: 0 fixed classes
- each of the 9 reflections: 2,199 fixed classes
- MF+CG quotient result: 2,647,891 classes
- CR:D/C12 contribution: 1
- total: **2,647,892**

The agreement between enumeration and symmetry quotient is the core mathematical cross-check for this baseline.

## Structural context

Mandala V1 distinguishes:

- 432 MF external positions = 6 × 72
- 463 active structural addresses in the broader address model
- 504 physical slots = 463 ACTIVE + 41 RESERVED
- 109 atomic keys = 72 SEC + 6 LAY + 9 GRP + 22 R22

Do not conflate the 463-address structural model with the 2,647,892 N=12 geometric identity space.

## Identity model

Working structural model:

`GLYPH = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM`

Encoding is authoritative only when lossless. Otherwise the representation is RENDER_ONLY or a derived research projection.

## Language/KODESCRIPT boundary

The 2,647,892 states are candidate structural identities. They do not automatically become words.

The next research funnel is:

`GEOMETRIC_IDENTITY -> KODESCRIPT_SIGNATURE -> STRUCTURAL_FAMILY -> LANGUAGE_ELIGIBILITY -> MORPHEME/ROOT CANDIDATE -> PHONOLOGICAL FORM -> SEMANTIC ASSIGNMENT -> ACQUISITION TARGET`

Required counts for future releases:

1. theoretical geometric space;
2. structurally valid/encodable space;
3. linguistically eligible space;
4. canonical lexical inventory;
5. acquisition-ready inventory.

These counts must never be silently substituted for one another.

## Computational architecture

Target closed loop:

`TEXT <-> AST <-> MANDALA <-> GLYPH <-> HNK-IR`

The HNK-KODESCRIPT engine should expose deterministic structural operations such as encode/decode, validate, geometric signature, family classification, neighborhood/distance, generation and acquisition targeting without inventing semantics.

## Repository rule

HNK-KODE is the source of truth for HNK language/KODESCRIPT documentation and code. CODEX-HNK may hold mathematical proofs, experiments and mirrored provenance. GitHub is the persistent authority; local workspaces are disposable executors and must not be required to recover the project.
