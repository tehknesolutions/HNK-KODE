# M4 — Runtime + Capability Broker + Provenance

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Source architecture

Goodle documents the creator flow as:

`Intenção → Componentes → Composição → Regras → Eventos → Manifestação → GoodRuntime → Experiência`

and names GoodEngine, GoodRuntime, Capability Broker and Event/Artifact/Provenance as distinct layers.

The Goodle↔HNK-KODE implementation plan additionally requires typed capability grants, fail-closed security, provenance lineage, manifestation projection and no second parser/runtime around HNK-IR.

## Authority split

### Goodle owns

- creator session;
- browser/capability brokerage;
- creator preview orchestration;
- composition-facing runtime envelope.

### haKodan owns

- canonical program execution;
- canonical event evaluation;
- canonical memory semantics.

### Shared / unresolved

- target adapter selection;
- runtime persistence binding.

Unknown ownership remains `UNRESOLVED`; it is not implemented twice.

## Capability Broker

M4 introduces:

- `CapabilityRequest`;
- `CapabilityGrant`.

Default rule:

`NO EXPLICIT GRANT → NO CAPABILITY`

A request starts with `granted=false`. A grant requires explicit authority and non-empty scope.

## Provenance lineage

M4 introduces `ArtifactRef` with explicit authority and parent lineage.

Derivation creates a new artifact; it never mutates the authority of the source artifact.

Example:

`IntentEnvelope(CREATOR) → ExecutionPlan(GOODLE) → GoodleIR(GOODLE) → HNK-IR/haKodan(CANONICAL)`

The lineage records ancestry while authority remains local to each artifact.

## Implemented artifacts

- `packages/goodle/src/runtime-adapter.mjs`
- `packages/goodle/src/capability-broker.mjs`
- `packages/goodle/src/provenance-lineage.mjs`
- `packages/goodle/test/runtime-adapter.test.mjs`
- `packages/goodle/test/capability-broker.test.mjs`
- `packages/goodle/test/provenance-lineage.test.mjs`

## Verification

Tests were authored before their corresponding production modules in this gate. A fresh executable runner result is still unavailable, therefore M4 remains `VERIFICATION PENDING`.

## Next gate — M5

Manifestation Graph + HOM convergence:

1. one semantic identity;
2. multiple manifestation targets;
3. target projections cannot rewrite canonical semantic identity;
4. HOM carries identity/state/components/relations/behaviors/events/narrative/assets/presentation/data/manifestations/provenance;
5. React/Phaser/Web/HNK-VERSE/TEHKNE-OS become manifestation consumers/adapters rather than semantic authorities.
