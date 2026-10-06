# V2-30 — Live World State Reflection

**Status:** Design approved; implementation not yet authorized.

## Intent

Move the HNK-KODE → Goodle integration from a one-shot canonical snapshot proof to a live, ordered reflection channel. haKodan remains the sole semantic authority. Goodle receives successive canonical target envelopes and updates an already-running Phaser manifestation without recalculating gameplay semantics or restarting the Scene.

## Canonical Flow

`world input → haKodan evaluation → HNK Target Envelope v1 → host delivery → Goodle validation → identity/version gate → reflection update → existing Phaser object mutation → browser evidence`

Example sequence:

`portal-1 closed @ revision 1 → portal-1 closed @ revision 2 → portal-1 open @ revision 3`

Goodle may reflect this sequence visually, but it MUST NOT infer why revision 3 is open.

## Authority Boundary

### haKodan owns

- coordinates and world input;
- DISTANCE/proximity evaluation;
- threshold rules;
- `closed → open` semantic transition;
- canonical entity state;
- monotonic update revision assigned before target delivery.

### Goodle owns

- envelope validation;
- target identity lookup;
- ordering/staleness checks using the supplied revision;
- idempotent visual reflection;
- mutation/reuse of the existing Phaser manifestation;
- observed browser evidence after rendering.

Goodle MUST NOT calculate distance, threshold, proximity, or a gameplay transition.

## Protocol Evolution

V2-30 extends the target envelope for live delivery with a monotonic `revision` field. The semantic snapshot remains minimal:

```json
{
  "schema": "hnk.target-envelope.v1",
  "target": "goodle-browser",
  "kind": "portal-state",
  "revision": 3,
  "snapshot": {
    "id": "portal-1",
    "state": "open"
  }
}
```

`revision` is transport/order metadata, not gameplay state. It MUST be a positive safe integer and MUST increase for successive accepted updates of the same target stream.

Because the current v1 exact-key validator rejects additional keys, implementation MUST deliberately evolve producer and consumer together and update the shared protocol fixture. No consumer may silently accept both shapes without an explicit compatibility decision in the implementation plan.

## Runtime State Machine

For each manifested target ID, Goodle tracks only reflection metadata:

- `lastAcceptedRevision`;
- `canonicalState` last accepted;
- handle/reference to the existing Phaser manifestation;
- `renderedRevision` after the visual update has actually been applied.

### First delivery

If `portal-1` is not manifested, create one Phaser manifestation from the canonical state and record the accepted revision.

### Newer delivery

If `revision > lastAcceptedRevision`, accept it. Reuse the same manifestation and update only the visual properties required by the new canonical state.

### Duplicate delivery

If `revision === lastAcceptedRevision` and the canonical snapshot is identical, treat it as idempotent. Do not recreate the Phaser object and do not increment observed-update evidence.

If the same revision carries different canonical data, reject it as a protocol conflict.

### Stale delivery

If `revision < lastAcceptedRevision`, reject/ignore it as stale and do not roll back the visual manifestation. The result must be observable as a rejected stale update, not silently presented as newly rendered state.

## Identity Rule

Updates are keyed by canonical `snapshot.id`. An update for `portal-1` MUST NOT mutate, recreate, or change evidence for `portal-2`.

The initial implementation MAY support only portal manifestations, but its identity semantics must not assume there is only one object in the world.

## Phaser Manifestation

The current browser proof creates a visual once during `Scene.create()`. V2-30 introduces a retained portal visual handle so updates modify the existing object's appearance instead of restarting the Scene.

Required observable behavior:

- `closed → closed`: same object identity, no semantic transition invented, no recreation;
- `closed → open`: same object identity, visual changes to open;
- `open → open`: same object identity, idempotent visual state;
- stale `open → closed` envelope: rejected; visual remains open.

No animation system is required in V2-30. The first implementation changes stable visual properties only. Animated opening can be a later slice.

## Evidence Model

Evidence must distinguish received, accepted, and actually rendered state.

For an accepted/rendered update, browser evidence includes at minimum:

```json
{
  "id": "portal-1",
  "receivedRevision": 3,
  "acceptedRevision": 3,
  "renderedRevision": 3,
  "canonicalState": "open",
  "visualState": "open",
  "manifestation": "portal-open",
  "rendered": true
}
```

`rendered:true` MUST only be published after the existing Phaser manifestation has been created or updated successfully. Pure adapters and pre-render intent MUST remain `rendered:false` or omit observed-render claims.

For duplicate/stale/conflicting deliveries, evidence must record the disposition without claiming a new render.

## Host Delivery Boundary

V2-30 does not introduce HTTP, WebSocket, Supabase, queues, Actions, or a daemon. The runtime exposes a bounded host-facing delivery function/channel that accepts an unknown envelope value while the browser proof is running.

The exact browser mechanism is selected in the implementation plan after inspecting the existing proof bootstrap. Preferred property: synchronous/in-process delivery suitable for deterministic tests, with later transports able to call the same boundary.

## Safety / Validation

- Exact-key validation remains mandatory.
- Unsupported schema/target/kind is rejected.
- Missing/invalid revision is rejected.
- Extra semantic fields are rejected rather than ignored.
- No callback/function from the envelope is executed.
- Caller-owned envelopes/snapshots are not mutated.
- Same-revision/different-payload is a conflict.
- Stale updates cannot roll back manifested state.
- Browser target has no access to semantic inputs needed to recompute proximity.

## Success Criteria

V2-30 is structurally complete when tests/spec evidence demonstrate:

1. A running target accepts an ordered `closed@1 → closed@2 → open@3` sequence.
2. The same Phaser manifestation identity is retained across accepted updates.
3. `open@3 → open@3` identical duplicate is idempotent.
4. `open@3 → closed@3` is rejected as conflict.
5. `open@3 → closed@2` is rejected as stale and cannot visually roll back the portal.
6. An update for another portal ID does not mutate `portal-1`.
7. Evidence separates received/accepted/rendered revisions and never claims rendering before Phaser applies it.
8. No proximity/distance/threshold/transition authority appears in Goodle.
9. No cross-repository runtime import or external infrastructure dependency is introduced.

Executed browser/test certification remains a promotion gate when an executor is available. `UNEXECUTED-INFRA` remains distinct from PASS and product FAIL.

## Non-goals

- player movement/input;
- animated portal opening;
- networking or persistence;
- multi-client synchronization;
- rollback/reconciliation of canonical world state;
- Goodle-side gameplay rules;
- general ECS/world architecture;
- replacing HNK Target Envelope with a transport-specific protocol.

## Next Gate

After review/approval of this spec, produce a TDD implementation plan covering coordinated HNK-KODE producer evolution, Goodle exact validation, retained Phaser manifestation updates, live host delivery, evidence, protocol fixture migration, and whole-slice review.