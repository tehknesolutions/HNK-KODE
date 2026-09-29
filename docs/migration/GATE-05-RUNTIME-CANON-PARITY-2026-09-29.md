# Gate 04 Correction + Gate 05 — Runtime/Canon Parity

Date: 2026-09-29
Status: VERIFIED-PARTIAL / CANON ADAPTER STILL OPEN

## Correction to Gate 04

A fresh main-branch tree audit shows that `packages/hnk-linguas/src/authored.mjs` **does exist on main** and on the consolidation branch, with the same source content/SHA observed in the audit.

Therefore the earlier Gate 04 statement that main lacked `authored.mjs` is superseded and must not be treated as current repository state.

The repository's own `CANON-SOURCE-STATE-MATRIX-2026-09-27.md` still contains the older integrity finding saying the file was absent. That document is now historical migration evidence and should be updated in a future documentation correction.

## Current runtime parity

### @hnk/linguas

Verified on main:
- `src/index.mjs`
- `src/authored.mjs`
- `src/authored.d.ts`
- `src/cycle1.mjs`
- `src/grammar-core-v1.mjs`
- `src/parent-lexemes.mjs`
- tests for authored, cycle1, grammar-core and lexicon

Authored registry:
- version `1.10.0-candidate`
- 140 governed authored candidates
- candidate authority remains explicit
- authored entries declare `historicalRecoveryClaim: false`
- HNK3000 A1 Wave 01–03 entries remain curriculum-unbound and non-productive

### @hnk/glyphs

Verified on main:
- 40 stable G-IDs
- 40 IPA bindings
- HNK40 status remains `PREPRODUCTION_NOT_OFFICIAL`
- deterministic transliteration mapping
- TS remains atomic G30
- linguistic contract test explicitly excludes renderer/sprite authority

## Remaining missing boundary

No `@hnk/canon-contract` package or equivalent path was found in the current repository tree/search.

No `packages/hnk-glyphs/src/canon.mjs` was found.

No HNK40 reference matrix matching the Gate 02 expected path was found.

These are not to be synthesized from the existing 40-glyph runtime because the Authority Manifest requires preservation/equivalence evidence before transfer.

## Canon reconciliation

The repository currently records:
- HNK-KODE as upstream language authority;
- CODEX-HNK as consumer/integrator;
- SimpleWay-HNK and HNK-VERSE as consumers;
- HNK40 as candidate/benchmark rather than complete alphabet;
- mathematical/structural layers as distinct from lexical/semantic canon.

The core lexeme reconciliation ledger currently classifies AHNUVA, EMANU, HAYA and HODERU as project-canon decisions whose exact source payloads are not currently recovered byte-for-byte, and marks their runtime state NOT VERIFIED. KODAN, YAHUSHA and YAHUAH are likewise not runtime-verified in that ledger.

## Gate 05 exit criteria

1. Correct stale migration documentation about `authored.mjs`.
2. Locate/recover the source-locked canon contract if one exists.
3. Locate/recover the HNK40 reference matrix if one exists.
4. Add exact runtime tests for project-canon lexemes only after source/provenance is sufficient.
5. Establish a stable CODEX-HNK consumption contract.
6. Record hashes and compatibility evidence.
7. Re-evaluate authority-transfer gate.

## Explicit no-go

Do not:
- manufacture `@hnk/canon-contract`;
- manufacture `canon.mjs`;
- turn project-canon decisions into runtime FROZEN entries without exact governance/provenance;
- treat HNK40 IPA/G-ID mappings as complete language canon;
- infer missing semantics from transliteration or geometry.
