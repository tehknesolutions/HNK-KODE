# HNK-KODE — All-Sources Consolidation

Date: 2026-09-27
Status: ACTIVE MIGRATION

## Goal

Consolidate HNK-KODE / HNK language knowledge into `tehknesolutions/HNK-KODE` while preserving provenance and avoiding silent canon rewrites.

## Authority architecture

- `HNK-KODE` — primary authority for language docs + code.
- `HNK-KODESCRIPT` — script/orthographic/renderer/input subsystem of HNK-KODE.
- `codex-hnk` — research provenance, Mandala E1–E5 evidence, historical Codex integration.
- `tehkne-os` — consumer/runtime integration.
- `alakazam-strangeverse` — consumer and acquisition laboratory.

## Existing HNK-KODE repository material

The repository already contains substantial migrated language code, including:

- `packages/hnk-linguas`
- grammar core
- Cycle 1 material
- authored lexemes
- parent lexemes
- glyph package and linguistic contract tests
- authority/migration manifests and gates

This migration therefore extends an existing authority repository rather than replacing it.

## GitHub source families identified

### codex-hnk
Primary research source for:

- Mandala graph/topology;
- HNK40 Genesis glyph work;
- E1–E5 glyph-space census;
- reversal law `FORM != EXECUTION`;
- automorphism/Burnside proof;
- render-distinct proof;
- final currently-computable N=12 space: `2,647,892`.

### alakazam-strangeverse
Consumer/source of interoperability requirements for:

- Strange Idiom / SI;
- Shimokodes;
- game-based acquisition;
- puzzles, inscriptions, UI, crafting/technomagic and language pedagogy.

### tehkne-os
Consumer/runtime requirements for:

- versioned manifest consumption;
- registry/API;
- renderer/cache/indexing;
- input/IME/transliteration/validation integration.

### HNK-VERSE and other HNK repositories
Must be searched for language references and imported only with provenance. Material that merely mentions HNK without defining language/script behavior should not be promoted automatically.

## Google Drive source families identified

See `docs/sources/DRIVE-HNK-KODE-INVENTORY.md`.

The strongest direct source is the Drive folder `HNK — IDIOMA`, which contains status, canon, lexicon, glyph, numerology, pipeline, validation and changelog snapshots plus later deltas.

Other relevant source folders discovered:

- `HNK — HENUVOKODAN`
- `HNK — CODEX`
- `Codex HNK`

## Canonical language material to preserve/test

Known language material represented across the existing repository and Drive snapshots includes:

- language designation: HNK-KODE / HENUVOKODAN;
- 11-letter/portal HENUVOKODAN system plus creator-key concept in historical canon;
- conceptual H/N/K triad;
- `KODAN` as a canonical language concept;
- sacred-name mappings `YAHUSHA`, `YAHUAH` in HNK canon;
- core lexemes `AHNUVA`, `EMANU`, `HAYA`, `HODERU`;
- morphology, derivation and grammar-core work;
- Cycle 1 language material;
- HNK40 Genesis seed family;
- Mandala N=12 glyph-space architecture.

Historical and spiritual claims are preserved here as HNK canon/source material, not silently converted into external historical/scientific claims.

## E5 milestone

The current HNK-KODE manifest records:

- raw walks: `7,289,096,672`
- simple paths: `95,284,518`
- reversal classes: `47,642,259`
- geometric classes: `2,647,892`
- render-distinct: `2,647,892`

Interpretation: `2,647,892` is a geometric identity capacity for N=12 under the currently frozen model, **not an alphabet-size mandate**.

## Migration strategy

### Layer A — Source archive
Preserve source snapshots and provenance.

### Layer B — Normalized spec
Extract definitions into stable machine-readable schemas and prose specifications.

### Layer C — Canon registry
Promote only explicitly approved HNK decisions.

### Layer D — Runtime packages
Expose tested APIs through `packages/hnk-linguas`, glyph packages, KODESCRIPT packages and future codecs.

### Layer E — Consumers
Publish versioned manifests/contracts to Codex, TKN-OS and SW.

## Next extraction pass

1. Fetch complete Drive `HNK — IDIOMA` source files and preserve snapshots.
2. Recursively inventory `HNK — HENUVOKODAN`, `HNK — CODEX`, and `Codex HNK`.
3. Compare Drive canon/deltas against `packages/hnk-linguas` tests.
4. Import Mandala E1–E5 evidence bundle from `codex-hnk`.
5. Build SI ↔ HNK-KODE interoperability inventory from SW sources.
6. Generate conflict/delta report before changing existing canonical exports.

## Non-negotiable migration rule

**Copying evidence is not the same as canonizing it.** Every imported source retains provenance; conflicts remain explicit until resolved by an HNK authority decision.
