# M5 — Goodle Manifestation Intent → haKodan Manifestation Planning

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Decision

Goodle does not create a second manifestation graph, HOM, VM or semantic graph.

Goodle remains the creator-facing orchestration/model layer. haKodan remains canonical execution and manifestation authority.

```text
Goodle Creator Model
        ↓
Goodle → haKodan Adapter
        ↓
HOM
        ↓
HNK-IR
        ↓
Universal Manifestation Graph
        ↓
haKodan Runtime / Target Adapter
        ↓
Artifact
```

## Problem

`GoodProjeto.manifestacao` currently expresses creator intent using the vocabulary:

- `visual`
- `interativa`
- `sistema`
- `hibrida`

Those values do not, by themselves, specify a canonical manifestation target, output format, adapter or artifact. Inferring those fields would manufacture semantics that the creator did not provide.

## Contract

M5 therefore introduces a narrow boundary:

1. Preserve `GoodProjeto.manifestacao` as **manifestation intent**.
2. Never infer `target`, `format`, `adapter` or `artifact` from the intent kind alone.
3. Return `UNMAPPED` for unknown manifestation kinds.
4. Return `UNRESOLVED` when canonical planning fields are incomplete.
5. Return `PLANNED` only when target, format, adapter and artifact are explicit.
6. Preserve `semanticId` when provided; manifestation must not mint a replacement semantic identity.
7. The resulting plan is an adapter input toward haKodan manifestation authority; it is not a competing Goodle manifestation graph.

## State model

```text
Goodle manifestacao
      ↓
INTENT_ONLY
      ↓ + explicit target/format/adapter/artifact
PLANNED

unknown kind → UNMAPPED
incomplete canonical details → UNRESOLVED
```

## Implementation

- `packages/goodle/src/manifestation-intent.mjs`
- `packages/goodle/test/manifestation-intent.test.mjs`

## Verification discipline

The tests were authored before the implementation contract, following the repository's migration testing discipline. No claim of PASS is made here because this change has not yet been executed by a fresh runner in this session.

## Next gate

M6 should connect the planned request to the existing haKodan Universal Manifestation Graph contract, with an explicit adapter that validates semantic identity/provenance and refuses unsupported target/format/adapter combinations rather than inventing them.
