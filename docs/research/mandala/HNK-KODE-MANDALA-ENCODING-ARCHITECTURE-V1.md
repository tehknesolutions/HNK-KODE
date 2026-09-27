# HNK-KODE × MANDALA — Encoding Architecture V1

Provenance: imported from `tehknesolutions/codex-hnk`, branch `research/hnk-kode-e5-render-distinct`, original path `docs/research/mandala/final/HNK-KODE-MANDALA-ENCODING-ARCHITECTURE-V1.md`.

Status: **CANDIDATE ARCHITECTURE / HUMAN GATE REQUIRED**

## 1. Authority boundary

This document maps the measured Mandala Computable V1 geometry into a candidate HNK-KODE encoding architecture. It does **not** assign semantic, phonological, sacred, lexical, or canonical meaning to individual addresses or generated glyphs.

The source structural model remains authoritative for geometry. HNK-KODE remains authoritative for linguistic meaning.

## 2. Structural constants

The Mandala Computable V1 supports:

- 72 angular sectors, 5° each.
- 6 sectorized layers.
- 432 regular sector-layer fields (`6 × 72`).
- 9 choir/sefirah outer cells.
- 441 outer-layout blocks (`432 + 9`).
- 22 central Rose fields (`3 + 7 + 12`).
- 463 major addressable-field candidates (`441 + 22`).
- hierarchical central core excluded from the 463 count pending governance/sub-addressing.

Important: **463 is a major address-space candidate, not the frozen canonical AK count.**

## 3. Address namespaces

### MF — Mandala Field
`MF:L{01..06}:S{01..72}` — cardinality **432**.

### CG — Choir Group
`CG:{01..09}` — cardinality **9**. Each CG spans eight angular sectors.

### CR — Central Rose
- `CR:T:{01..03}` — triad
- `CR:H:{01..07}` — heptad
- `CR:D:{01..12}` — dodecad

Cardinality: **22**. Exact letter/petal rotation remains unresolved and MUST NOT be inferred by this encoding layer.

### HC — Hierarchical Core
Reserved namespace `HC:*`; **UNCOUNTED / NON-ADDRESSABLE IN V1**.

## 4. Major address-space cardinality

```text
MF = 6 × 72 = 432
CG = 9
CR = 3 + 7 + 12 = 22
MAJOR = 432 + 9 + 22 = 463
```

`HC` is deliberately excluded.

## 5. Glyph model

A Mandala address is **not automatically a glyph**.

```text
GLYPH := START_ADDRESS + ORDERED_PATH + EDGE_SEQUENCE + TRANSFORM_PROFILE
```

Therefore `463 addresses ≠ 463 letters` and `463 addresses ≠ 463 words`.

## 6. HNK40 role

HNK40 remains the **Genesis benchmark family**, validating deterministic PATH generation, structural uniqueness, edge-distance behavior, visual distinguishability, raster robustness, HNKP transport/integrity and Human Gate procedures. HNK40 MUST NOT be interpreted as the complete alphabet or complete glyph inventory.

## 7. Linguistic layering

```text
HENUVOKODAN / HNK-KODE
        ↓
linguistic + semantic authority
        ↓
lexeme / grammar / phonology
        ↓
glyph binding layer
        ↓
PATH / edge sequence
        ↓
463-address Mandala substrate
        ↓
source-measured geometry
```

Existing HNK-KODE letters, sacred-name rules and lexemes are not modified by this architecture.

## 8. Transport rule

Existing HNKP transport proves ordered-path serialization over MF nodes. V1 expansion SHOULD extend namespace encoding to CG and CR without breaking existing MF packet decoding.

Compatibility: `existing MF-only HNKP packet → same decoded PATH after V1 extension`.

No HC transport namespace is authorized until HC governance closes.

## 9. Governance states

Every address/glyph binding MUST expose one of:

- `STRUCTURAL_ONLY`
- `HNK_CANDIDATE`
- `HUMAN_REVIEW`
- `HNK_CANON`
- `RESERVED`

Geometry alone MUST NOT promote a glyph to `HNK_CANON`.

## 10. V1 invariants

1. MF cardinality = 432.
2. CG cardinality = 9.
3. CR cardinality = 22.
4. Major candidate address space = 463.
5. HC excluded from 463.
6. 72-sector angular resolution preserved.
7. Existing HNK40 candidates remain candidates.
8. No automatic semantic assignment.
9. No forced 1:1 address→glyph mapping.
10. Human Gate remains mandatory for canonical promotion.

## 11. Gates

E1 Address Registry → E2 Graph Topology → E3 HNKP Namespace Extension → E4 Genesis Projection → E5 Glyph-Space Census → E6 Linguistic Binding Gate.

Only after E1–E5 may HNK-KODE semantic/phonological bindings be proposed for Human Gate review.

## 12. Decision

**463 is adopted in this document as the candidate major Mandala address-space cardinality for HNK-KODE engineering.** It is not declared the canonical AK count; the source model leaves `canonicalAKCount = NOT_YET_FROZEN` and excludes the hierarchical core pending a scope decision.
