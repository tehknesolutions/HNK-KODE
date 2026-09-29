# haKodan / HNK-KODE — Project State Snapshot 2026-09-29

**Status:** AUTHORITATIVE PROJECT SNAPSHOT  
**Repository authority:** `tehknesolutions/HNK-KODE`  
**Purpose:** persist the definitions consolidated in the HNK CODEX project/chat so project recovery never depends on chat memory or temporary artifacts.

## 1. Authority map

- **HNK-KODE** — source of truth for HNK language, computational language, haKodan semantics, grammar, lexical bindings and runtime/compiler contracts.
- **CODEX-HNK** — authority for Mandala/HNK-MATH structural geometry, topology, ROOT contracts, AK/PATH structure and mathematical provenance.
- **SIGILKODE-HNK** — rendering/manifestation consumer; it must not invent HNK language semantics.
- **HNK-VERSE** — world/experience consumer.
- **cubo-hnk** and **simpleway-hnk** — consumers/integration surfaces unless a local contract explicitly grants another authority.

## 2. Names

- **HNK-KODE / HENUVOKODAN** = HNK language + computational language.
- **haKodan** = framework/runtime/SDK/compiler/manifestation engine implementing HNK-KODE.
- **HNK-KODE Studio** = authoring IDE.
- **VHK / vibeHaKodin** = high-level directive/visual authoring layer above the shared semantic model.
- **Kodin** = HNK/haKodan lexical unit used by the authoring/programming language.

## 3. Core semantic pipeline

```text
INTENT
  ↓
VHK / HNK-KODE SURFACE
  ↓
SEMANTIC IDS
  ↓
CANONICAL AST
  ↓
HOM
  ↓
HNK-IR
  ↓
haKodan VM / TARGET BACKEND
  ↓
ARTIFACT / BYTECODE / NATIVE TARGET
```

Text, blocks and glyphs are authoring surfaces over the same semantic tree; they are not separate languages.

## 4. Language surfaces

First-class surfaces:

```text
HNK-KODE
PT-BR
EN
```

VHK may mix the three inside the same source when every token resolves unambiguously to a Semantic ID.

PT-BR accepts both orthographic and ASCII-normalized spelling:

```text
ação == acao
condição == condicao
função == funcao
não == nao
conexão == conexao
```

The original spelling must be preserved for editing/display. Normalization is language-specific and must not be blindly applied to HNK-KODE.

**Normalization != translation.**

## 5. Fail-closed language governance

- Geometry never assigns language meaning.
- An unresolved HNK lexeme is never guessed by AI/compiler.
- Unknown surface => explicit error.
- HNK programming/profile semantics remain fail-closed wherever required lexemes are unresolved.
- PT-BR/EN aliases do not create independent semantic identities.

## 6. VHK visual/textual identity

VHK supports a textual and a typed-block representation over the same AST/HOM.

Canonical block families:
1. DECLARATION
2. FUNCTION
3. LOGIC
4. DATA
5. RELATION
6. EVENT
7. MANIFESTATION
8. AI/VIBE

A block carries typed inputs/outputs, scope, attributes, children, relations, payload and metadata.

Ambiguous deterministic structure must fail with `AMBIGUOUS_STRUCTURE`; AI must not silently choose program semantics.

## 7. HNK-MATH / Mandala integration

Structural baseline consumed from CODEX-HNK:

- 12 fundamental keys/letters.
- 432 MF = 72 sectors × 6 layers.
- 463 active structural addresses.
- 504 physical slots = 463 active + 41 reserved.
- 109 primitive Atomic-Kodes in the current structural registry.
- N=12 verified render-distinct geometric identity space: 2,647,892.
- 256 coarse families.
- 11,492 topological families.
- 3,041 radial-angular families.

HNK40 remains a Genesis/regression benchmark, not the total language capacity.

Canonical structural identity principle:

```text
GLYPH = { AK_SET, ORDERED_PATH, FIELD_STATE, RELATIONS }
```

Operational MHCM form:

```text
GLYPH = START_CELL + PATH + EDGE_SEQUENCE + TRANSFORM
```

Bitmap, SVG, color, binary, HEX and codepoint are projections; they do not define glyph identity.

## 8. Lexeme ↔ glyph-sigil rule

Every HNK-KODE lexeme promoted to canonical haKodan/HNK language must have a unique HNK glyph-sigil identity derived through the HNK-MATH/Mandala structural gate.

```text
SEMANTIC ID
  ↓
HNK LEXEME
  ↓
EXPLICIT CANON BINDING
  ↓
HNK-MATH PATH
  ↓
GLYPH
  ↓
SIGIL RENDER
  ↓
CODEPOINT / BIN / HEX
```

Codepoints are technical projections only and carry no automatic numerological/semantic authority.

## 9. First five canonical lexical glyphs

The following bindings are canonical and already frozen in `data/canon/hnk-lexical-glyph-registry.v1.json`:

- AHNUVA = AMOR / LOVE → HNK-LG-0001 → U+E100
- EMANU = VERDADE / TRUTH → HNK-LG-0002 → U+E101
- HAYA = VIDA / LIFE → HNK-LG-0003 → U+E102
- HODERU = CAMINHO / WAY → HNK-LG-0004 → U+E103
- KODAN = LOGOS → HNK-LG-0005 → U+E104

These five preserve HNK identity and must not be reinterpreted from their ending/syllable patterns.

## 10. Current Kodin lexicon

The project currently has a 127-concept working registry:

- 5 CANON
- 122 PROVISIONAL / discovery-only

The complete datasets are persisted with this snapshot:

- `data/lexicon/VHK_HNK_lexical_discovery_tripla_v0.1.json`
- `data/lexicon/VHK_HNK_lexical_shortlist_v0.2.json`
- `data/lexicon/haKodan_KODINS_127_registry_v1.csv`
- `docs/language/haKodan_KODINS_127_registry_v1.md`

Provisional lexical forms do **not** become HNK canon simply by being selected in discovery.

## 11. Mora-Kodin redesign direction

The 122 provisional Kodins enter a new phonological/morphological discovery pass before canon.

Design influences are principles, not copied vocabulary:

- Japanese-like moraic/syllabic rhythm for pronounceability;
- Semitic root/pattern organization for semantic families;
- Greek-style productive stem/derivation discipline;
- Esperanto-like regular derivational morphology;
- Enochian influence limited to optional archaic/ritual phonetic texture, never semantic authority.

Preferred phonotactic direction:

```text
V
CV
CV.N
CV.CV
CV.CV.CV
V.CV.CV
```

The objective is a recognizably HNK system whose words can be decomposed, learned and recombined.

Examples such as `KADA`, `MAVU`, `OKU`, `ENA`, `AGENA` remain **DISCOVERY_CANDIDATE**, not canon.

The five existing canonical words are exempt from retroactive morphology.

## 12. Universal target ladder

A Kodin resolves to target-independent semantics; it is not a string substitution into JavaScript.

```text
KODIN
 ↓
SEMANTIC ID
 ↓
AST
 ↓
HOM
 ↓
HNK-IR
 ↓
BACKEND
 ├─ TypeScript / JavaScript
 ├─ Python
 ├─ C# / .NET
 ├─ C / C++
 ├─ Rust
 ├─ Java / Kotlin
 ├─ Swift
 ├─ PHP
 ├─ WebAssembly
 ├─ LLVM IR
 ├─ haKodan bytecode
 ├─ Assembly / ISA
 └─ native machine code
```

The technically correct promise is: **any language/ISA for which a validated backend exists**. Native binaries are architecture/platform-specific; there is no single universal machine binary.

Provenance/source maps should preserve semantic genealogy down the lowering chain even when reverse compilation is not lossless.

## 13. High-intensity glyph production policy

Use large candidate batches without relaxing authority:

```text
large structural pool
→ symmetry/reversal dedupe
→ family classification
→ HNK40/confusion checks
→ visual/raster legibility
→ shortlist
→ Creator/Human Gate
→ CANON_BINDING
```

Mass generation never equals mass canonization.

## 14. Recorded v1.7.x sequence

- v1.7.1 — PT-BR diacritic normalization rule.
- v1.7.2 — multilingual Language Registry concept.
- v1.7.3 — lexer/glyph-canon integration direction.
- v1.7.4 — HNK-MATH lexeme↔glyph canon gate.
- v1.7.5 — mass structural candidate batch.
- v1.7.6 — legibility/confusion reduction.
- v1.7.7 — binding-readiness reduction to 15.
- v1.7.8 — perceptual separation + Recommended-A set.
- v1.7.9 — Creator-approved first five CANON_BINDING records + runtime resolver.

## 15. Experimental prototype warning

Several chat-generated v1.0–v1.7 TypeScript prototype ZIPs were research artifacts, not authoritative integrated runtime releases. Known interface mismatches existed between parser, type checker, HOM operation naming and IR lowering. This repository's maintained `packages/hakodan` code and specs supersede those temporary ZIPs unless a prototype is explicitly migrated and tested.

## 16. Current open gates

1. Redesign 122 provisional Kodins with Mora-Kodin rules.
2. Generate triplicate candidates per concept and run collision/phonology/morphology/HNK-MATH filters.
3. Promote only through explicit Creator gate.
4. Integrate mixed-language VHK token resolution into maintained parser/registry.
5. Continue VM capability/security + source/provenance mapping gates.
6. Expand target adapters and prove source-map/provenance through lowering.
7. Generate glyph-sigils for every newly canonized HNK word through HNK-MATH.

## 17. Persistence rule

**GitHub is the persistent source of truth. Chat artifacts are working evidence, never the only copy of a project decision.**

Every future approved HNK/haKodan definition should be committed to the appropriate HNK repository in the same work cycle.

## 18. Mora-Kodin production gates added after initial snapshot

The Mora-Kodin direction has now been executed as reproducible discovery data.

### v0.4 — Mass Discovery
- 122 provisional concepts processed.
- 3 candidates per concept.
- 366 unique candidates.
- 0 canon promotions.
- deterministic batch contract + tests committed.

### v0.5 — Compact Mora Gate
- same 122 concepts and 366 candidates reworked/re-ranked for stronger moraic economy.
- 122 unique shortlist winners.
- 82/122 winners have 5 letters or fewer.
- average winner length reduced from 6.00 to 4.67.
- 0 canon promotions.
- examples currently include:
  - CREATE → KADA
  - DEFINE → DENA
  - WORLD → MAVU
  - OBJECT → OKU
  - MEMORY → MENO
  - CAPABILITY → KAPU

All v0.4/v0.5 words remain `DISCOVERY_CANDIDATE`; this section records production state, not lexical canon.

Persisted files:
- `data/lexicon/haKodan-mora-kodin-candidates-v0.4.json`
- `data/lexicon/haKodan-mora-kodin-shortlist-v0.4.csv`
- `docs/language/HAKODAN-MORA-KODIN-MASS-DISCOVERY-v0.4.md`
- `data/lexicon/haKodan-mora-kodin-compact-v0.5.json`
- `data/lexicon/haKodan-mora-kodin-shortlist-v0.5.csv`
- `docs/language/HAKODAN-MORA-KODIN-COMPACT-GATE-v0.5.md`

## 19. Mora-Kodin v0.6–v0.7 semantic-family and phonological gates

### v0.6 — Root Family & Semantic Coherence
- 122 provisional concepts assigned to **26 semantic root-family hypotheses**.
- 366 candidates compared.
- 99/122 winners became family-driven forms.
- average winner length reached 4.21.
- 0 canon promotions.

Example discovery family:

```text
K-D  creation/mutation hypothesis
CREATE      KADA
DEFINE      KEDU
ALTER       KIDI
REMOVE      KODE
TRANSFORM   KUDO
```

These root families are hypotheses, not lexical/morphological canon.

### v0.7 — Phonological Separation
The compact v0.6 system created many cross-family near-collisions. v0.7 globally reselected among the existing three candidates per concept.

Measured result:
- cross-family pairs with similarity >= 0.75: **127 → 0**
- cross-family pairs with similarity >= 0.67: **127 → 0**
- cross-family pairs with similarity >= 0.60: **130 → 3**
- average selected length: **4.21 → 4.92**
- selections changed: **64**
- selected forms unique: **122/122**
- 0 canon promotions.

This gate establishes a project preference for **family coherence + phonological separability**, not maximal compactness alone.

Persisted files:
- `data/lexicon/haKodan-mora-kodin-root-families-v0.6.json`
- `data/lexicon/haKodan-mora-kodin-root-shortlist-v0.6.csv`
- `docs/language/HAKODAN-MORA-KODIN-ROOT-FAMILIES-v0.6.md`
- `data/lexicon/haKodan-mora-kodin-phonological-v0.7.json`
- `data/lexicon/haKodan-mora-kodin-phonological-shortlist-v0.7.csv`
- `docs/language/HAKODAN-MORA-KODIN-PHONOLOGICAL-GATE-v0.7.md`


## 20. Morphological Role System v0.8

Implemented on `feat/hakodan-morphology-v08`: 122 concepts and 8 computational roles, role-aware candidate morphology, Semantic-ID-first validation, HNK/PT-BR/EN alias resolution, and textual/visual role-block metadata.

All new morphology remains `DISCOVERY_NON_CANONICAL`; canon promotions: 0.

Verification: 20/20 v0.8 tests and 15/15 Mora-Kodin v0.4-v0.7 regression tests PASS.