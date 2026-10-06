# V2-31 — Actor Movement → Canonical World Update

**Status:** Design approved; implementation not yet authorized.

## Intent

Complete the first causal gameplay loop connecting player movement intent to canonical world state, haKodan semantic evaluation, revisioned target delivery, and Goodle manifestation. Goodle may capture controls and render canonical results, but it must not become the semantic authority for actor position consequences or portal proximity.

## Canonical Loop

`player input → movement intent → canonical world update → haKodan evaluation → canonical target state → HNK Target Envelope revision N → Goodle live delivery → retained Phaser manifestation`

Acceptance example:

`Alakazam x=0 → intent right → canonical x=1 → x=2 → x=3 → proximity enters threshold → haKodan closed→open → revision advances → existing Goodle portal manifestation becomes open`

The browser may display Alakazam moving, but the position used for semantic evaluation is the canonical world position produced by the HNK-side world update.

## Authority Boundary

### Goodle owns

- capture of raw player controls;
- translation of controls into bounded movement intent such as `{actorId,direction}`;
- submission of movement intent to the host/canonical boundary;
- rendering the canonical actor position returned by that boundary;
- delivery/rendering of revisioned target envelopes through the V2-30 pipeline;
- observed visual evidence only after Phaser applies canonical results.

### HNK / haKodan owns

- canonical actor identity and position;
- validation/application of movement intent;
- movement step/rule for this slice;
- canonical world revision/update ordering;
- portal/world coordinates;
- DISTANCE/proximity evaluation;
- threshold semantics;
- portal `closed → open` transition;
- target-envelope revision assignment.

Goodle MUST NOT calculate a portal distance, threshold, proximity classification, or semantic portal transition.

## Movement Intent Contract

The first slice intentionally uses a tiny discrete contract rather than velocity/physics:

```json
{
  "actorId": "alakazam",
  "direction": "right"
}
```

Initial allowed directions are `left | right | up | down`.

Movement intent contains no canonical position. It expresses what the player asked to do, not what the world claims happened.

Unknown actor IDs, unsupported directions, extra keys, malformed values, and executable/callback-bearing extras are rejected before canonical mutation.

## Canonical Movement Rule

For V2-31, an accepted intent moves the canonical actor by exactly one world unit on one axis:

- `right`: `x + 1`
- `left`: `x - 1`
- `down`: `y + 1`
- `up`: `y - 1`

This discrete rule is deliberately HNK-side and deterministic. Speed, acceleration, collision response, delta-time integration, animation timing, and analog input are non-goals.

The world update must be immutable from the caller's perspective: input world/intents are not mutated; a fresh canonical result is produced.

## Canonical World Result

An accepted movement produces a minimal canonical result suitable for orchestration:

```json
{
  "worldRevision": 3,
  "actor": {
    "id": "alakazam",
    "x": 3,
    "y": 0
  }
}
```

The HNK-side orchestration then evaluates the portal using the canonical actor position and existing portal semantics. Target envelope revisioning remains the V2-30 protocol concern; implementation may align target revision with the accepted canonical world revision for this single-stream proof, but must document that decision rather than make Goodle infer it.

## Orchestration Boundary

V2-31 introduces an HNK-side orchestration function/service with this conceptual responsibility:

1. receive current canonical world + validated movement intent;
2. apply one canonical actor movement;
3. increment canonical world revision;
4. evaluate portal proximity using the resulting world;
5. create the revisioned HNK Target Envelope from the evaluated canonical state;
6. return a target-safe result for Goodle containing canonical actor render state plus target envelope.

Conceptual output:

```json
{
  "worldRevision": 3,
  "actor": {"id":"alakazam","x":3,"y":0},
  "targetEnvelope": {
    "schema":"hnk.target-envelope.v1",
    "target":"goodle-browser",
    "kind":"portal-state",
    "revision":3,
    "snapshot":{"id":"portal-1","state":"open"}
  }
}
```

Semantic inputs such as threshold/formula/proximity reasoning remain behind this boundary and are not included in target-safe output.

## Goodle Host Boundary

Goodle exposes a bounded movement-intent submission surface distinct from semantic evaluation. It may be a synchronous host function for deterministic proof, analogous to V2-30 live delivery.

Conceptually:

`window.__HNK_SUBMIT_MOVEMENT_INTENT__(intent)`

The browser proof must not implement the HNK canonical movement rule behind this function. For repository separation, Goodle tests use an injected/mock canonical host adapter whose output shape matches the HNK-side target-safe result. A future transport can replace that adapter without changing Goodle's semantic responsibilities.

## Actor Manifestation

Goodle retains one actor manifestation handle keyed by canonical actor ID. When a canonical host result is accepted:

- the existing Alakazam handle is moved to the returned canonical `x,y`;
- the same handle identity is retained across updates;
- the returned target envelope is passed into the existing V2-30 delivery path;
- the portal handle is likewise retained;
- visual evidence is published only after both required mutations for that accepted result are applied.

Goodle must not visually advance the canonical actor merely because a key was pressed. Raw input may be observed, but canonical position rendering follows host acceptance/result.

## Ordering and Idempotency

Canonical world results carry positive safe-integer `worldRevision`.

For actor rendering:

- newer revision: accept and move retained actor manifestation;
- same revision + identical actor state: duplicate/idempotent, no visual mutation;
- same revision + different actor state: conflict;
- older revision: stale, no rollback.

The target envelope continues to obey V2-30 ordering independently. For the initial single-stream proof, orchestration SHOULD emit matching world/target revisions to simplify causal evidence.

## Evidence Model

The browser proof should be able to expose a causal record such as:

```json
{
  "worldRevision": 3,
  "actor": {
    "id":"alakazam",
    "x":3,
    "y":0,
    "renderedRevision":3,
    "rendered":true
  },
  "portal": {
    "id":"portal-1",
    "acceptedRevision":3,
    "renderedRevision":3,
    "canonicalState":"open",
    "visualState":"open",
    "rendered":true
  }
}
```

This is evidence of canonical results being manifested, not evidence that Goodle calculated why the portal opened.

## Safety and Validation

- movement intent exact-key validation is mandatory;
- canonical actor result exact validation is mandatory at the Goodle boundary;
- revisions must be positive safe integers;
- no callbacks/functions from untrusted input are executed;
- caller-owned objects are not mutated;
- invalid intent cannot partially mutate canonical world state;
- stale/conflicting canonical results cannot visually roll back actor state;
- target-envelope validation remains delegated to the V2-30 validator;
- no semantic coordinates/threshold formula leak is added to target envelope;
- no cross-repository runtime import is introduced.

## Success Criteria

V2-31 is structurally complete when evidence/tests demonstrate:

1. Starting with Alakazam at `(0,0)`, three accepted `right` intents yield canonical positions `(1,0)`, `(2,0)`, `(3,0)` with increasing world revisions.
2. The HNK-side evaluator uses each resulting canonical position, not a Goodle-computed position.
3. Entering the existing portal threshold causes haKodan to produce canonical `open` state and a newer target envelope.
4. Goodle reuses the same Alakazam Phaser handle across canonical movement updates.
5. Goodle reuses the same Portal Phaser handle across the resulting V2-30 updates.
6. Duplicate/stale/conflicting actor results do not create visual rollback or duplicate manifestation.
7. Key/input capture alone does not advance canonical rendered actor position without a host result.
8. Goodle contains no portal distance/threshold/proximity/transition rule.
9. Target-safe orchestration output does not leak semantic inputs.
10. No local machine, CI runner, Vercel, networking, persistence, or cross-repository runtime dependency becomes required for semantic correctness.

## Non-goals

- continuous/analog movement;
- acceleration, velocity, gravity, collision, navmesh, physics engine authority;
- actor animation set or model polish;
- camera following;
- networking, multiplayer, reconciliation, prediction, rollback netcode;
- persistence;
- generalized ECS;
- multiple actors controlled simultaneously;
- generalized interaction system;
- animated portal opening.

## Verification Policy

Structural implementation/review and executed certification remain separate. If an executor is unavailable or jobs terminate before steps, record `UNEXECUTED-INFRA`; never reinterpret it as PASS or product FAIL.

## Next Gate

After approval of this written spec, create the V2-31 TDD implementation plan. The plan must coordinate HNK-side movement intent validation/world orchestration with Goodle-side canonical actor reflection and reuse the existing V2-30 target-delivery path without duplicating semantic authority.