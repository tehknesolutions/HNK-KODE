# haKodan — GDD / Experience & World Capability Design

Version: Acceleration V1
Date: 2026-10-02

## Purpose

This GDD defines the interaction/world capability slice used to prove haKodan as a manifestation system. It does not redefine the HNK-KODE language authority or claim that haKodan is only a game engine.

## Core playable/executable grammar

The minimum world grammar is:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION`

This grammar is the Golden Path because it can represent a minimal interactive experience while exercising identity, state, causality and runtime behavior.

## WORLD

A World is the execution/manifestation context that contains entities and provides the scope in which events/actions can resolve. It must retain stable semantic identity and provenance through AST/HOM/HNK-IR.

## ENTITY

An Entity is an addressable object with identity and optional state, properties, components, relations, behaviors, events, narrative, assets and presentation metadata.

## PROPERTY

A Property is typed state attached to an addressable semantic object. Property reads/writes must respect the canonical type and addressing contracts.

## EVENT

An Event expresses causality. Event dispatch resolves deterministically to an ordered action plan under the event/dispatch contract.

## ACTION

An Action is executable intent within the runtime contract. An action can only count as executed when the selected target/runtime returns actual execution evidence; planning or artifact generation is insufficient.

## Golden Path scenario

The acceptance scenario should remain deliberately small:

1. Create one World.
2. Add one Entity.
3. Give the Entity at least one typed Property.
4. Define one Event.
5. Bind one Action to that Event.
6. Lower the same semantics from supported PT-BR and EN surfaces to equivalent canonical structures.
7. Compile/lower through HOM and HNK-IR.
8. Select one genuinely supported target.
9. Generate the target artifact.
10. Execute/render the artifact.
11. Make the resulting state/behavior visibly inspectable.
12. Capture execution evidence and provenance.

The exact visual theme/content of the scenario is not canonized by this document; implementation may use the simplest repository-supported demonstration without inventing product lore.

## Runtime interaction rules

- Object/property/component addresses are stable semantic addresses.
- Event lookup and action ordering are deterministic.
- Payload/type violations fail closed.
- Unsupported runtime actions trap/fail explicitly rather than pretending success.
- Runtime traps remain serializable and provenance-aware.
- Target-specific behavior may implement semantics but cannot redefine them.

## Representation convergence

Visual, Standard and Pro authoring must converge on the same semantic IDs and HNK-IR. A block/glyph/text projection is a representation, not a separate gameplay/runtime authority.

## Manifestation families

The Golden Path starts with one executable target. Later world/experience expansion may include Web, App, Game, World and UI adapters. Each family advances independently according to capability evidence.

## UX loop

The intended Studio loop is:

`CREATE → INSPECT → MANIFEST → PREVIEW/RUN → OBSERVE RESULT → TRACE EVIDENCE → EDIT`

The creator should be able to inspect both the authored representation and the manifestation state without needing to understand every internal provenance layer.

## Failure UX

Failures should distinguish at least:
- semantic/parse failure;
- unresolved token/canon failure;
- type/address failure;
- unsupported target/capability;
- adapter/artifact failure;
- runtime trap;
- execution unavailable/unverified.

No generic “success” state may hide these distinctions.

## Expansion after Golden Path

Once the vertical slice is real, expand in this order unless evidence changes priorities:
1. multiple entities and relations;
2. components/systems;
3. richer event payloads and action composition;
4. assets/presentation;
5. visual graph round-trip;
6. additional real targets;
7. richer game/world runtime capabilities.

## Acceptance boundary

This GDD is satisfied for Acceleration V1 when the Golden Path can be authored, lowered, manifested and visibly executed through one real target while preserving semantic identity and truthful execution evidence.
