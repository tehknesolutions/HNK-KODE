# Gate 01 — Legacy Canon Inventory

Status: **IN PROGRESS / SOURCE-LOCKED**

Source snapshot audited: `tehknesolutions/codex-hnk` branch `main`.

## 1. `@hnk/linguas`

Current legacy location: `packages/hnk-linguas`

Package metadata:

- name: `@hnk/linguas`
- version: `1.1.0-preproduction`
- private: `true`
- module format: ESM
- test: `node --test test/*.test.mjs`
- typecheck: `tsc -p tsconfig.json --noEmit`
- direct workspace dependency: `@hnk/glyphs`

Public export surface:

- `@hnk/linguas`
- `@hnk/linguas/authored`
- `@hnk/linguas/cycle1`
- `@hnk/linguas/grammar-core-v1`

Observed source modules:

- `src/authored.mjs` + `authored.d.ts`
- `src/cycle1.mjs` + `cycle1.d.ts`
- `src/grammar-core-v1.mjs` + `grammar-core-v1.d.ts`
- `src/index.mjs` + `index.d.ts`
- `src/parent-lexemes.mjs`

Observed tests:

- `test/authored.test.mjs`
- `test/cycle1.test.mjs`
- `test/grammar-core-v1.test.mjs`
- `test/lexicon.test.mjs`

Root files:

- `README.md`
- `package.json`
- `tsconfig.json`

## 2. `@hnk/glyphs`

Current legacy location: `packages/hnk-glyphs`

Package metadata:

- name: `@hnk/glyphs`
- version: `0.1.0-preproduction`
- private: `true`
- module format: ESM
- test: `node --test test/*.test.mjs`
- typecheck: `tsc -p tsconfig.json --noEmit`
- direct workspace dependency: `@hnk/canon-contract`

Public export surface:

- `@hnk/glyphs`
- `@hnk/glyphs/canon`

Observed package domains:

- `reference/`
- `src/`
- `test/`
- `visual/`

Root files:

- `README.md`
- `package.json`
- `tsconfig.json`

## 3. Dependency boundary discovered

The extraction is **not yet dependency-closed**:

`@hnk/linguas -> @hnk/glyphs -> @hnk/canon-contract`

Therefore `@hnk/canon-contract` must be audited before the extracted packages can be declared independently executable in HNK-KODE. We must determine whether the contract is:

1. copied/promoted to HNK-KODE;
2. published/shared from another canonical package; or
3. replaced by an explicit external consumer dependency.

No choice is made in Gate 01 without inspecting the contract and its consumers.

## 4. Preservation requirements

The first extraction must preserve:

- package names unless an explicit compatibility migration is approved;
- all current exports;
- runtime behavior;
- TypeScript declarations;
- tests;
- reference/visual artifacts associated with glyphs;
- provenance and authority metadata;
- deterministic corpus/grammar/glyph output.

## 5. Gate 01 remaining work

- [x] Inventory `hnk-linguas` root, source surface and tests.
- [x] Inventory `hnk-glyphs` root and package domains.
- [x] Record direct package dependency chain.
- [ ] Inventory every file below `hnk-glyphs/{reference,src,test,visual}`.
- [ ] Audit `@hnk/canon-contract`.
- [ ] Locate all CODEX consumers/importers using a tree/import audit rather than relying only on GitHub text search.
- [ ] Record executable baseline test results in the source workspace.
- [ ] Freeze source commit SHA for the copy/equivalence gate.

## Rule

No deletion, deprecation or semantic refactor of the CODEX source packages is authorized by this inventory. Migration remains:

`COPY -> VERIFY -> CONSUME -> DEPRECATE -> REMOVE`
