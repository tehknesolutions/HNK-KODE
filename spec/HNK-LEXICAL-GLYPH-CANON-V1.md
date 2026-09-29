# HNK Lexical Glyph Canon V1

**Status:** HNK_CANON  
**Decision:** Creator approval via `A.S.` on 2026-09-29.

This release promotes the five v1.7.8 Recommended-A structural identities to canonical lexical glyph bindings.

| HNK lexeme | PT-BR | EN | Glyph | Mathematical identity | Sigil | PUA |
|---|---|---|---|---|---|---|
| AHNUVA | AMOR | LOVE | HNK-LG-0001 | HMATH-N12-E533006473117A1B6F91 | HNK-LS-0001 | U+E100 |
| EMANU | VERDADE | TRUTH | HNK-LG-0002 | HMATH-N12-45E7FA30BFB516CB279F | HNK-LS-0002 | U+E101 |
| HAYA | VIDA | LIFE | HNK-LG-0003 | HMATH-N12-2887530BADEAC3A6374E | HNK-LS-0003 | U+E102 |
| HODERU | CAMINHO | WAY | HNK-LG-0004 | HMATH-N12-0431D17150B7E78A525F | HNK-LS-0004 | U+E103 |
| KODAN | LOGOS | LOGOS | HNK-LG-0005 | HMATH-N12-83FAB36561ABF9BAB67A | HNK-LS-0005 | U+E104 |

## Authority chain

```text
HNK LEXEME CANON
  -> CREATOR APPROVAL
  -> HNK-MATH N=12 PATH
  -> CANON_BINDING
  -> CANONICAL GLYPH
  -> CANONICAL SIGIL
  -> PUA/BIN/HEX projections
```

The geometry did not assign the semantics. Structural candidates were generated and tested first; the explicit Creator decision binds each already-canonical lexeme to its approved structural identity.

## Freeze

Canonical identity is the HNK-MATH PATH/structural record. SVG is a canonical render manifestation tied by SHA-256. PUA/BIN/HEX are technical projections, not semantic identity.

Changing PATH, glyph ID, sigil ID, codepoint or canonical SVG digest requires explicit supersession/migration.