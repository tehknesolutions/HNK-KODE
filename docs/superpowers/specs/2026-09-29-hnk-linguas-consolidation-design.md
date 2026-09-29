# HNK-LINGUAS → HNK-KODE Consolidation Design

Status: APPROVED FOR EXECUTION (A.S. 2026-09-29)
Tracking: #22

## Intent

Transform the complete recoverable HNK-LINGUAS project corpus into an auditable, versioned and internally coherent HNK-KODE source of truth. This is not a chat dump. The repository must preserve what was decided, where it came from, its current authority and its historical evolution.

## Authority Model

HNK-KODE is the linguistic/computational language authority for HENUVOKODAN and KODESCRIPT.

CODEX-HNK may host research, experiments, structural/mathematical proofs and derived datasets, but a linguistic promotion becomes authoritative only when represented in HNK-KODE.

HNK-VERSE is a consumer/runtime target and must not silently redefine HNK-KODE semantics.

## Evidence States

Every recovered proposition or artifact is assigned one of:

- `FROZEN`: explicitly approved and currently authoritative.
- `CANON`: authoritative current material not requiring a separate frozen gate.
- `CANDIDATE`: proposed but not promoted.
- `LEGACY`: historically valid or previously used, now superseded.
- `REJECTED`: explicitly rejected.
- `CONFLICT`: incompatible sources without sufficient authority to reconcile automatically.
- `GAP`: referenced but not sufficiently recoverable/confirmed.

No model inference is silently promoted to CANON/FROZEN.

## Consolidation Layers

### 1. Identity and Governance

Define HNK-KODE, HENUVOKODAN, KODESCRIPT, authority boundaries, terminology, versioning and promotion rules.

### 2. Natural/Symbolic Language

Consolidate fundamental letters/keys, phonology, morphology, lexicon, semantic families, grammar, sacred-name conventions and multilingual mappings.

Known current anchors include the HENUVOKODAN fundamental layer and approved lexemes such as AHNUVA, EMANU, HAYA, HODERU and KODAN; every item still requires provenance/state registration rather than memory-only authority.

### 3. Glyph System

Preserve the distinction between the fundamental phonological/symbolic layer, HNK40 genesis/validation material, E4/E5 projections, Mandala addressing and generated PATH/gliph structures.

The recovered architecture must not collapse `12 fundamental keys`, `40 HNK40`, `432 MF`, `463 ACTIVE` and `504 RASTER` into one cardinality.

### 4. Mandala-HNK Computational Model

Treat the recovered Mandala model as a candidate/formalized computational substrate where supported by sources:

- 432 MF geometric field;
- 463 active address/code space;
- 504 physical raster including reserved capacity;
- PATH-based glyph construction;
- reversible addressing/serialization where existing contracts prove it.

Do not assign arbitrary opcode/type/semantic meanings to cells merely to complete a numerological pattern.

### 5. KODESCRIPT / Programming Language

Consolidate the computational language separately from, but interoperably with, the linguistic/spiritual language. Preserve the architectural direction toward textual/structural/glyphic representations and AST/HNK-IR, while distinguishing implemented contracts from design hypotheses.

### 6. Acquisition and Curriculum

Consolidate lessons/cycles, vocabulary, phrase inventories, acquisition datasets and SimpleWay/HNK language-learning relationships only where the HNK-LINGUAS corpus supports them. Preserve source locks and explicit gaps.

### 7. Provenance and History

Maintain a machine-readable registry mapping every canonical or candidate unit to recoverable sources, decisions and supersession relationships. Historical variants are retained instead of overwritten.

## Repository Shape

Target documentation/data organization:

```text
docs/
  canon/
  architecture/
  language/
  glyphs/
  kodescript/
  acquisition/
  research/
  history/
  provenance/
spec/
  schemas/
  encoding/
  grammar/
  ir/
data/
  lexicon/
  glyphs/
  acquisition/
  provenance/
tests/
```

Existing repository conventions take precedence where equivalent directories/contracts already exist; consolidation should integrate rather than duplicate.

## Migration Strategy

1. Inventory the existing HNK-KODE repository.
2. Mine the HNK-LINGUAS Project corpus by semantic domain and chronology.
3. Build a provenance/decision matrix.
4. Reconcile exact duplicates and explicit supersessions automatically.
5. Preserve unresolved contradictions as CONFLICT.
6. Generate master documentation by domain.
7. Normalize machine-readable data only from supported propositions.
8. Add integrity checks for states, identifiers, provenance and forbidden silent promotion.
9. Review changes through PR before main.

## Canon Safety Invariants

1. Every FROZEN/CANON item introduced by consolidation has recoverable provenance.
2. CANDIDATE never becomes CANON solely because a generated document references it.
3. REJECTED material cannot appear in active canonical datasets without an explicit historical marker.
4. LEGACY material remains discoverable and points to its successor when known.
5. CONFLICT remains unresolved until an authoritative human decision or stronger source resolves it.
6. GAP is never filled by model invention.
7. Derived computational artifacts identify their source contracts and derivation version.

## Definition of Done

The consolidation is complete when a reader or program can determine:

1. what HNK-KODE currently is;
2. which language/glyph/computational constructs are authoritative;
3. which constructs are experimental, legacy, rejected, conflicting or missing;
4. the provenance and evolution of authoritative decisions;
5. how natural-language HENUVOKODAN, glyph architecture, Mandala-HNK and KODESCRIPT relate without being conflated;
6. which schemas/tests enforce those boundaries;
7. what remains unresolved in a finite backlog.
