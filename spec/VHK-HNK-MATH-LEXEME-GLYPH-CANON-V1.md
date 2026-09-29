# VHK / HNK-MATH Lexeme ↔ Glyph-Sigil Canon V1

**Status:** ARCHITECTURE_CANON / BINDINGS_PENDING  
**Authority:** HNK-KODE  
**Structural authority:** CODEX-HNK `HNK-MANDALA-ROOT-V1@1.0.0`

## Canon rule

Every HNK-KODE lexeme promoted as a canonical haKodan word is simultaneously a canonical HNK-language lexeme and MUST receive exactly one canonical HNK-MATH-derived glyph identity.

PT-BR and EN remain surface aliases and never receive competing glyph identities.

## Authority split

- CODEX-HNK owns Mandala geometry, Atomic-Kodes, topology, ROOT constants and structural provenance.
- HNK-KODE owns linguistic meaning, semantic IDs, namespaces, lexemes, grammar and explicit lexeme↔glyph bindings.
- SIGILKODE-HNK may compile/render a canonical glyph identity into a sigil manifestation, but cannot assign HNK semantics.

## Structural baseline

Consume:
- 12 fundamental HENUVOKODAN keys/letters;
- 432 MF = 6×72;
- 463 ACTIVE = 432 MF + 9 external + 22 center;
- 504 physical slots = 463 active + 41 reserved;
- 109 primitive AKs = 72 SEC + 6 LAY + 9 GRP + 22 R22;
- N=12 HNK-MATH kernel = 2,647,892 render-distinct geometric identities;
- 256 coarse families;
- 11,492 topological families;
- 3,041 radial-angular families.

These counts are structural spaces, not lexicon sizes.

## Glyph identity

Canonical structural identity follows CODEX/MHCM:

```text
GLYPH = { AK_SET, ORDERED_PATH, FIELD_STATE, RELATIONS }
```

Operationally:

```text
GLYPH = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM
```

Bitmap, SVG, color, Unicode/codepoint, BIN/HEX and visual resemblance are projections or correspondences, not canonical glyph identity.

## Glyph and sigil

```text
GLYPH = structural/mathematical identity
SIGIL = canonical visual manifestation of the same glyph
```

A canonical sigil must be deterministically reproducible from glyph identity + renderer version and retain provenance back to the PATH/AK structure.

## Binding pipeline

```text
SEMANTIC_ID
→ HNK_LEXEME
→ LEXEME_CANON_GATE
→ FAMILY-FIRST STRUCTURAL SEARCH
  → coarse
  → topological
  → radialAngular
  → confusionNeighborhood
→ N=12 SIMPLE-PATH CANDIDATE SET
→ HNK40 benchmark/collision gate
→ STRUCTURAL_ELIGIBILITY
→ EXPLICIT_LINGUISTIC_BINDING
→ HUMAN/AUTHORITY GATE
→ CANON_BINDING
→ GLYPH_CANON
→ SIGIL_RENDER
→ CODEPOINT/BIN/HEX projection
```

## Selection constraints

A lexeme's glyph MUST NOT be selected by:
- hash→glyph assignment;
- numerological convenience;
- sequential Unicode/PUA filling;
- color alone;
- visual similarity alone;
- external mystical correspondence alone.

Hashes may be used only for replay/provenance/experimental seed metadata.

Selection must use structural family analysis, legal PATH topology, render-distinctness, confusion/collision testing, explicit linguistic binding and human authority.

## Topology

Current supported edge classes may be consumed only from the versioned CODEX-HNK topology registry. Unfrozen bridges remain unavailable.

For current N=12 KODESCRIPT language experiments, structural family work must respect the HNK-2647892 kernel and its `MF_CG` / `CR_D` participation rules.

## KODESCRIPT language gate

Canonical binding requires the HNK-KODESCRIPT language-eligibility policy:
- explicit linguistic source or author decision;
- provenance;
- promotable namespace;
- phonology/grammar/semantic payload as applicable;
- conflict check;
- human/authority gate;
- tests.

Structural validity alone never assigns meaning.

## Encoding rule

```text
NO CANON_BINDING → NO FINAL CODEPOINT
```

Codepoint is a writing projection assigned after canonical binding. It is not the glyph identity.

## Initial canonical lexeme queue

The following existing canonical HNK lexemes are first in the structural-binding queue:

- AHNUVA — LOVE / AMOR
- EMANU — TRUTH / VERDADE
- HAYA — LIFE / VIDA
- HODERU — WAY / CAMINHO
- KODAN — LOGOS

They are canonical lexemes but do not receive invented PATHs in this specification. Their glyph bindings remain `PENDING_STRUCTURAL_BINDING` until candidate-set analysis + Human Gate.

All other VHK/HNK lexical candidates remain blocked from canonical glyph binding until lexical promotion.

## Sources

- `codex-hnk/contracts/HNK_MANDALA_ROOT_V1.md`
- `codex-hnk/docs/research/HNK-MANDALA-FORENSICS-V0.1-SPEC.md`
- `codex-hnk/docs/research/mandala/final/mandala-topology-registry.v1.json`
- `codex-hnk/docs/research/mandala/final/hnk-kode-mandala-graph-topology.v1.json`
- `HNK-KODE/docs/research/HNK-2647892-MATHEMATICAL-KERNEL.md`
- `HNK-KODE/docs/research/HNK-2647892-FAMILY-CENSUS-V1.md`
- `HNK-KODE/spec/mhcm/glyph.schema.json`
- `HNK-KODE/spec/mhcm/path.schema.json`
- `HNK-KODE/spec/kodescript-language-eligibility.v1.json`
