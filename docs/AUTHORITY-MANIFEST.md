# HNK-KODE Authority Manifest

Status: Gate 03 — Authority & Independence

## Purpose

HNK-KODE is the canonical upstream repository for the HNK language domain.

This manifest defines repository authority boundaries without changing the linguistic content preserved during Gate 02.

## Authority flow

`HNK-KODE -> consumers`

Linguistic truth MUST NOT be created or silently overridden by downstream consumers.

## HNK-KODE owns

- canonical HNK lexemes and governed lexical status;
- HNK grammar contracts and governed grammatical components;
- canonical phrases and linguistic structures;
- lesson/curriculum language bindings when those bindings assert facts about HNK;
- language-facing transliteration, pronunciation and encoding contracts;
- governance metadata required to distinguish recovered, candidate, watch, frozen, gate, bridge and reference material;
- public language APIs exported for consumers.

## Glyph boundary

Glyph identity and linguistic binding may be consumed by HNK-KODE, but visual glyph artwork/rendering is a separate concern.

A glyph representation MUST NOT redefine a lexeme, grammatical rule or canonical linguistic meaning merely because a visual representation exists.

## CODEX-HNK

CODEX-HNK is a consumer, integrator and documentary/curricular surface for HNK language data.

After authority transfer, CODEX-HNK MUST consume canonical linguistic truth from HNK-KODE rather than maintain an independent competing language canon.

Historical provenance may remain in CODEX-HNK and MUST NOT be erased by this migration.

## SimpleWay-HNK

SimpleWay-HNK is an educational application/curriculum consumer of HNK-KODE.

It MAY define pedagogy, exercises, sequencing, UX and learning mechanics. It MUST NOT silently promote new HNK vocabulary or grammar into canonical status.

## HNK-VERSE

HNK-VERSE is a game/world consumer of HNK-KODE.

It MAY use HNK language in narrative, gameplay, interfaces, dialogue and world systems. Game content MUST NOT become canonical language merely through usage.

## Candidate material

New language proposals MAY originate in research, CODEX work, SimpleWay-HNK, HNK-VERSE or other HNK projects, but canonical promotion occurs only through HNK-KODE governance.

Candidate status is not equivalent to canonical promotion.

## Independence rule

HNK-KODE MUST become buildable/testable as an independent language authority and MUST NOT require CODEX-HNK as a source of runtime linguistic truth.

Temporary migration compatibility is allowed only when explicitly documented and scheduled for removal.

## Gate 02 preservation boundary

The source-locked material extracted from `tehknesolutions/codex-hnk` at frozen commit:

`3027151d18176fd5ae46a04b2ac8ed8424bf68db`

remains provenance evidence. Gate 03 MUST NOT rewrite that historical fact.

## Authority transfer condition

Authority is considered transferred only after:

1. the required language package surface exists in HNK-KODE;
2. preservation/equivalence evidence is recorded for migrated source-locked assets;
3. HNK-KODE can validate its language contracts independently;
4. downstream consumers have an explicit supported consumption path;
5. CODEX-HNK no longer acts as an independent competing source of canonical linguistic truth.

Until these conditions are verified, the migration is transitional.
