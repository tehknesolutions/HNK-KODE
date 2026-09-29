# haKodan Morphological Role System v0.8 — Design Specification

**Status:** APPROVED DESIGN / PRE-IMPLEMENTATION
**Date:** 2026-09-29
**Authority:** HNK-KODE / haKodan
**Depends on:** Mora-Kodin v0.7 Phonological Separation

## 1. Intent

Turn the Mora-Kodin lexicon from a collection of coherent words into an learnable computational morphology. A Kodin must be able to expose both its semantic family and its computational role without transferring semantic authority from external reference languages.

The design preserves the existing HNK/PT-BR/EN mixed-source contract, textual↔visual VHK equivalence, Semantic IDs, HOM/HNK-IR lowering, and Creator Gate for canon promotion.

## 2. Architectural decision

Use a hybrid three-part morphology:

`ROOT + VOCALIC PATTERN + ROLE MORPHEME`

- **ROOT** identifies a semantic-family hypothesis.
- **VOCALIC PATTERN** differentiates related concepts/subconcepts inside a family.
- **ROLE MORPHEME** declares a computational/grammatical role.
- **Semantic ID** remains the authoritative semantic identity.

A form's sound or resemblance to Japanese, Semitic, Greek, Esperanto, Enochian, Portuguese, or English never creates HNK meaning.

## 3. Initial role inventory

v0.8 must model at least these eight roles as hypotheses:

1. `ACTION` — executable transformation or operation.
2. `ENTITY` — object/entity/structural noun.
3. `STATE` — condition/state/value-state.
4. `DATA` — data, memory, document, record, value payload.
5. `AGENT` — actor, specialist, AI, role-bearing executor.
6. `OPERATOR` — logical/control/computational operator.
7. `COLLECTION` — list/map/collection/container or aggregate.
8. `TARGET` — manifestation/runtime/output destination such as web/app/game/workflow.

This inventory is a discovery taxonomy, not lexical canon.

## 4. Role morphology constraints

Role morphemes must:

- remain mora-compatible with the current Kodin phonotactics;
- be deterministic and machine-readable;
- not collide with the five frozen canonical lexemes `AHNUVA`, `EMANU`, `HAYA`, `HODERU`, `KODAN`;
- preserve the ability to parse a Kodin into family/root, internal pattern, and role;
- maintain cross-family phonological separation established by v0.7;
- support round-trip textual↔visual representation;
- never override the Semantic ID when morphology and registry metadata disagree.

## 5. Semantic authority and parser rule

The compiler/parser MUST treat morphology as structured metadata and validation evidence, not as the ultimate semantic authority.

Authority order:

`Semantic ID / canonical registry > explicit parsed role metadata > morphological inference > phonetic resemblance`

If morphology conflicts with the registered Semantic ID, the implementation must report a deterministic diagnostic instead of silently changing meaning.

## 6. Multilingual source contract

A source program may use HNK, PT-BR, EN, or a mix. PT-BR aliases may contain accents and `ç` or normalized equivalents without them.

All accepted aliases lower to the same Semantic ID before role-aware AST/HOM/HNK-IR processing.

Example conceptual equivalence:

`CRIAR / CREATE / <Kodin candidate>` → `Semantic ID: CREATE` → `Role: ACTION`

The exact v0.8 Kodin/morpheme forms remain discovery output until Creator approval.

## 7. Visual block contract

Every role must have a machine-readable block category so visual VHK can represent the same construct as textual source.

A visual block stores at minimum:

- `semanticId`
- `role`
- `familyId`
- `surfaceLanguage`
- `surfaceForm`
- arguments/children appropriate to the role

Text→block→text round trips must preserve Semantic ID and role even when the display language changes.

## 8. Lowering contract

The role system participates in the pipeline:

`SOURCE (HNK/PT-BR/EN/mixed) → alias normalization → Semantic ID → role-aware AST → HOM → HNK-IR → target adapters`

Targets may include documentation, prompt, image/mockup/wireframe specifications, PDD/GDD, web artifacts, game artifacts, bytecode/native/machine-oriented targets as supported by later compiler stages. v0.8 itself only establishes the role metadata contract; it does not promise every target backend.

## 9. Discovery generation

For each of the 122 v0.7 provisional concepts, v0.8 must:

1. assign exactly one primary role from the eight-role inventory;
2. retain its v0.7 family/root hypothesis;
3. generate role-aware candidate morphology without modifying the five frozen canonical lexemes;
4. score morphology regularity, family coherence, role readability, compactness, and phonological separation;
5. preserve all outputs as `DISCOVERY_CANDIDATE`;
6. produce explicit conflicts/WATCH records rather than silently forcing weak assignments.

No lexical, root, role-morpheme, or glyph promotion occurs automatically.

## 10. Invariants

The implementation must prove:

- 122/122 provisional concepts receive one primary role;
- exactly eight role categories exist in this gate;
- all selected forms are unique;
- no v0.8 output becomes canon automatically;
- frozen canonical lexemes are not regenerated or overwritten;
- Semantic ID remains unchanged through alias normalization and role annotation;
- role inference disagreement is diagnosable;
- textual↔visual metadata can round-trip without losing Semantic ID or role;
- v0.7 phonological-separation thresholds are not silently regressed; any regression becomes an explicit WATCH/FAIL.

## 11. Persistence artifacts

Implementation should add versioned v0.8 data/report/runtime-contract/test artifacts under the existing `data/lexicon`, `docs/language`, and `packages/hakodan` structure, then update the project snapshot and HNK repository synchronization manifest.

## 12. Non-goals

v0.8 does not:

- canonize the 122 words;
- canonize the 26 v0.6 roots;
- canonize role morphemes without Creator Gate;
- generate final HNK glyph-sigils;
- replace Semantic IDs with phonetic inference;
- implement every compiler backend;
- redefine CODEX-HNK structural authority or SIGILKODE-HNK rendering authority.

## 13. Success criterion

A developer or visual-block editor should be able to inspect a v0.8 candidate and deterministically know its registered Semantic ID, semantic family, primary computational role, surface-language alias, and role-aware lowering metadata—while all new lexical/morphological forms remain explicitly non-canonical until Creator approval.
