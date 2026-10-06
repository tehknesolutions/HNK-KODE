# V2-32 — Canonical Interaction / Portal Entry

**Status:** Design initiated; implementation not yet authorized.

## Goal

Extend the V2-31 causal loop from portal proximity/opening to a canonical interaction and portal-entry transition without allowing Goodle to become semantic authority.

## Causal Loop

`player input → interaction intent → HNK canonical validation → portal interaction evaluation → canonical world transition → revisioned Target Envelope → Goodle manifestation`

The first proof is intentionally discrete:

`Alakazam enters portal threshold → player presses interact → HNK validates portal interaction → world transition becomes canonical → Goodle manifests the new world/portal state`

## Authority

### Goodle owns
- capture of an interaction key;
- translation into a bounded interaction intent;
- submission of that intent to the canonical host;
- rendering the canonical result;
- retained visual identity of actor/portal/world manifestations.

### HNK / haKodan owns
- actor identity and canonical position;
- portal identity and canonical state;
- whether the actor is eligible to interact;
- proximity/entry eligibility;
- interaction transition;
- destination/world-state selection;
- canonical world revision;
- Target Envelope revision.

Goodle MUST NOT calculate portal eligibility, distance, threshold, destination, or transition semantics.

## Interaction Intent

Initial exact shape:

```json
{
  "actorId": "alakazam",
  "interaction": "enter",
  "targetId": "portal-1"
}
```

Only `interaction: "enter"` is in scope for the first slice.

The intent contains identity and requested action, not position, distance, threshold, destination, or next-world coordinates.

Unknown actors, unknown targets, unsupported interactions, malformed values, extra keys, and accessor-bearing extras MUST be rejected without evaluating forbidden accessors.

## Canonical Eligibility

Eligibility is evaluated exclusively from canonical HNK state.

Conceptually:

`actor canonical position + portal canonical position/state + existing proximity semantics → eligible / ineligible`

The implementation MUST reuse existing haKodan proximity semantics rather than duplicate them in Goodle.

An ineligible interaction MUST NOT mutate canonical world state or increment the world revision.

## Canonical Entry Transition

For the first proof, an eligible `enter` interaction produces one deterministic canonical transition.

The transition result MUST identify:
- accepted interaction revision;
- actor identity;
- target portal identity;
- resulting canonical world revision;
- resulting canonical portal/world state;
- revision-aligned Target Envelope.

The destination/world transition payload must remain target-safe. Semantic reasoning used to derive it MUST NOT leak into the Goodle envelope.

## Revision and Ordering

For this single-stream proof:

`interactionRevision === resultingWorldRevision === targetEnvelope.revision`

Rules:
- stale interaction result: ignored;
- same revision + identical result: duplicate;
- same revision + different result: conflict;
- newer accepted result: applied once;
- rejected interaction: no world revision increment.

Goodle must never visually transition on raw key capture.

## Goodle Manifestation

Goodle retains the existing Alakazam and Portal handles.

For an accepted canonical entry:
1. actor manifestation remains the same identity;
2. portal manifestation remains the same identity unless the canonical result explicitly requires a new world instance;
3. the target envelope enters the existing V2-30 delivery path;
4. visual evidence is emitted only after accepted canonical mutation.

No local fallback destination is permitted.

## First Acceptance Scenario

Canonical initial state:

- Alakazam: `(3,0)`
- Portal: `portal-1`
- Portal state: `open`
- actor is inside the existing interaction eligibility range.

Input:

`Enter`

Expected causal result:

`interaction intent → accepted by HNK → canonical entry transition → worldRevision N+1 → Target Envelope revision N+1 → Goodle manifests transition`

The exact destination/world representation is deliberately left to the existing HNK canonical model; this spec does not invent a destination identifier where the current model does not provide one.

## Safety

- exact-key validation;
- no mutation before validation;
- no caller-owned input mutation;
- no execution of accessor-bearing forbidden keys;
- safe-integer revisions;
- stale/conflict protection;
- no semantic threshold/distance/destination logic in Goodle;
- no cross-repository runtime imports;
- no dependency on local machines, Vercel, networking, persistence, or CI availability for semantic correctness.

## Non-goals

- multiplayer;
- networking;
- physics;
- continuous collision detection;
- inventory;
- quests;
- cutscenes;
- animated loading screens;
- generalized interaction verbs;
- multiple portal types;
- procedural destinations;
- persistence.

## Promotion Boundary

V2-32 MUST NOT modify the unmerged V2-31 branch merely to make progress. Its implementation branch should be based on the latest `main` and consume V2-31 only after V2-31 is promoted, or be explicitly stacked if the promotion is still pending.

## Next Gate

Write the V2-32 TDD implementation plan only after this specification is approved. Then implement HNK interaction validation/orchestration first, followed by Goodle interaction input and retained manifestation.
