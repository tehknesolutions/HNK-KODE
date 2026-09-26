# HNK-KODE Gate 03 — Authority & Independence Implementation Plan

Date: 2026-09-26
Status: APPROVED FOR IMPLEMENTATION
Source design: `docs/superpowers/specs/2026-09-25-hnk-kode-authority-independence-design.md`

## Objective

Make HNK-KODE technically independent as the canonical upstream for HNK language without changing linguistic semantics and without destroying Gate 02 provenance.

Authority direction:

`HNK-KODE -> public language API -> CODEX-HNK / SimpleWay-HNK / HNK-VERSE`

Frozen preservation source:

`tehknesolutions/codex-hnk@3027151d18176fd5ae46a04b2ac8ed8424bf68db`

## Non-negotiable constraints

- Do not invent or promote HNK vocabulary in Gate 03.
- Do not change approved meanings, phrases, grammar or authority labels.
- Preserve Gate 02 source-lock evidence.
- No runtime dependency on CODEX-HNK for linguistic truth.
- Consumer migration is incremental, never a big-bang rewrite.
- Glyph compatibility may be local only when explicit, minimal and non-authoritative.

## Task 1 — Establish the Gate 03 branch and executable plan

Create `gate-03-authority-independence` from the verified Gate 02 branch head. Preserve the design spec and this implementation plan as the governing implementation record.

Verification:

- branch ancestry includes Gate 02;
- design spec remains unchanged;
- frozen CODEX SHA remains documented.

## Task 2 — Restore the complete preserved language package

Gate 02 currently contains the migrated runtime modules but not the complete source test surface. Restore the source-locked `packages/hnk-linguas/test/**` files from the frozen CODEX commit without semantic edits.

Verification:

- every restored test is byte/content-equivalent to the frozen source;
- all migrated runtime modules remain source-locked;
- package tests are runnable inside HNK-KODE.

## Task 3 — Add a minimal glyph compatibility package

Restore only the stable glyph identity/binding contract required by `@hnk/linguas`. The compatibility package must not become a second linguistic authority.

Initial preserved scope:

- `packages/hnk-glyphs/package.json`
- `packages/hnk-glyphs/tsconfig.json`
- stable runtime/type files required by language imports;
- reference matrix only where required by the stable binding contract;
- source tests needed to prove the preserved glyph contract.

Exclude presentation-only visual artwork/rendering assets unless a test proves they are required for runtime compatibility.

Verification:

- `@hnk/linguas` imports resolve locally;
- glyph package cannot redefine lexeme meaning or grammar;
- no CODEX-HNK runtime import is introduced.

## Task 4 — Add the local canon-contract compatibility boundary

Restore the minimal preserved canon-contract required by `@hnk/glyphs` as a local compatibility dependency.

Verification:

- glyph contract tests pass;
- compatibility package contains no HNK lexical registry;
- authority remains in HNK-KODE language governance.

## Task 5 — Declare the public language API

Update `packages/hnk-linguas/package.json` with explicit package exports for supported surfaces rather than requiring private deep imports.

Required supported surfaces:

- root lexicon/phrase API;
- authored candidate API;
- Cycle 1 coverage API;
- grammar-core-v1 API;
- stable type declarations corresponding to each supported surface.

Do not rewrite the source-locked modules merely to create the export map.

Verification:

- supported imports resolve through package exports;
- unsupported private deep imports are not part of the contract;
- existing semantic data is unchanged.

## Task 6 — Implement the authority validator using TDD

Add a failing validator test first, then implement the validator.

Validator must fail deterministically when:

1. runtime language code references CODEX-HNK as authority;
2. required authority/provenance documents are missing;
3. the frozen CODEX SHA disappears from preservation evidence;
4. required public exports are missing;
5. source-locked migration material is not clearly distinguishable from post-migration evolution;
6. package dependencies point to undeclared external linguistic authority.

Include a negative fixture/equivalent synthetic violation proving failure behavior.

Verification:

- positive repository state passes;
- representative forbidden dependency fails with a human-readable reason;
- validator never rewrites linguistic data.

## Task 7 — Add independent package validation

Add root/package scripts that run:

- language tests;
- glyph compatibility tests;
- canon-contract tests as applicable;
- public API smoke import;
- authority validator.

The gate must be executable without checking out CODEX-HNK.

## Task 8 — Add CI Gate 03

Create a GitHub Actions workflow dedicated to authority independence. It must install the HNK-KODE workspace and run the complete Gate 03 validation surface.

CI must fail closed on authority-validator failure or test regression.

## Task 9 — Document downstream consumer contracts

Create a migration contract documenting:

- CODEX-HNK as documentary/curricular/integrator consumer;
- SimpleWay-HNK as educational consumer;
- HNK-VERSE as narrative/gameplay consumer;
- proposal -> CANDIDATE -> HNK-KODE governance -> canonical promotion -> public API flow;
- supported import surfaces;
- temporary adapter policy and removal expectation.

Include a concrete incremental CODEX-HNK rewiring sequence, but do not modify CODEX-HNK in Gate 03.

## Task 10 — Final Gate 03 verification

Run the full verification matrix and record evidence.

Completion requires:

- public API PASS;
- language regression tests PASS;
- glyph/canon compatibility PASS;
- independent importability PASS;
- authority validator positive PASS;
- authority validator negative case PASS;
- provenance/frozen SHA PASS;
- CI PASS.

Only then update the Gate 03 status to `TECHNICALLY_INDEPENDENT_CANONICAL_UPSTREAM` and open the PR for review.

## Commit strategy

Prefer small auditable commits:

1. `docs: add Gate 03 implementation plan`
2. `test: restore preserved HNK language regression suite`
3. `feat: add minimal glyph and canon compatibility boundary`
4. `feat: declare HNK language public API`
5. `test: add authority boundary failure cases`
6. `feat: add HNK-KODE authority validator`
7. `ci: enforce Gate 03 authority independence`
8. `docs: define downstream HNK-KODE consumer contract`
9. `docs: record Gate 03 verification evidence`

At no point should a preservation commit be mixed with a semantic HNK language change.