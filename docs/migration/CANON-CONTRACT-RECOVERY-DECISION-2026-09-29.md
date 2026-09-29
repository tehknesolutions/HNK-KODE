# Canon Contract Recovery Decision — 2026-09-29

Status: OPEN / SOURCE RECOVERY REQUIRED

## Finding

A repository-wide tree audit found no package or file named:

- `@hnk/canon-contract`
- `packages/hnk-glyphs/src/canon.mjs`
- `HNK40_REFERENCE_MATRIX_V1`

The HNK-KODE Gate 03 design/plan calls for a minimal local canon-contract compatibility boundary, but those documents do not provide the missing byte-level implementation.

## Decision

Do **not** synthesize the missing contract from current runtime glyph data, project memory, or inferred semantics.

The existing HNK40 runtime is explicitly `PREPRODUCTION_NOT_OFFICIAL`. It supplies stable G-IDs/IPA/transliteration behavior, but that does not constitute the missing canon authority contract.

The existing project-canon ledger separately records AHNUVA, EMANU, HAYA, HODERU, KODAN, YAHUSHA and YAHUAH as current project-canon decisions with incomplete byte-level source recovery. They remain outside automatic runtime promotion.

## Recovery order

1. Search frozen CODEX-HNK Gate 02 source tree for exact contract/matrix artifacts.
2. Compare recovered paths/content against HNK-KODE migration manifests.
3. If exact artifacts are recovered, import them source-locked and attach hashes.
4. If they are not recoverable, create a NEW HNK-KODE compatibility contract only through an explicit governance decision, clearly marked as post-migration authored architecture.
5. Add equivalence tests before consumer rewiring.

## Boundary

A compatibility contract may expose identity/provenance relationships, but it must not silently create:
- new lexemes;
- meanings;
- grammar;
- phoneme assignments;
- sacred associations;
- glyph semantics.

## Current gate

Runtime package parity: PASS-PARTIAL.

Canon-contract recovery: BLOCKED.

Authority transfer: NOT YET ELIGIBLE.
