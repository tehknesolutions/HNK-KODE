# haKodan Morphological Role System v0.8 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a deterministic, non-canonical morphological-role layer to all 122 provisional Mora-Kodins while preserving Semantic IDs, root families, multilingual aliases, visual-block equivalence, and v0.7 separation safeguards.

**Architecture:** Extend the existing versioned Mora-Kodin discovery pipeline with a role registry and role-aware candidate dataset. Semantic IDs remain authoritative; morphology annotates and validates them. Runtime helpers expose role lookup/validation and block metadata without canon promotion.

**Tech Stack:** Node.js ESM, JSON/CSV datasets, `node:test`, existing `packages/hakodan` conventions.

**Spec:** `docs/superpowers/specs/2026-09-29-hakodan-morphological-role-system-v0.8-design.md`

## Global Constraints

- Source languages: HNK, PT-BR, EN, including mixed source.
- PT-BR accepts accents/`ç` and normalized equivalents.
- Exactly eight discovery roles: `ACTION`, `ENTITY`, `STATE`, `DATA`, `AGENT`, `OPERATOR`, `COLLECTION`, `TARGET`.
- Semantic ID is more authoritative than morphology.
- `AHNUVA`, `EMANU`, `HAYA`, `HODERU`, `KODAN` remain frozen.
- All v0.8 generated forms and morphemes remain non-canonical until Creator Gate.
- Preserve v0.7 phonological separation or emit explicit WATCH/FAIL evidence.

## Review Focus

- A PT-BR alias with accents and its accentless alias must resolve to the same Semantic ID and role.
- A mixed HNK/PT-BR/EN source must not change role semantics after normalization.
- A morphology/registry disagreement must produce a diagnostic, never silently rewrite Semantic ID.
- Visual block round-trip must preserve `semanticId` and `role` across display-language changes.
- A generated form that regresses v0.7 separation must be WATCH/FAIL rather than silently accepted.

---

### Task 1: Role Registry and 122-Concept Classification

**Files:**
- Create: `data/lexicon/haKodan-morphological-roles-v0.8.json`
- Create: `packages/hakodan/src/morphological-roles-v0.8.mjs`
- Test: `packages/hakodan/test/morphological-roles-v0.8.test.mjs`

**Interfaces:**
- Consumes: v0.7 `selected[].semanticId`, `familyId`, `familyRoot`, `selected`.
- Produces: `ROLE_IDS`, `getRoleForSemanticId(semanticId)`, `validateRoleAssignment(record)`.

- [ ] **Step 1: Write failing tests** asserting exactly eight role IDs, exactly 122 assignments, one primary role per Semantic ID, and zero canonical promotions.
- [ ] **Step 2: Run** `node --test packages/hakodan/test/morphological-roles-v0.8.test.mjs` and verify FAIL because the module/data do not exist.
- [ ] **Step 3: Create the role dataset** mapping every v0.7 Semantic ID to one of the eight roles while retaining `familyId`, `familyRoot`, and v0.7 surface form.
- [ ] **Step 4: Implement** `getRoleForSemanticId(semanticId: string)` and `validateRoleAssignment(record)` with deterministic unknown-ID diagnostics.
- [ ] **Step 5: Add review-focus tests** for stable Semantic ID/role lookup and malformed/unknown assignments.
- [ ] **Step 6: Run the test file** and verify PASS.
- [ ] **Step 7: Commit** with `feat(kodin): classify v0.8 morphological roles`.

### Task 2: Role Morpheme Discovery and Candidate Scoring

**Files:**
- Create: `data/lexicon/haKodan-morphological-candidates-v0.8.json`
- Create: `data/lexicon/haKodan-morphological-shortlist-v0.8.csv`
- Create: `packages/hakodan/src/morphological-generator-v0.8.mjs`
- Test: `packages/hakodan/test/morphological-generator-v0.8.test.mjs`

**Interfaces:**
- Consumes: Task 1 role assignments and v0.7 family/root forms.
- Produces: `generateRoleCandidates(record)`, `scoreRoleCandidate(candidate, context)`, discovery shortlist and WATCH evidence.

- [ ] **Step 1: Write failing tests** for deterministic candidate generation, unique selected forms, frozen canonical words, and `DISCOVERY_CANDIDATE` status.
- [ ] **Step 2: Run the generator test** and verify FAIL.
- [ ] **Step 3: Implement role-morpheme hypotheses** compatible with Mora-Kodin phonotactics; keep them explicitly non-canonical in data metadata.
- [ ] **Step 4: Implement scoring** for role regularity, family coherence, compactness, distinctness, and v0.7 separation preservation.
- [ ] **Step 5: Generate the 122-concept dataset and CSV** with explicit WATCH/FAIL records for weak/conflicting candidates.
- [ ] **Step 6: Run tests** and verify all generated selections are unique and zero canon promotions occur.
- [ ] **Step 7: Commit** with `feat(kodin): generate role-aware Mora-Kodin candidates v0.8`.

### Task 3: Semantic Authority and Morphology Diagnostics

**Files:**
- Create: `packages/hakodan/src/morphological-validator-v0.8.mjs`
- Test: `packages/hakodan/test/morphological-validator-v0.8.test.mjs`

**Interfaces:**
- Consumes: Task 1 registry and Task 2 morphology metadata.
- Produces: `validateMorphology(semanticId, parsedMorphology)` returning `{ok, diagnostics}` without rewriting Semantic ID.

- [ ] **Step 1: Write failing tests** for matching morphology, role mismatch, family mismatch, unknown Semantic ID, and malformed morphology.
- [ ] **Step 2: Run the validator tests** and verify FAIL.
- [ ] **Step 3: Implement `validateMorphology`** using authority order `Semantic ID/registry > explicit role > morphology > phonetic resemblance`.
- [ ] **Step 4: Assert in tests** that a mismatch emits a stable diagnostic and leaves the input Semantic ID unchanged.
- [ ] **Step 5: Run tests** and verify PASS.
- [ ] **Step 6: Commit** with `feat(kodin): add morphology authority diagnostics`.

### Task 4: Multilingual Alias → Role-Aware Metadata

**Files:**
- Create: `packages/hakodan/src/role-aware-aliases-v0.8.mjs`
- Test: `packages/hakodan/test/role-aware-aliases-v0.8.test.mjs`

**Interfaces:**
- Consumes: existing alias normalization plus Task 1 `getRoleForSemanticId`.
- Produces: `resolveRoleAwareAlias(surface, languageHint?) -> {semanticId, role, normalizedSurface}`.

- [ ] **Step 1: Write failing tests** for HNK, PT-BR, EN, mixed usage, accents/`ç`, and accentless PT-BR aliases.
- [ ] **Step 2: Run tests** and verify FAIL.
- [ ] **Step 3: Implement `resolveRoleAwareAlias`** so alias normalization resolves Semantic ID before role lookup.
- [ ] **Step 4: Add regression tests** proving aliases never derive a new Semantic ID from morphology.
- [ ] **Step 5: Run tests** and verify PASS.
- [ ] **Step 6: Commit** with `feat(vhk): add role-aware multilingual alias resolution`.

### Task 5: Visual Block Round-Trip Contract

**Files:**
- Create: `packages/hakodan/src/morphological-blocks-v0.8.mjs`
- Test: `packages/hakodan/test/morphological-blocks-v0.8.test.mjs`

**Interfaces:**
- Consumes: role-aware alias record from Task 4.
- Produces: `toRoleBlock(record)` and `fromRoleBlock(block, targetLanguage)` preserving `semanticId`, `role`, `familyId`.

- [ ] **Step 1: Write failing round-trip tests** for all eight roles and at least HNK→block→PT-BR, PT-BR→block→EN, EN→block→HNK.
- [ ] **Step 2: Run tests** and verify FAIL.
- [ ] **Step 3: Implement block serialization** with required fields `semanticId`, `role`, `familyId`, `surfaceLanguage`, `surfaceForm`, and children/arguments container.
- [ ] **Step 4: Add tests** proving display-language changes do not mutate Semantic ID or role.
- [ ] **Step 5: Run tests** and verify PASS.
- [ ] **Step 6: Commit** with `feat(vhk): add morphological visual block contract`.

### Task 6: v0.8 Audit, Documentation, and Repository Snapshot

**Files:**
- Create: `docs/language/HAKODAN-MORPHOLOGICAL-ROLE-SYSTEM-v0.8.md`
- Modify: `docs/canon/HAKODAN-PROJECT-SNAPSHOT-2026-09-29.md`
- Modify: `docs/canon/HNK-REPO-SYNC-MANIFEST-2026-09-29.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: all Task 1–5 outputs and tests.
- Produces: auditable v0.8 report and source snapshot for consumer-repo pins.

- [ ] **Step 1: Run all v0.8 test files** with `node --test packages/hakodan/test/*v0.8.test.mjs` and require PASS.
- [ ] **Step 2: Run relevant existing v0.4–v0.7 tests** and record any compatibility failure instead of suppressing it.
- [ ] **Step 3: Write the v0.8 report** with counts, role distribution, morpheme hypotheses, conflicts/WATCH items, separation metrics, and explicit `0 canon promotions`.
- [ ] **Step 4: Update the project snapshot and changelog** with v0.8 status and artifact paths.
- [ ] **Step 5: Commit** with `docs(canon): record haKodan morphology v0.8`.
- [ ] **Step 6: Refresh consumer pins** in `codex-hnk`, `SIGILKODE-HNK`, `HNK-VERSE`, `simpleway-hnk`, and `cubo-hnk` only after the authoritative HNK-KODE commit is verified.
- [ ] **Step 7: Update the sync manifest** with exact resulting commit SHAs and verify each pinned file on its default branch.
