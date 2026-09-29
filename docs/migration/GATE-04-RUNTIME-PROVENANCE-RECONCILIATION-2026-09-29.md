# Gate 04 — Runtime & Provenance Reconciliation

Date: 2026-09-29
Status: OPEN / BLOCKED ON PRESERVED ARTIFACTS

## Scope

Audit the language and glyph runtime surfaces before authority transfer.

## Findings

### @hnk/linguas

The consolidation branch contains the missing runtime module:

- `packages/hnk-linguas/src/authored.mjs`
- It exports the governed authored candidate registry.
- It declares 140 authored candidates.
- All authored entries remain `CANDIDATE`.
- Historical recovery is explicitly false for authored candidates.
- HNK3000 A1 Wave 01–03 contains 120 authored candidates and remains curriculum-unbound/non-productive.
- Grammar Core V1 imports `./authored.mjs` and validates its source IDs, authority, lesson scope and candidate status.

This resolves the provenance question on the consolidation branch: the runtime artifact exists there and is not to be invented.

### main/default branch discrepancy

The same path is absent from the default branch at the time of this audit, while `grammar-core-v1.mjs` imports it. Therefore the default branch cannot be treated as independently buildable until the migration branch is integrated or an equivalent source-locked artifact is restored.

This is a migration integrity finding, not permission to synthesize `authored.mjs`.

### @hnk/glyphs

The current default branch exposes `src/index.mjs` with:

- HNK40 status `PREPRODUCTION_NOT_OFFICIAL`;
- 40 IPA entries;
- candidate PUA range U+E100–U+E127;
- safe transliteration map;
- deterministic G01–G40 addressing;
- runtime validators.

The migration branch does not currently expose the expected `src/canon.mjs` or HNK40 reference matrix at the paths listed by Gate 02. These artifacts therefore remain unresolved and must be recovered from the frozen CODEX source rather than recreated from inference.

### Authority boundary

Gate 03 remains correct: HNK-KODE is intended to become the independent language authority, but authority transfer is conditional on preservation/equivalence evidence and independent validation.

## No-go actions

Do not:
- invent authored candidates;
- recreate missing canon adapters from memory;
- promote HNK40 visual state;
- convert PUA assignments into official Unicode canon;
- promote authored candidates to FROZEN;
- infer semantics from glyph geometry.

## Exit criteria

1. Integrate/restore source-locked `@hnk/linguas` runtime.
2. Recover `@hnk/glyphs` canon adapter and HNK40 reference matrix from frozen source.
3. Reproduce tests/typecheck.
4. Verify deterministic HNK40 reference outputs.
5. Verify CODEX canon compatibility without transferring general CODEX authority.
6. Record exact commit/content hashes.
7. Only then evaluate authority transfer.
