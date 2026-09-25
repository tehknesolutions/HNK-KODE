# Gate 02 — Preservative Extraction Manifest

Status: **OPEN / NO AUTHORITY TRANSFER YET**

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

## Dependency-closed extraction set

Current dependency chain:

`@hnk/linguas -> @hnk/glyphs -> @hnk/canon-contract`

Gate 02 therefore treats these three packages as the initial compatibility closure. This does **not** mean HNK-KODE assumes ownership of every CODEX canon concern represented by `@hnk/canon-contract`; ownership boundaries must be resolved before final authority transfer.

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

## Extraction targets

- `packages/canon-contract`
- `packages/hnk-glyphs`
- `packages/hnk-linguas`

## Verification gates

Before any consumer migration:

- [ ] Source files copied from the frozen SHA with path/content provenance.
- [ ] Package metadata and public exports preserved.
- [ ] `@hnk/linguas` baseline reproduced independently.
- [ ] `@hnk/glyphs` test/typecheck baseline recorded and reproduced.
- [ ] `@hnk/canon-contract` test/typecheck baseline recorded and reproduced.
- [ ] HNK40 deterministic registry/reference/visual invariants compared.
- [ ] No unexplained output divergence.
- [ ] Consumer/import map completed.
- [ ] SIGILKODE boundary documented.

## Authority rule

Until all verification gates pass, CODEX-HNK remains the operational source for the extracted legacy packages. HNK-KODE is a candidate successor under verification, not yet the sole operational publisher.
