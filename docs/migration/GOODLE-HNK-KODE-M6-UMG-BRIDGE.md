# M6 — Goodle Manifestation Plan → haKodan Universal Manifestation Graph

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Source-grounded target

haKodan v0.9 already implements the canonical manifestation boundary in `packages/hakodan/src/manifestation-graph-v0.9.mjs`.

Its required dimensions are exactly:

- `target`
- `format`
- `adapter`
- `artifact`

`planManifestation(request, actor)` validates those dimensions, requires the `MANIFEST` capability, preserves `semanticId`, emits stage `PLAN`, keeps `executed=false`, and attaches provenance from `MANIFESTATION_GRAPH`.

M6 therefore does not create a Goodle manifestation graph.

## Bridge

```text
GoodProjeto.manifestacao
        ↓
M5 Manifestation Intent
        ↓
Goodle explicit plan
        ↓
M6 bridge
        ↓
haKodan planManifestation()
        ↓
Universal Manifestation Graph authority
```

## Rules

1. M5 must first return `PLANNED`.
2. `semanticId` is additionally required before crossing the canonical boundary.
3. The bridge forwards only `semanticId`, `target`, `format`, `adapter`, and `artifact`.
4. haKodan remains responsible for validation, MANIFEST authorization and canonical provenance.
5. A returned semantic ID different from the input is treated as identity drift and rejected.
6. Incomplete Goodle intent returns `UNRESOLVED` without calling haKodan.
7. Unknown Goodle manifestation intent remains `UNMAPPED`.
8. The bridge does not infer target combinations or mint semantic identities.

## Authority

The existing haKodan authority module defines `MANIFEST` as a capability. M6 intentionally preserves that gate rather than implementing a Goodle-side bypass.

## Implementation

- `packages/goodle/src/manifestation-bridge.mjs`
- `packages/goodle/test/manifestation-bridge.test.mjs`
- exports from `packages/goodle/src/index.mjs`

## Verification

Tests were committed before production implementation. A fresh executable runner result is still required before marking M6 VERIFIED.

## Next gate — M7

Target capability registry and supported-combination validation.

The next adapter must answer a narrower question before UMG planning:

> Is this explicit TARGET / FORMAT / ADAPTER / ARTIFACT combination actually registered and supported?

M7 must use a registry/contract rather than heuristics. Web, React, Phaser, HNK-VERSE, TEHKNE-OS and future targets must remain adapters/consumers, never semantic authorities.
