# HENUVOKODAN Visual Canon V1 — Candidate Inventory

Status: `VISUAL_CANDIDATE`
Authority gate: Issue #52

> This inventory records what is visibly asserted by the supplied boards. It does **not** promote generated visual details to canon.

## 1. Evidence classes

| Class | Visual assertion | Initial status |
|---|---|---|
| P01–P10 | Ten sephirotic mother/proto-glyphs | CANDIDATE — reconcile |
| G01–G40 | 40 derived characters / HNK40 matrix | COMPATIBLE AS GENESIS SET; mappings require reconciliation |
| Worlds | Atziluth, Beriah, Yetzirah, Assiah | COMPATIBLE; exact projections require reconciliation |
| Styles | HNK-SIMPLE, HNK-CODEX, HNK-MAGNUM | NEW/CANDIDATE |
| Canvas ISO | Isometric geometric construction canvas | NEW/CANDIDATE |
| HNK-RADIAL | Radial/cabalistic canvas | NEW/CANDIDATE |
| HNK-GLYPH | Glyph construction canvas | NEW/CANDIDATE |
| HNK-SIGIL | Word/sigil composition canvas | NEW/CANDIDATE |
| Color-72 | 12 portals × 6 faces = 72 functional colors | CANDIDATE; semantic role unresolved |
| Ligatures | HE / NU / VO / KO / DAN | CANDIDATE; must be checked against canonical phonology/lexicon |

## 2. P01–P10 inventory

The boards repeatedly associate the following ten proto-glyph identities with the Sephirot:

| ID | Sephirah | Recurrent visual semantic labels | Reconciliation state |
|---|---|---|---|
| P01 | Keter | origem, unidade, vontade / coroa | ID COMPATIBLE; geometry CANDIDATE |
| P02 | Chokhmah | sabedoria, impulso, expansão | ID COMPATIBLE; geometry CANDIDATE |
| P03 | Binah | estrutura, compreensão, forma | ID COMPATIBLE; geometry CANDIDATE |
| P04 | Chesed | misericórdia, expansão, doação | ID COMPATIBLE; geometry CANDIDATE |
| P05 | Gevurah | disciplina, força, limite | ID COMPATIBLE; geometry CANDIDATE |
| P06 | Tiferet | harmonia, beleza, equilíbrio | ID COMPATIBLE; geometry CANDIDATE |
| P07 | Netzach | vitória, movimento, permanência | ID COMPATIBLE; geometry CANDIDATE |
| P08 | Hod | inteligência, organização, reflexão/esplendor | ID COMPATIBLE; geometry CANDIDATE |
| P09 | Yesod | fundamento, conexão, fluxo | ID COMPATIBLE; geometry CANDIDATE |
| P10 | Malkuth | manifestação, realização, terra/reino | ID COMPATIBLE; geometry CANDIDATE |

### Visual conflict warning
The actual P01–P10 drawn forms vary between boards. No stroke geometry is canonical merely because a board labels it Pxx.

## 3. G01–G40 inventory boundary

The boards assert a 10 × 4 matrix generated from ten proto-glyph families across four worlds. This is retained only as a **visual candidate projection of HNK40**.

Canonical architecture takes precedence:

```text
12 fundamental keys/letters
→ HNK40 genesis/validation set
→ 432 MF glyph field (6 × 72)
→ 463 ACTIVE code space (432 + 9 + 22)
→ 504 PHYSICAL slots (463 + 41 RESERVED)
```

Therefore:

```text
HNK40 != complete HENUVOKODAN alphabet
HNK40 != 463 active address space
HNK40 != 432 MF glyph field
```

The visual phoneme assignments shown for G01–G40 are **UNRESOLVED** until checked against the linguistic registry.

## 4. Four-world projection candidate

Boards consistently use:

1. Atziluth
2. Beriah
3. Yetzirah
4. Assiah

A recurrent visual proposal maps one proto-glyph into four manifestations. The existence of the four-world visual projection is compatible with the project vocabulary, but the rule `one proto-glyph × four worlds = four fixed phonetic characters` remains a candidate until source-locked.

## 5. Style invariance candidate

Three rendering levels recur:

- `HNK-SIMPLE` — minimal / learning
- `HNK-CODEX` — canonical/study geometry
- `HNK-MAGNUM` — ritual/art expression

Proposed invariant:

```text
semantic_identity(Simple) == semantic_identity(Codex) == semantic_identity(Magnum)
```

Style may alter ornamentation and construction detail, never the underlying glyph identity or phoneme.

## 6. Canvas candidates

### HNK-ISO
Candidate spatial construction system using position, direction, geometry and world/layer metadata. Several boards depict an `8 × 8 × 8 = 512` cube. This must **not** be equated to the canonical 432/463/504 Mandala architecture without a formal mapping.

### HNK-RADIAL
Candidate radial visualization for cycles, hierarchy, frequency, meaning and totality. It may become a projection/view of the canonical Mandala rather than an independent address space.

### HNK-GLYPH
Candidate construction view for stroke primitives, entry/control/exit points, proportion and transformation.

### HNK-SIGIL
Candidate composition view from sound → syllable/morpheme → word → sigil. Semantic and ritual claims remain project-defined conceptual material, not automatically executable language rules.

## 7. Color-72 candidate

The boards propose:

```text
12 PORTALS × 6 FACES = 72 COLORS
```

This numerical structure is visually recurrent. Exact hue values, frequency claims and semantic assignments are not yet canonical.

## 8. Ligature inventory

Visible principal candidates:

```text
HE
NU
VO
KO
DAN
NUVO
KODAN
HENUVOKODAN
```

The boards are internally inconsistent in some component phonemes and G-number assignments. These forms remain `CANDIDATE` pending linguistic comparison.

## 9. Conflict matrix

| Area | Conflict |
|---|---|
| G01–G40 phonology | Different boards assign different sounds/letters to positions |
| Glyph shapes | Same P/G identity can have different drawn geometry |
| Numbering | Word examples and matrix numbers are not consistently aligned |
| HNK40 scope | Some boards visually imply complete alphabet; architecture defines genesis set |
| ISO counts | 512-point cube does not directly equal 432/463/504 architecture |
| Sephirotic projection | Symbolic labels recur, but derivation rules are not source-locked |
| Colors | 72-count proposal recurs; exact semantics/hues unresolved |
| Ligatures | attractive visual forms, but phonological derivation needs validation |

## 10. Canonical guardrails for the next stage

1. No image-generated phoneme becomes canonical without linguistic evidence.
2. No visual glyph geometry becomes canonical until one geometry is selected/versioned.
3. HNK40 remains a genesis/validation set.
4. 432/463/504 remain distinct domains.
5. A Canvas is a representation/projection unless explicitly promoted to an address-space contract.
6. Simple/Codex/Magnum must preserve identity.
7. Visual and computational HNK-KODE layers must not be silently conflated.
8. Every promoted visual rule receives a machine-readable registry entry and anti-drift test.

## 11. Next gate

`INVENTORY → SOURCE-LOCK G01–G40 → GEOMETRY DECISION → STYLE INVARIANTS → CANVAS MAPPING → VISUAL CANON V1.0`
