# M7 — Target Capability Registry

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Purpose

M6 proves that an explicit Goodle manifestation plan can cross into the existing haKodan Universal Manifestation Graph while preserving semantic identity and the MANIFEST authority gate.

M7 adds the missing support boundary: an explicit request is not automatically a supported request.

## Rule

A TARGET / FORMAT / ADAPTER / ARTIFACT combination is supported only when a capability entry explicitly registers the target, format, adapter and artifact pattern.

No heuristic target selection is permitted in this gate.

## Registry states

- `SUPPORTED` — exact target/format/adapter entry exists and artifact matches its declared pattern.
- `UNSUPPORTED` — no exact registered capability exists or the artifact does not match.

## Authority

Target adapters are manifestation consumers. They are not semantic authorities.

Registry entries record authority explicitly. Current migration policy expects canonical manifestation authority to remain haKodan/HNK-KODE, not Goodle and not the target itself.

## Implementation

- `packages/goodle/src/target-capability-registry.mjs`
- `packages/goodle/test/target-capability-registry.test.mjs`
- export from `packages/goodle/src/index.mjs`

The registry starts empty by design. Web/React/Phaser/HNK-VERSE/TEHKNE-OS capabilities must be added from source-backed adapter contracts, not assumptions.

## Next gate — M8

Populate the registry from actual adapters/targets already present across HNK repositories, classifying each candidate as:

- EXECUTABLE
- DECLARED
- PLANNED
- UNRESOLVED

Only EXECUTABLE combinations should become runtime-supported registry entries. DECLARED/PLANNED entries may remain metadata but must not be advertised as executable capability.
