# V2-32 Canonical Interaction / Portal Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the V2-31 causal loop with an exact portal-entry interaction intent, canonical HNK eligibility/transition, revision-aligned target delivery, and Goodle manifestation without moving semantic authority into the browser.

**Architecture:** HNK-KODE validates `{actorId,interaction,targetId}`, evaluates eligibility from canonical actor/portal state using the existing haKodan proximity semantics, and only then creates a new canonical world revision and interaction result. Goodle validates/orders that canonical result, retains the existing Alakazam and Portal handles, and manifests the accepted entry result through the existing V2-30 target delivery path. The first slice intentionally does not invent a destination ID; it proves canonical entry acceptance/transition while keeping the destination/world representation behind the existing HNK model.

**Tech Stack:** HNK-KODE Node.js ESM + `node:test`; Goodle Browser TypeScript + Vitest + React 19 + Phaser 3.

**Spec:** `docs/superpowers/specs/2026-10-06-v2-32-canonical-interaction-portal-entry.md`

## Global Constraints

- Interaction intent exact shape is `{actorId:"alakazam",interaction:"enter",targetId:"portal-1"}`.
- Only `interaction: "enter"` is in scope.
- Goodle MUST NOT calculate portal eligibility, distance, threshold, destination, or transition semantics.
- HNK MUST reuse existing `evaluatePortalProximityState` semantics rather than duplicate proximity logic.
- An ineligible interaction MUST NOT mutate canonical world state or increment the world revision.
- For the single-stream proof, `interactionRevision === resultingWorldRevision === targetEnvelope.revision`.
- Raw interaction input MUST NOT visually transition the actor/world without an accepted canonical result.
- Existing V2-30 target-envelope validation/delivery is reused rather than duplicated.
- No local fallback destination is permitted.
- No networking, persistence, physics, multiplayer, or external infrastructure is required for semantic correctness.
- Invalid input is rejected before mutation; accessor-bearing extra keys are never evaluated.
- Stale, duplicate, and same-revision conflicting results are explicitly classified.
- Destination/world representation is not invented where the current HNK model does not provide it.

## Review Focus

- Extra/accessor-bearing interaction keys must be rejected without evaluating the accessor.
- Interaction targeting a different portal ID must not mutate the canonical world.
- Ineligible interaction must preserve both world revision and portal state.
- Same-revision interaction results with different canonical entry state must be conflict, never visual mutation.
- Goodle must not synthesize a destination or transition when the canonical host is absent/rejects.

---

### Task 1: Exact HNK interaction-intent validation

**Files:**
- Create: `packages/hakodan/src/interaction-intent.mjs`
- Create: `packages/hakodan/test/interaction-intent-v2.test.mjs`

**Interfaces:**
- Produces: `readInteractionIntent(value, expectedActorId, expectedTargetId)` → fresh `{actorId,interaction,targetId}`.

- [ ] **Step 1: Write failing tests**

Accept exactly `{actorId:"alakazam",interaction:"enter",targetId:"portal-1"}`. Reject null/arrays, missing fields, wrong actor, wrong target, unsupported interaction, extra keys, and accessor-bearing extra keys without executing the accessor. Assert caller input remains unchanged.

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test packages/hakodan/test/interaction-intent-v2.test.mjs`
Expected: FAIL because `interaction-intent.mjs` does not exist.

- [ ] **Step 3: Implement exact validator**

Implement `readInteractionIntent` with exact enumerable-key validation before reading field values. Return a fresh object and throw `HAKODAN_INTERACTION_INTENT_INVALID` for malformed input.

- [ ] **Step 4: Run focused test**

Expected: PASS when an executor is available.

- [ ] **Step 5: Commit**

`git add packages/hakodan/src/interaction-intent.mjs packages/hakodan/test/interaction-intent-v2.test.mjs && git commit -m "feat(hakodan): validate canonical portal interaction intents"`

---

### Task 2: Canonical portal-entry eligibility and transition

**Files:**
- Create: `packages/hakodan/src/canonical-portal-entry.mjs`
- Create: `packages/hakodan/test/canonical-portal-entry-v2.test.mjs`
- Reuse: `packages/hakodan/src/portal-proximity-state.mjs`

**Interfaces:**
- Consumes: canonical `world` plus validated interaction intent.
- Produces: `applyCanonicalPortalEntry(world,intent)` → fresh canonical interaction result.

- [ ] **Step 1: Write failing eligibility tests**

Start with actor `alakazam` at `(3,0)), `portal-1` open at the canonical interaction target. Assert an accepted `enter` produces a canonical entry result without changing the actor coordinates. Assert a different target ID is rejected before mutation.

- [ ] **Step 2: Write failing ineligible test**

Place the actor outside the existing portal threshold or use a closed/non-eligible portal state according to the existing semantics. Assert no world revision increment, no portal mutation, and an explicit rejected/ineligible result.

- [ ] **Step 3: Pin reuse of existing proximity semantics**

The test fixture must use the same portal/actor coordinates and threshold consumed by `evaluatePortalProximityState`; do not introduce a second distance formula.

- [ ] **Step 4: Run focused test and verify RED**

Run: `node --test packages/hakodan/test/canonical-portal-entry-v2.test.mjs`
Expected: FAIL because canonical portal-entry orchestration does not exist.

- [ ] **Step 5: Implement minimal canonical entry**

Implement `applyCanonicalPortalEntry` so validation occurs before any mutation, existing `evaluatePortalProximityState` supplies eligibility, and an eligible `enter` produces a fresh canonical result. Preserve actor position and do not invent a destination ID. The accepted result must identify actor, target portal, accepted/rejected state, and the resulting world revision.

- [ ] **Step 6: Run focused tests**

Expected: PASS when executable.

- [ ] **Step 7: Commit**

`git add packages/hakodan/src/canonical-portal-entry.mjs packages/hakodan/test/canonical-portal-entry-v2.test.mjs && git commit -m "feat(hakodan): apply canonical portal entry"`

---

### Task 3: Canonical interaction world-step and target envelope

**Files:**
- Create: `packages/hakodan/src/canonical-interaction-step.mjs`
- Create: `packages/hakodan/test/canonical-interaction-step-v2.test.mjs`
- Reuse: `packages/hakodan/src/target-envelope.mjs`
- Reuse: `packages/hakodan/src/portal-target-snapshot.mjs`

**Interfaces:**
- Produces: `stepCanonicalInteraction(world,intent)` → target-safe `{interactionRevision,worldRevision,interaction,actor,targetEnvelope}`.
- For the accepted single-stream proof, `interactionRevision === worldRevision === targetEnvelope.revision`.

- [ ] **Step 1: Write failing accepted-flow tests**

With an eligible actor/portal state, submit `enter`. Assert one revision increment and an accepted interaction result. Assert the target envelope revision equals the resulting world revision.

- [ ] **Step 2: Write failing rejection/atomicity tests**

For an ineligible or wrong-target interaction, assert no revision increment and no canonical mutation. Assert the returned rejection cannot be mistaken for an accepted transition.

- [ ] **Step 3: Pin target-safe output**

Assert outer exact keys and reject leakage of `threshold`, `distance`, `formula`, `proximity`, `destination` and callback/function fields. Reuse `toTargetEnvelope` for the existing portal snapshot rather than creating a parallel envelope format.

- [ ] **Step 4: Run focused test and verify RED**

Run: `node --test packages/hakodan/test/canonical-interaction-step-v2.test.mjs`
Expected: FAIL because orchestration does not exist.

- [ ] **Step 5: Implement orchestration**

Validate intent, apply canonical portal entry, increment the revision only for accepted interaction, create the existing revisioned portal Target Envelope, and return a fresh target-safe result. Rejected interactions return a deterministic rejected result without advancing revision.

- [ ] **Step 6: Run V2-32 + existing proximity/envelope regressions**

Expected: PASS when executable.

- [ ] **Step 7: Commit**

`git add packages/hakodan/src/canonical-interaction-step.mjs packages/hakodan/test/canonical-interaction-step-v2.test.mjs && git commit -m "feat(hakodan): orchestrate canonical portal interaction"`

---

### Task 4: Validate and order canonical interaction results in Goodle

**Files:**
- Create: `src/browser-proof/HnkCanonicalInteractionResult.ts`
- Create: `src/browser-proof/HnkCanonicalInteractionResult.test.ts`
- Create: `src/runtime/HakodanLiveInteractionReflection.ts`
- Create: `src/runtime/HakodanLiveInteractionReflection.test.ts`

**Interfaces:**
- `readHnkCanonicalInteractionResult(value)` → fresh validated result.
- `createHakodanLiveInteractionReflection().deliver(result)` → `created | updated | duplicate | stale | conflict`.

- [ ] **Step 1: Write failing validator tests**

Accept an accepted result whose `interactionRevision`, `worldRevision`, and target-envelope revision all equal the same positive safe integer. Reject invalid revisions, mismatched revisions, extra keys, malformed actor/portal identity, and accessor-bearing extras without evaluation.

- [ ] **Step 2: Write failing ordering tests**

Pin newer accepted results, identical same-revision duplicate, same-revision different-result conflict, and older stale result. Rejected interaction results must not become accepted visual transitions.

- [ ] **Step 3: Run focused tests and verify RED**

Run: `npm test -- --run src/browser-proof/HnkCanonicalInteractionResult.test.ts src/runtime/HakodanLiveInteractionReflection.test.ts`
Expected: FAIL because the new validator/reflection modules do not exist.

- [ ] **Step 4: Implement exact validator and per-actor interaction ordering**

Reuse the existing target-envelope validator. Require revision equality for this single-stream proof. Keep ordering state separate from actor movement ordering so V2-31 and V2-32 semantics cannot alias.

- [ ] **Step 5: Run focused tests**

Expected: PASS when executable.

- [ ] **Step 6: Commit**

`git add src/browser-proof/HnkCanonicalInteractionResult* src/runtime/HakodanLiveInteractionReflection* && git commit -m "feat(browser-proof): validate and order canonical portal interactions"`

---

### Task 5: Goodle retained portal-entry manifestation

**Files:**
- Create: `src/browser-proof/HakodanPortalEntryManifestation.ts`
- Create: `src/browser-proof/HakodanPortalEntryManifestation.test.ts`

**Interfaces:**
- Consumes accepted interaction reflection results plus the existing retained actor/portal manifestation handles.
- Produces causal evidence with `rendered:true` only after an accepted canonical transition has been manifested.

- [ ] **Step 1: Write failing manifestation tests**

An accepted canonical entry must reuse the same portal handle and actor handle. Duplicate, stale, conflict, and rejected interaction results must not create a new handle, change the portal, or claim rendered transition evidence.

- [ ] **Step 2: Write no-destination-fabrication test**

Assert that absence of a canonical destination field never causes Goodle to invent a destination/world ID or local navigation target.

- [ ] **Step 3: Run focused test and verify RED**

Run: `npm test -- --run src/browser-proof/HakodanPortalEntryManifestation.test.ts`
Expected: FAIL because the manifestation module does not exist.

- [ ] **Step 4: Implement retained manifestation adapter**

Use injected drawing/transition adapters. The first slice may manifest an accepted entry state/evidence without inventing a destination. Keep the existing Portal Phaser handle identity intact.

- [ ] **Step 5: Run focused test**

Expected: PASS when executable.

- [ ] **Step 6: Commit**

`git add src/browser-proof/HakodanPortalEntryManifestation* && git commit -m "feat(browser-proof): retain canonical portal entry manifestation"`

---

### Task 6: Wire interaction input and compose with V2-31/V2-30

**Files:**
- Create: `src/browser-proof/HnkInteractionInput.ts`
- Create: `src/browser-proof/HnkInteractionInput.test.ts`
- Create: `src/browser-proof/HnkCanonicalInteractionDelivery.ts`
- Create: `src/browser-proof/HnkCanonicalInteractionDelivery.test.ts`
- Modify: `src/browser-proof/main.tsx`

**Interfaces:**
- `interactionIntentForKey("Enter")` → `{actorId:"alakazam",interaction:"enter",targetId:"portal-1"}`.
- `submitInteractionKey(key,host)` → canonical host result; no local semantic fallback.
- `createHnkCanonicalInteractionDelivery(deps).deliver(value)` → causal interaction evidence.

- [ ] **Step 1: Write failing input-boundary tests**

Assert only Enter maps to the exact interaction intent. Raw Enter must not alter Phaser state without an accepted canonical host result. Missing host throws `GOODLE_HNK_CANONICAL_INTERACTION_HOST_MISSING`.

- [ ] **Step 2: Write failing causal-delivery tests**

Accepted canonical interaction must validate, order, manifest, and pass the existing target envelope into the V2-30 delivery exactly once. Duplicate/stale/conflict/rejected interaction results must not redeliver the target.

- [ ] **Step 3: Run focused tests and verify RED**

Run: `npm test -- --run src/browser-proof/HnkInteractionInput.test.ts src/browser-proof/HnkCanonicalInteractionDelivery.test.ts`
Expected: FAIL because the interaction modules do not exist.

- [ ] **Step 4: Implement bounded input and delivery**

Map Enter to intent only. Compose Tasks 4–5 with the existing V2-30 target delivery and V2-31 actor/portal handles. Do not add destination logic to `main.tsx`.

- [ ] **Step 5: Wire the Phaser key handler**

Add the interaction handler alongside the existing movement handler. It must call the canonical host and route the returned result through the interaction delivery pipeline.

- [ ] **Step 6: Publish causal evidence**

Extend `__GOODLE_BROWSER_PROOF__` only with target-safe interaction evidence after accepted manifestation. Preserve the existing V2-30 `hakodan.portal` contract.

- [ ] **Step 7: Run focused browser-proof regression suite**

Run the V2-32 input/delivery/manifestation tests plus the V2-30 browser-proof contract tests and V2-31 movement tests. Expected: PASS when executable.

- [ ] **Step 8: Commit**

`git add src/browser-proof/HnkInteractionInput* src/browser-proof/HnkCanonicalInteractionDelivery* src/browser-proof/main.tsx && git commit -m "feat(browser-proof): wire canonical portal interaction"`

---

### Task 7: Whole-slice authority review and promotion gate

**Files:** No product changes unless review identifies a defect.

- [ ] **Step 1: Review HNK authority**

Confirm only HNK performs eligibility, proximity reasoning, revision increment, interaction transition, and target-envelope revision assignment.

- [ ] **Step 2: Review Goodle semantic absence**

Search the V2-32 diff for distance/threshold/proximity/destination/transition calculations. None may exist.

- [ ] **Step 3: Review rejected interaction atomicity**

Confirm wrong-target/ineligible interactions cannot increment revision or mutate portal state.

- [ ] **Step 4: Review identity retention**

Confirm Alakazam and Portal manifestation handles remain stable through accepted interaction and that rejected/duplicate/stale/conflict results do not mutate them.

- [ ] **Step 5: Review destination non-invention**

Confirm Goodle has no hard-coded destination/world ID and HNK does not invent one where the current canonical model lacks it.

- [ ] **Step 6: Review evidence timing**

`rendered:true` must follow successful canonical result manifestation, never raw Enter capture or validation alone.

- [ ] **Step 7: Review external-infrastructure independence**

No local machine, CI runner, Vercel, network, persistence, or cross-repository runtime dependency may become semantic authority.

- [ ] **Step 8: Record execution truth**

If runners execute, record actual PASS/FAIL. If they terminate before steps, record `UNEXECUTED-INFRA`; never reinterpret runner failure as product failure or test success.

- [ ] **Step 9: Commit only if review requires a product correction**

Otherwise leave the implementation commits intact and prepare the promotion PR from the latest appropriate `main` lineage.
