# HNK-KODE Gate 03 — Authority & Independence Design

Date: 2026-09-25
Status: DESIGN SPEC — awaiting implementation-plan approval

## 1. Intent

Establish HNK-KODE as the independent canonical upstream for the HNK language while preserving the Gate 02 source-locked migration evidence and providing stable, explicit consumption paths for CODEX-HNK, SimpleWay-HNK and HNK-VERSE.

This gate changes repository authority and interfaces. It does not change HNK vocabulary, meanings, grammar, phrases or promotion status.

## 2. Source authority

The normative policy is `docs/AUTHORITY-MANIFEST.md`.

Authority flows in one direction:

`HNK-KODE -> public language API -> downstream consumers`

Downstream projects may originate proposals, but proposals do not become canonical merely through downstream use. Canonical promotion is governed in HNK-KODE.

## 3. Preservation boundary

The Gate 02 migration originates from `tehknesolutions/codex-hnk` frozen at:

`3027151d18176fd5ae46a04b2ac8ed8424bf68db`

Source-locked migrated artifacts remain provenance evidence. Gate 03 must not rewrite them merely to modernize formatting or architecture.

Any future semantic change must be distinguishable from the preservation layer and governed as a new HNK-KODE change.

## 4. Public API boundary

HNK-KODE will expose a versioned public language surface instead of requiring consumers to know internal source paths.

The public surface must cover, as available in the migrated package:

- lexicon lookup and canonical lexical records;
- phrases;
- authored/governed candidate records;
- Cycle 1 language coverage contracts;
- grammar-core contracts;
- pronunciation/transliteration/encoding information already represented by the canonical package;
- stable types required by consumers.

Consumers must import through declared package exports. Deep imports into private implementation files are unsupported unless explicitly promoted into the public contract.

## 5. Glyph boundary

HNK-KODE may depend on stable glyph identity/binding contracts required to represent language. Visual glyph artwork, rendering systems and presentation assets remain separate concerns.

Glyph presentation cannot redefine lexical meaning, grammar or canonical linguistic status.

If a temporary local glyph compatibility surface is required to make HNK-KODE independently testable, it must be explicit, minimal and removable. It must not create a second linguistic authority.

## 6. Independence validator

Gate 03 will add an executable validator that fails when authority boundaries are violated.

Minimum checks:

1. HNK-KODE runtime language code does not import CODEX-HNK as a source of linguistic truth.
2. Public exports resolve only to HNK-KODE-owned or explicitly declared compatibility dependencies.
3. Required authority/provenance documents exist and retain the frozen CODEX SHA.
4. Source-locked migration material is distinguishable from post-migration semantic evolution.
5. Package metadata exposes the supported public API rather than requiring undocumented deep imports.

The validator is a structural authority gate, not a linguistic correctness oracle.

## 7. Consumer contracts

### CODEX-HNK

Role: documentary, curricular and integrator consumer.

It may preserve historical records and provenance, but after authority transfer it must not maintain a competing canonical language registry.

### SimpleWay-HNK

Role: educational consumer.

It owns pedagogy, exercises, progression, UX and learning mechanics. New forms encountered during course design remain proposals until governed in HNK-KODE.

### HNK-VERSE

Role: narrative/gameplay consumer.

It may use HNK in dialogue, interfaces, lore and mechanics. Fictional/game usage alone cannot promote a language form to canonical status.

## 8. Candidate flow

The supported conceptual flow is:

`consumer/research proposal -> CANDIDATE -> HNK-KODE governance -> canonical promotion -> public API -> consumers`

Gate 03 does not need to implement a full proposal-management application. It only needs to preserve the distinction between downstream proposal and upstream canonical promotion.

## 9. Compatibility strategy

Migration must be incremental. Consumers do not need to switch simultaneously.

During transition:

- existing CODEX provenance remains intact;
- HNK-KODE gains independent validation first;
- a stable public API is established before consumer rewiring;
- consumers migrate one at a time;
- temporary adapters are permitted only when explicit and removable.

No big-bang rewrite is required.

## 10. Failure behavior

Authority violations must fail closed in validation. A missing required export, reverse dependency, missing provenance marker or unsupported internal import must produce a deterministic validation failure with a human-readable reason.

A validation failure must not silently rewrite linguistic data.

## 11. Testing strategy

Gate 03 implementation must provide automated tests/validation for:

- package public exports;
- absence of forbidden CODEX runtime dependencies;
- authority/provenance invariants;
- independent importability of the HNK language package;
- preservation of existing migrated language tests wherever those tests are present and runnable;
- negative fixtures or equivalent checks proving that the authority validator detects a forbidden dependency or invalid boundary.

## 12. Out of scope

Gate 03 does not:

- invent new HNK words;
- change approved meanings;
- promote candidates;
- redesign glyph artwork;
- redesign SimpleWay pedagogy;
- implement HNK-VERSE gameplay;
- delete historical CODEX language evidence;
- force all consumers to migrate in one commit.

## 13. Completion criteria

Gate 03 is complete only when all of the following are evidenced:

1. HNK-KODE has a documented and executable authority boundary.
2. Its supported public language API is explicit and testable.
3. The language package validates without CODEX-HNK as runtime linguistic authority.
4. Gate 02 provenance remains intact.
5. A supported downstream consumption contract exists.
6. At least the migration path for CODEX-HNK is concretely defined, with consumer rewiring allowed to proceed incrementally.
7. Validation fails deterministically on a representative authority violation.

Only after these conditions pass may the project declare HNK-KODE the technically independent canonical upstream and begin consumer migration under that contract.
