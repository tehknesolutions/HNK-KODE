# haKodan Morphological Role System v0.8

**Status:** IMPLEMENTED ON FEATURE BRANCH / DISCOVERY_NON_CANONICAL

v0.8 adds deterministic computational-role metadata over the 122 provisional Mora-Kodins without changing Semantic ID authority.

## Verified inventory

- concepts: 122
- roles: 8
- ACTION: 25
- ENTITY: 30
- STATE: 7
- DATA: 38
- AGENT: 5
- OPERATOR: 11
- COLLECTION: 4
- TARGET: 2
- canon promotions: 0

## Discovery morpheme hypotheses

`ACTION=RA · ENTITY=NA · STATE=SE · DATA=DA · AGENT=TA · OPERATOR=KO · COLLECTION=LI · TARGET=MA`

These forms are discovery hypotheses, not canon.

## Authority

`Semantic ID/registry > registered role > morphology > phonetic resemblance`.

Role/family disagreements produce diagnostics and never silently rewrite the Semantic ID.
## Multilingual + visual contract

HNK discovery forms, PT-BR aliases, EN aliases, and normalized PT-BR accent/ç forms resolve to Semantic ID before role lookup. Unknown surfaces do not infer meaning from morphology.

Visual blocks preserve `semanticId`, `role`, `familyId`, `surfaceLanguage`, `surfaceForm`, and `children`; changing display language does not mutate semantic identity.

## Verification

- v0.8 tests: **20/20 PASS**
- Mora-Kodin v0.4-v0.7 regression tests: **15/15 PASS**
- generated candidate shortlist: 122/122 unique
- generator WATCH count: 0
- frozen lexemes protected: AHNUVA, EMANU, HAYA, HODERU, KODAN

## Boundary

This implementation validates the architecture and runtime contract. It does not canonize the 122 words, 26 roots, eight morpheme hypotheses, or glyphs. Creator Gate remains required.