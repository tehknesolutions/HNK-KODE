# V2-33 — Canonical World Transition Resolution

Status: SPECIFICATION / SOURCE-LOCK
Authority: HNK / haKodan
Consumer: Goodle Browser
Predecessor: V2-32 Canonical Interaction / Portal Entry

## 1. Goal

Extend the accepted V2-32 portal-entry interaction into an explicit canonical world-transition decision without moving authority into Goodle.

Causal chain:

```
player input
→ bounded interaction intent
→ HNK canonical validation
→ portal-entry eligibility
→ canonical transition resolution
→ revisioned canonical world result
→ target envelope
→ Goodle manifestation
```

## 2. Authority boundary

HNK owns:
- whether a transition exists;
- whether it is allowed;
- the canonical transition result;
- world revision advancement;
- any canonical destination identity, but only when a destination model is explicitly introduced by an authoritative HNK source.

Goodle owns:
- submitting bounded intent;
- ordering received canonical results;
- rejecting stale/duplicate/conflicting delivery;
- manifesting only fields supplied by HNK.

Goodle MUST NOT:
- calculate destination;
- infer a world, scene, map, portal destination, route or callback;
- infer transition semantics from coordinates or portal state;
- advance canonical revisions.

## 3. Source-lock rule

The current V2-32 model does not define a canonical destination/world identifier.

Therefore V2-33 MUST NOT invent `destinationId`, `worldId`, `sceneId`, map names, routes, callbacks, coordinates, loading targets, or teleport semantics.

Until an authoritative destination model exists, transition resolution may establish only that an accepted canonical transition occurred and bind that fact to the same canonical revision.

## 4. First proof

Given the established V2-32 proof:

```
Alakazam enters portal threshold
→ player presses interact
→ HNK validates portal interaction
→ portal entry is accepted
```

V2-33 proves:

```
accepted portal entry
→ HNK emits canonical transition resolution
→ transition revision == world revision == target envelope revision
→ Goodle receives the resolution
→ Goodle manifests only canonical supplied state
```

No destination is fabricated.

## 5. Canonical transition contract

Minimum transition resolution:

```js
{
  occurred: true,
  kind: "portal-entry",
  actorId: "alakazam",
  targetId: "portal-1",
  transitionRevision: <safe positive integer>
}
```

Exact-key validation is required at the HNK boundary.

The transition resolution MUST be derived from an accepted canonical interaction result, never from raw player input.

## 6. Revision invariant

For an accepted transition:

```
interactionRevision
=== transitionRevision
=== worldRevision
=== targetEnvelope.revision
```

No secondary revision stream is introduced.

Rejected interaction:
- produces no transition;
- does not increment revision;
- does not mutate canonical world state.

Overflow MUST be rejected before mutation.

## 7. Ordering and atomicity

Goodle must preserve the V2-32 ordering guarantees:
- stale canonical results do not mutate manifestation;
- duplicate identical results are satisfied without re-mutation;
- same-revision conflicts are rejected;
- a world/transition delivery cannot partially mutate actor/portal/transition manifestation.

Transition evidence is not authoritative state. It is a reflection of HNK authority.

## 8. Security / boundedness

Neither HNK nor Goodle may evaluate unrelated enumerable accessors while projecting the bounded transition result.

Returned/public transition objects contain only the explicit transition contract.

No callbacks, executable payloads, formulas, derivation metadata, internal portal geometry, thresholds, distances or inferred destinations cross the boundary.

## 9. TDD gates

HNK:
1. accepted V2-32 interaction yields exact transition contract;
2. revision invariant is exact;
3. rejected interaction yields no transition;
4. overflow is atomic;
5. extra/accessor-bearing fields do not leak or execute;
6. no destination-like field exists without an authoritative source.

Goodle:
1. exact transition result validation;
2. stale/duplicate/conflict ordering;
3. duplicate identical result is satisfied without mutation;
4. conflict does not mutate;
5. actor/portal/transition manifestation is atomic;
6. browser proof exposes transition evidence only after canonical delivery;
7. no destination is inferred.

## 10. Promotion gate

V2-33 may be promoted only when:
- HNK contract is source-locked;
- Goodle contains no transition authority;
- structural review has no unresolved P1/P2 authority or atomicity defects;
- execution status is reported separately and never converted from UNEXECUTED-INFRA into PASS.

## 11. Deferred by design

The following require a future authoritative HNK specification and are NOT part of V2-33:
- destination/world identity;
- scene/map loading;
- spawn coordinates;
- return portals;
- transition animation semantics;
- persistence across worlds;
- network/session migration.
