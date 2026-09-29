# HNK-LINGUAS Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the recoverable HNK-LINGUAS project corpus into HNK-KODE as an auditable source of truth with explicit provenance and authority states.

**Architecture:** Corpus material is mined by domain and chronology, classified through a provenance/decision registry, then rendered into focused canonical documentation and machine-readable datasets. Existing repository contracts are preserved and reconciled; unresolved contradictions remain explicit instead of being guessed away.

**Tech Stack:** Markdown, JSON/JSON Schema, existing HNK-KODE packages/scripts/tests, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-29-hnk-linguas-consolidation-design.md`

## Global Constraints

- HNK-KODE remains the linguistic/computational language authority.
- No inference may silently become `CANON` or `FROZEN`.
- Preserve `CANDIDATE`, `LEGACY`, `REJECTED`, `CONFLICT` and `GAP` states.
- Preserve provenance and chronology rather than overwriting history.
- Do not conflate 12 fundamental keys, HNK40, 432 MF, 463 ACTIVE and 504 RASTER.
- Integrate with existing repository structures instead of duplicating equivalent contracts.
- GitHub/cloud is the primary execution environment; local tooling is optional.

## Review Focus

- Conflicting historical definitions must remain visible until authoritative resolution.
- Duplicate terminology with changed meaning must preserve version/supersession context.
- Canon datasets must not ingest candidate/rejected material through documentation generation.
- Derived glyph/encoding artifacts must preserve reversible provenance to their source contracts.
- Missing project evidence must remain GAP rather than being reconstructed from general knowledge.

---

### Task 1: Repository and Corpus Inventory

**Files:**
- Create: `docs/provenance/HNK-LINGUAS-CORPUS-INVENTORY.md`
- Create: `data/provenance/source-registry.json`
- Test: existing/new provenance integrity test under `tests/`

**Interfaces:**
- Consumes: Project corpus retrieval and current repository tree.
- Produces: stable source IDs and domain inventory consumed by all later tasks.

- [ ] Mine Project corpus using multiple domain queries and chronology-sensitive retrieval.
- [ ] Inventory current repo documentation, data, specs, packages, scripts and tests.
- [ ] Assign stable source records without interpreting unsupported gaps.
- [ ] Add integrity validation for unique source IDs and required metadata.
- [ ] Verify and commit.

### Task 2: Decision and Authority Registry

**Files:**
- Create: `docs/provenance/CANON-DECISION-MATRIX.md`
- Create: `data/provenance/decision-registry.json`
- Create/modify: provenance schema under `spec/schemas/`
- Test: authority-state validation under `tests/`

**Interfaces:**
- Consumes: Task 1 source IDs.
- Produces: decision IDs, states, supersession/conflict links used by canonical documents/datasets.

- [ ] Extract explicit approvals, rejections, corrections, source locks and supersessions.
- [ ] Classify each recovered decision using the spec state vocabulary.
- [ ] Record conflicts instead of resolving by model preference.
- [ ] Validate that CANON/FROZEN records carry provenance.
- [ ] Verify and commit.

### Task 3: HENUVOKODAN Master Language Documentation

**Files:**
- Create/modify: `docs/language/HENUVOKODAN-MASTER-SPEC.md`
- Create/modify: focused phonology/morphology/grammar docs as required by existing repo conventions.
- Modify/create: lexicon datasets under `data/`.
- Test: lexicon/state/provenance integrity.

**Interfaces:**
- Consumes: Task 2 decision registry.
- Produces: authoritative natural/symbolic language reference.

- [ ] Consolidate identity, fundamental keys/letters and phonological rules.
- [ ] Consolidate approved lexemes and semantic families with provenance.
- [ ] Consolidate grammar and composition rules without filling unsupported gaps.
- [ ] Preserve rejected/watch/legacy lexemes outside active canon.
- [ ] Verify and commit.

### Task 4: HNK40, E4/E5 and Multilingual Mapping History

**Files:**
- Create/modify: `docs/glyphs/HNK40-GENESIS-AND-EVOLUTION.md`
- Create/modify: HNK40/E4/E5 datasets under `data/glyphs/` or existing equivalent.
- Test: cardinality, uniqueness and state/provenance checks.

**Interfaces:**
- Consumes: Tasks 1-3 registries and language identifiers.
- Produces: normalized legacy/genesis layer for Mandala/Glyph Genesis work.

- [ ] Recover HNK40 mapping decisions and multilingual equivalence work.
- [ ] Preserve HNK40 Legacy → E4 → E5 relationships.
- [ ] Separate direct/unique/ambiguous mappings where supported.
- [ ] Validate counts and identifiers against source evidence.
- [ ] Verify and commit.

### Task 5: Mandala-HNK and Glyph Genesis Consolidation

**Files:**
- Create/modify: `docs/architecture/MANDALA-HNK-COMPUTATIONAL-MODEL.md`
- Create/modify: `docs/glyphs/GLYPH-GENESIS.md`
- Modify: existing encoding/path specs and datasets where evidence requires.
- Test: existing codec/path/round-trip/integrity suites plus provenance assertions.

**Interfaces:**
- Consumes: Task 4 genesis layer and Task 2 authority registry.
- Produces: formal relationship among MF/address/path/glyph/encoding layers.

- [ ] Consolidate supported 432/463/504 architecture and RESERVED semantics.
- [ ] Consolidate PATH identity and glyph construction rules.
- [ ] Reconcile existing HNKP/codec/pixel/isopixel/voxel contracts with documentation.
- [ ] Mark speculative computational semantics as CANDIDATE where not proven.
- [ ] Verify and commit.

### Task 6: KODESCRIPT / AST / HNK-IR Architecture

**Files:**
- Create/modify: `docs/kodescript/KODESCRIPT-MASTER-SPEC.md`
- Create/modify: `docs/architecture/HNK-KODE-IR-BOUNDARIES.md`
- Modify/create: grammar/IR schemas only where supported.
- Test: schema/examples/integrity tests.

**Interfaces:**
- Consumes: Task 5 computational model and language identifiers.
- Produces: consolidated computational-language architecture and explicit HNK-VERSE boundary.

- [ ] Recover programming-language decisions and minimal runtime model.
- [ ] Separate implemented contracts from aspirational fullstack architecture.
- [ ] Document TEXT/AST/MANDALA/GLYPH/HNK-IR relationships at their supported authority state.
- [ ] Preserve HNK-VERSE as consumer/runtime rather than semantic authority.
- [ ] Verify and commit.

### Task 7: Acquisition, Cycles and Curriculum

**Files:**
- Create/modify: `docs/acquisition/HNK-KODE-ACQUISITION.md`
- Create/modify: acquisition/cycle datasets under `data/acquisition/` or existing equivalent.
- Test: source-lock and lesson integrity checks.

**Interfaces:**
- Consumes: canonical lexicon/grammar and source registry.
- Produces: consolidated learning/acquisition layer.

- [ ] Recover lesson/cycle structure and source-lock decisions.
- [ ] Consolidate vocabulary/phrase inventories where evidence is complete.
- [ ] Keep incomplete lessons/fields explicit as GAP.
- [ ] Reconcile acquisition datasets with language canon without reverse-promoting curriculum inventions.
- [ ] Verify and commit.

### Task 8: Master Index, History and Conflict Backlog

**Files:**
- Create: `docs/HNK-KODE-MASTER.md`
- Create: `docs/history/HNK-KODE-EVOLUTION.md`
- Create: `docs/provenance/OPEN-CONFLICTS-AND-GAPS.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: Tasks 1-7.
- Produces: human entry point and finite unresolved backlog.

- [ ] Build master navigation and architecture map.
- [ ] Write chronological evolution without rewriting legacy as current canon.
- [ ] Enumerate every unresolved CONFLICT/GAP with decision dependencies.
- [ ] Update README and changelog.
- [ ] Verify and commit.

### Task 9: Whole-Repository Canon Integrity Gate

**Files:**
- Modify/create: tests and CI workflows required by findings.

**Interfaces:**
- Consumes: all consolidated registries/data/docs.
- Produces: reproducible consolidation gate.

- [ ] Add tests preventing unsupported canon promotion and broken provenance links.
- [ ] Run existing repository test/build/integrity commands available in CI.
- [ ] Check deterministic generated artifacts where applicable.
- [ ] Resolve Important/Critical findings or ledger them as explicit blocking conflicts.
- [ ] Commit final gate changes.

### Task 10: Review and PR

**Files:**
- No new product files unless review fixes require them.

**Interfaces:**
- Consumes: complete consolidation branch.
- Produces: reviewable PR tied to #22.

- [ ] Review full diff against design invariants.
- [ ] Verify source/decision coverage and conflict backlog.
- [ ] Open PR referencing #22 with migration summary and verification evidence.
- [ ] Do not merge automatically; preserve human review gate.
