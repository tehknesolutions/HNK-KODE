# M8 — Source-backed Target Capability Inventory

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Purpose

M7 created a fail-closed capability registry. M8 populates it only from target evidence found in HNK repositories.

Classification vocabulary:

- `EXECUTABLE` — source contains an implemented runtime/rendering path suitable for capability registration.
- `DECLARED` — application/target exists in source metadata, but no Goodle→haKodan manifestation adapter is proven here.
- `PLANNED` — architecture/specification describes the target but executable implementation is not established.
- `UNRESOLVED` — evidence is insufficient to bind a safe executable capability.

Only `EXECUTABLE` entries are promoted into the runtime registry.

## Inventory baseline

### HNK-VERSE reference avatar runtime — EXECUTABLE

Evidence:
- `tehknesolutions/HNK-VERSE/packages/renderer/src/reference-avatar-runtime.ts`
- renderer/runtime source implements a concrete reference-avatar runtime path.

Registered capability:
- target: `hnk-verse-reference-avatar`
- format: `runtime-frame`
- adapter: `hnk-verse:reference-avatar`
- artifact pattern: `*.frame`

### HNK-VERSE web shell — EXECUTABLE

Evidence:
- `tehknesolutions/HNK-VERSE/apps/web/src/main.ts`
- web application has an executable entrypoint consuming HNK-VERSE rendering/runtime code.

Registered capability:
- target: `hnk-verse-web`
- format: `html`
- adapter: `hnk-verse:web-shell`
- artifact pattern: `*.html`

### CODEX-HNK web — DECLARED

Evidence:
- `tehknesolutions/codex-hnk/apps/web/package.json`
- Next/web application exists, but this gate does not establish a canonical Goodle→haKodan manifestation adapter.

Not promoted to executable registry.

### CODEX-HNK mobile — DECLARED

Evidence:
- `tehknesolutions/codex-hnk/apps/mobile/app.json`
- mobile application target exists, but canonical manifestation adapter is not established in this gate.

Not promoted to executable registry.

### TEHKNE-OS — UNRESOLVED

Evidence:
- `tehknesolutions/tehkne-os/README.md`

The repository establishes the project/system context, but M8 does not have sufficient source evidence to register a concrete manifestation adapter safely.

Not promoted to executable registry.

## Authority rule

Inventory entries never make the target the semantic authority. Registered executable capabilities retain `HAKODAN` authority at the Goodle/haKodan boundary.

## Implementation

- `packages/goodle/src/target-capability-inventory.mjs`
- `packages/goodle/test/target-capability-inventory.test.mjs`
- export from `packages/goodle/src/index.mjs`

## Verification

The test contract was committed before the production inventory module. Fresh executable CI evidence is still required before marking M8 VERIFIED.

## Next gate — M9

Bind `bridgeToHakodanManifestation()` to the executable registry so an explicit but unsupported target combination is rejected before canonical UMG planning. Then add CI for the Goodle migration suite and capture runner evidence for M6–M9.
