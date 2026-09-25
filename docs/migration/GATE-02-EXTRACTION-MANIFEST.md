# Gate 02 — Preservative Extraction Manifest

Status: **OPEN / COPY PREPARATION / NO AUTHORITY TRANSFER YET**

## Frozen source

- Repository: `tehknesolutions/codex-hnk`
- Source commit: `3027151d18176fd5ae46a04b2ac8ed8424bf68db`
- Extraction rule: `COPY -> VERIFY -> CONSUME -> DEPRECATE -> REMOVE`

The source commit is immutable for this gate. Changes that land later on CODEX-HNK must be reconciled explicitly rather than silently entering the extraction.

## Baseline evidence

Recent clean-worktree evidence for `@hnk/linguas` recorded in CODEX-HNK PR #259:

- 26/26 tests PASS
- TypeScript typecheck PASS
- frozen-lockfile verification PASS
- supply-chain policy PASS
- `git diff --check` clean
- governed authored registry: 140 total candidates
- Cycle 1 slice: 20 candidates

PR #258 also establishes that `@hnk/linguas` intentionally isolates its TypeScript declaration environment from ambient host `@types/*`; this behavior must be preserved.

## Package dependency chain

`@hnk/linguas -> @hnk/glyphs -> @hnk/canon-contract`

### Important boundary discovered during Gate 02

`@hnk/canon-contract` is **not dependency-closed inside its package directory**. Its runtime imports three CODEX-owned canon/governance JSON resources by relative path:

- `canon/core/research-001-symbolic-architecture-v1.json`
- `canon/governance/human-gates/research-001.json`
- `canon/governance/human-gates/research-001-batch-001-approval.json`

Therefore blindly promoting `@hnk/canon-contract` into HNK-KODE would duplicate a **general CODEX HNK canon authority**, not merely language canon. That is forbidden by the source-of-truth separation established for HNK-KODE.

The glyph dependency is narrow: `packages/hnk-glyphs/src/canon.mjs` imports `createHnkCanonConsumerSnapshot`, `queryHnkCanon`, and `validateHnkCanonContract` from `@hnk/canon-contract`, then exposes a glyph-engine consumer snapshot/query/validator adapter.

### Gate 02 decision

The preservation set is now split into two classes:

**LANGUAGE-OWNED EXTRACTION**

- `packages/hnk-linguas`
- `packages/hnk-glyphs` core/runtime/reference/visual/test material

**CODEX-OWNED COMPATIBILITY DEPENDENCY**

- `@hnk/canon-contract`
- its three canon/governance JSON inputs
- `@hnk/glyphs/canon` adapter that consumes that contract

During COPY, the CODEX-owned dependency may be mirrored only as an explicitly provenance-locked compatibility snapshot if required for exact equivalence. Mirroring does **not** transfer canonical ownership to HNK-KODE. Final architecture must replace that mirror with an explicit cross-repository contract/package boundary before CODEX removes its legacy language packages.

## Source tree inventory locked for COPY

### `@hnk/linguas`

Source tree contains:

- `src/authored.d.ts`
- `src/authored.mjs`
- `src/cycle1.d.ts`
- `src/cycle1.mjs`
- `src/grammar-core-v1.d.ts`
- `src/grammar-core-v1.mjs`
- `src/index.d.ts`
- `src/index.mjs`
- `src/parent-lexemes.mjs`
- four test files
- README/package/tsconfig

### `@hnk/glyphs`

Source tree contains:

- `src/canon.d.ts`
- `src/canon.mjs`
- `src/frozen-sprite.mjs`
- `src/index.d.ts`
- `src/index.mjs`
- `reference/HNK40_REFERENCE_MATRIX_V1.json`
- `reference/README.md`
- `test/reference-matrix.test.mjs`
- `test/runtime.test.mjs`
- `visual/hnk40-visual-canon-v2.mjs`
- README/package/tsconfig

### `@hnk/canon-contract`

Source tree contains:

- `src/index.d.ts`
- `src/index.mjs`
- package/tsconfig
- three external CODEX canon/governance JSON inputs listed above

## Semantic locks

During COPY and VERIFY:

1. No lexeme invention.
2. No candidate promotion.
3. No phoneme reassignment.
4. No glyph renumbering.
5. No silent status promotion from `PREPRODUCTION_NOT_OFFICIAL`.
6. No normalization that changes public exports or deterministic outputs.
7. No automatic merge between linguistic glyphs and SIGILKODE-HNK sigils.
8. Preserve declarations, tests, reference data, visual canon artifacts, hashes and provenance.
9. Mirrored CODEX canon material remains CODEX-owned and READ-ONLY compatibility evidence.

## Verification gates

Before any consumer migration:

- [ ] Language-owned source files copied from frozen SHA with path/content provenance.
- [ ] CODEX compatibility dependency represented without ownership ambiguity.
- [ ] Package metadata and public exports preserved.
- [ ] `@hnk/linguas` baseline reproduced independently.
- [ ] `@hnk/glyphs` test/typecheck baseline recorded and reproduced.
- [ ] Canon adapter equivalence reproduced against the frozen CODEX contract snapshot.
- [ ] HNK40 deterministic registry/reference/visual invariants compared.
- [ ] No unexplained output divergence.
- [ ] Consumer/import map completed.
- [ ] SIGILKODE boundary documented.
- [ ] Final external contract strategy chosen before authority transfer.

## Authority rule

Until all verification gates pass, CODEX-HNK remains the operational source for the extracted legacy packages. HNK-KODE is a candidate successor for the **language domain** under verification. General HNK canon/governance remains CODEX-owned.
