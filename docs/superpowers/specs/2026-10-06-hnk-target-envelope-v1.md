# HNK Target Envelope v1 — Design Specification

**Status:** Proposed, design approved; implementation not yet authorized
**Date:** 2026-10-06
**Scope:** HNK-KODE/haKodan → transport-agnostic boundary → Goodle Browser

## 1. Intent

Close the final manual link between canonical haKodan world state and Goodle Browser manifestation without coupling either repository to the other's implementation.

The bridge must preserve the existing authority boundary: haKodan decides gameplay semantics; Goodle receives an already-decided target snapshot and only validates, reflects, renders, and exposes observable evidence.

## 2. Existing authority chain

The implemented chain before this specification is:

`world input → DISTANCE → proximity threshold → portal closed/open → toPortalTargetSnapshot() → {id,state}`

On the target side the implemented chain is:

`host portal input → validation → reflection → Phaser manifestation → browser evidence`

The missing link is a stable, versioned, serializable contract between those chains.

## 3. Chosen architecture

Introduce **HNK Target Envelope v1** as a transport-agnostic JSON-compatible envelope.

Neither repository imports runtime code from the other. The envelope is the protocol boundary. Transport is deliberately outside v1: a host may deliver the JSON-compatible value through an in-process bootstrap value, file, HTTP, `postMessage`, or another mechanism later without changing gameplay semantics or target reflection.

### Canonical v1 shape

```json
{
  "schema": "hnk.target-envelope.v1",
  "target": "goodle-browser",
  "kind": "portal-state",
  "snapshot": {
    "id": "portal-1",
    "state": "open"
  }
}
```

Exact v1 constants:

- `schema`: `hnk.target-envelope.v1`
- `target`: `goodle-browser`
- `kind`: `portal-state`
- `snapshot.id`: non-empty string
- `snapshot.state`: exactly `closed` or `open`

## 4. Producer responsibility — HNK-KODE

HNK-KODE remains semantic authority.

The producer consumes the already-evaluated result of `evaluatePortalProximityState()` through the existing `toPortalTargetSnapshot()` boundary and wraps that minimal snapshot in the v1 envelope.

The producer MUST NOT place any of the following in the target envelope:

- actor or portal coordinates;
- distance formula or evaluated distance;
- proximity threshold;
- proximity boolean;
- transition decision logic;
- dormant formula branches;
- executable callbacks/functions.

The target receives the result of the decision, never the ingredients required to make the decision again.

## 5. Consumer responsibility — Goodle Browser

Goodle validates the envelope before manifestation.

The consumer MUST:

1. require the exact v1 schema, target, kind, and exact envelope keys;
2. validate the snapshot as `{id,state}`;
3. reject missing, unknown, malformed, or future-version envelopes rather than guessing a fallback;
4. pass only the validated snapshot into the existing `HakodanPortalInput` / reflection path;
5. preserve `canonicalState === visualState` for this slice;
6. never infer proximity, coordinates, threshold, or a state transition.

The consumer MUST NOT silently default a missing envelope to either `closed` or `open`.

## 6. Transport boundary

V1 defines a payload contract, not a network protocol.

The first executable integration uses a host-supplied JSON-compatible bootstrap value. No HTTP service, queue, database, Supabase table, GitHub Action, local daemon, or cross-repository package dependency is required.

This keeps execution independent of external infrastructure and allows transport to evolve separately.

## 7. Exact-key and execution-safety rules

Both sides treat the envelope as data only.

V1 accepts only the documented keys at each protocol object boundary. Unknown envelope or snapshot keys are rejected. Functions/callbacks are not valid JSON-compatible protocol values and must never be executed as part of validation or reflection.

The producer returns fresh protocol objects. Consumer validation/reflection must not mutate caller-owned envelope or snapshot objects.

## 8. Evidence

Goodle's existing browser proof remains the observable endpoint.

For a valid `portal-state` envelope, the published proof must make it possible to verify:

- received portal id;
- canonical state;
- visual state;
- manifestation identifier (`portal-open` or `portal-closed`);
- Phaser scene/canvas boot evidence already provided by the browser-proof system.

The proof is observational. It is not semantic authority and cannot change the canonical state.

## 9. Failure behavior

Protocol violations fail closed and explicitly.

Producer-side malformed snapshot/envelope construction: `HAKODAN_TARGET_ENVELOPE_INVALID`.

Consumer-side missing envelope: `GOODLE_HNK_TARGET_ENVELOPE_MISSING`.

Consumer-side malformed, wrong-target, wrong-kind, or unsupported-version envelope: `GOODLE_HNK_TARGET_ENVELOPE_INVALID`.

Existing snapshot-state validation may retain `GOODLE_HAKODAN_PORTAL_STATE_INVALID` after a valid envelope has been unpacked.

## 10. Non-goals for v1

V1 does not introduce:

- bidirectional synchronization;
- live networking;
- persistence;
- authentication/authorization;
- event queues;
- multiple entities in one envelope;
- multiple target types;
- schema negotiation;
- browser-side gameplay evaluation;
- a shared cross-repository runtime package.

Those require separate designs if later needed.

## 11. Compatibility and evolution

Version is carried in `schema`, not inferred from repository versions.

Consumers reject unsupported schema versions. A future v2 may add capabilities without changing the meaning of v1. The v1 producer and consumer remain independently deployable as long as they agree on the protocol values above.

## 12. Acceptance criteria

The slice is complete when:

1. HNK-KODE can transform an evaluated portal result into the exact v1 envelope without leaking semantic inputs.
2. Goodle Browser can validate that envelope and obtain exactly `{id,state}` for the existing portal reflection path.
3. The same `open` envelope results in `canonicalState=open`, `visualState=open`, and `manifestation=portal-open` evidence.
4. The same `closed` envelope results in `canonicalState=closed`, `visualState=closed`, and `manifestation=portal-closed` evidence.
5. Missing, malformed, wrong-target, wrong-kind, extra-key, and unsupported-version payloads are rejected explicitly.
6. Neither repository imports runtime source code from the other.
7. No external service or local-only infrastructure is required for the contract to operate.
8. CI/runner availability remains a certification concern, not a semantic dependency of the bridge.
