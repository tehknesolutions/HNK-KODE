# V2-31 Actor Movement → Canonical World Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the first causal gameplay loop from player movement intent through HNK canonical world mutation and haKodan evaluation to retained Goodle actor/portal manifestation.

**Architecture:** HNK-KODE validates a tiny exact movement intent, applies a deterministic one-unit canonical actor move, increments world revision, evaluates existing portal semantics, and returns a target-safe actor result plus the existing revisioned target envelope. Goodle validates and orders canonical actor results, retains one Phaser actor handle, and feeds the returned portal envelope into the V2-30 live-delivery pipeline; Goodle never computes movement consequences for portal semantics.

**Tech Stack:** HNK-KODE Node.js ESM + `node:test`; Goodle Browser TypeScript + Vitest + React 19 + Phaser 3.

**Spec:** `docs/superpowers/specs/2026-10-06-v2-31-actor-movement-canonical-world-update.md`

## Global Constraints

- Goodle captures controls and renders canonical results; HNK/haKodan owns canonical actor position and semantic consequences.
- Movement intent exact shape is `{actorId,direction}` with `direction` exactly `left | right | up | down`.
- An accepted V2-31 movement changes exactly one axis by exactly one world unit.
- `worldRevision` and target-envelope `revision` are positive JavaScript safe integers.
- For this single-stream proof, HNK orchestration emits target-envelope `revision === worldRevision`.
- Goodle MUST NOT calculate portal distance, threshold, proximity classification, or semantic portal transition.
- Raw key/input capture MUST NOT advance canonical rendered actor position without an accepted canonical host result.
- V2-30 target-envelope validation/order/retained portal manifestation is reused, not reimplemented.
- No networking, persistence, physics authority, cross-repository runtime import, CI dependency, or local-machine dependency is introduced.
- `UNEXECUTED-INFRA` remains distinct from PASS and product FAIL.

## Review Focus

- Unknown actor ID must be rejected before world mutation; no partial revision increment is allowed.
- Accessor-bearing extra movement-intent keys must be rejected without evaluating the accessor.
- Same world revision with different actor coordinates must be conflict, never a visual mutation.
- Stale canonical actor results must not roll the retained actor handle backward.
- A canonical actor result whose target envelope revision does not match `worldRevision` must be rejected at the Goodle causal boundary for this single-stream proof.

---

### Task 1: Exact HNK movement-intent validation

**Files:**
- Create: `packages/hakodan/src/movement-intent.mjs`
- Create: `packages/hakodan/test/movement-intent-v2.test.mjs`

**Interfaces:**
- Produces: `readMovementIntent(value, expectedActorId)` → fresh `{actorId,direction}`.

- [ ] **Step 1: Write failing intent tests**

Pin acceptance of `{actorId:"alakazam",direction:"right"}` and all four directions. Reject unknown actor ID, unsupported direction, missing/extra keys, non-object/array/null, and accessor-bearing extra keys without evaluating the accessor. Assert caller object remains unchanged.

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test packages/hakodan/test/movement-intent-v2.test.mjs`
Expected: FAIL because `movement-intent.mjs` does not exist.

- [ ] **Step 3: Implement exact validator**

Create `readMovementIntent(value, expectedActorId)` using exact enumerable key validation before reading field values; return a fresh object; throw `HAKODAN_MOVEMENT_INTENT_INVALID` for malformed/unsupported input.

- [ ] **Step 4: Run focused test**

Expected: PASS when an executor is available.

- [ ] **Step 5: Commit**

`git add packages/hakodan/src/movement-intent.mjs packages/hakodan/test/movement-intent-v2.test.mjs && git commit -m "feat(hakodan): validate canonical movement intents"`

---

### Task 2: Apply immutable one-unit canonical movement

**Files:**
- Create: `packages/hakodan/src/canonical-actor-movement.mjs`
- Create: `packages/hakodan/test/canonical-actor-movement-v2.test.mjs`

**Interfaces:**
- Consumes: validated `{actorId,direction}` and canonical `{worldRevision,actor:{id,x,y}}`.
- Produces: `applyCanonicalActorMovement(world,intent)` → fresh `{worldRevision: previous+1, actor:{id,x,y}}`.

- [ ] **Step 1: Write failing movement tests**

Assert from `(0,0)` right→`(1,0)`, left→`(-1,0)`, down→`(0,1)`, up→`(0,-1)` and revision increments exactly once. Three sequential right moves yield `(1,0)@1`, `(2,0)@2`, `(3,0)@3`. Assert input world and intent remain unchanged. Reject mismatched actor identity and invalid/non-safe prior revision before mutation.

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test packages/hakodan/test/canonical-actor-movement-v2.test.mjs`
Expected: FAIL because canonical movement function does not exist.

- [ ] **Step 3: Implement minimal deterministic movement**

Create `applyCanonicalActorMovement(world,intent)` with the spec's exact ±1 axis mapping and safe revision increment. Throw `HAKODAN_CANONICAL_MOVEMENT_INVALID` on malformed/mismatched state.

- [ ] **Step 4: Run Tasks 1–2 tests**

Expected: PASS when executable.

- [ ] **Step 5: Commit**

`git add packages/hakodan/src/canonical-actor-movement.mjs packages/hakodan/test/canonical-actor-movement-v2.test.mjs && git commit -m "feat(hakodan): apply canonical actor movement"`

---

### Task 3: HNK causal world orchestration

**Files:**
- Create: `packages/hakodan/src/canonical-world-step.mjs`
- Create: `packages/hakodan/test/canonical-world-step-v2.test.mjs`
- Reuse: `packages/hakodan/src/portal-proximity-state.mjs`
- Reuse: `packages/hakodan/src/target-envelope.mjs`

**Interfaces:**
- Produces: `stepCanonicalWorld(world,intent)` → exact target-safe `{worldRevision,actor,targetEnvelope}`.
- For this proof, `targetEnvelope.revision === worldRevision`.

- [ ] **Step 1: Write failing orchestration tests**

Build a canonical world with Alakazam at `(0,0)`, a portal/threshold compatible with existing proximity semantics, and revision 0. Submit three validated right intents and assert actor `(1,0)@1 → (2,0)@2 → (3,0)@3`; assert the third evaluated target envelope is canonical `open` when the existing threshold rule says it is in range. Assert each envelope revision equals its world revision.

- [ ] **Step 2: Pin target-safe output**

Assert returned JSON contains only `worldRevision`, minimal actor `{id,x,y}`, and `targetEnvelope`; forbid leaked threshold/formula/proximity reasoning/callback/semantic helper fields. Assert original canonical world is not mutated.

- [ ] **Step 3: Pin invalid-intent atomicity**

Unknown actor or malformed intent must throw before any world revision/position changes are observable.

- [ ] **Step 4: Run orchestration test and verify RED**

Run: `node --test packages/hakodan/test/canonical-world-step-v2.test.mjs`
Expected: FAIL because orchestration does not exist.

- [ ] **Step 5: Implement orchestration**

`stepCanonicalWorld(world,intent)` validates intent against canonical actor ID, applies Task 2 movement, feeds the resulting canonical actor position into existing portal evaluation, then calls `toTargetEnvelope(evaluated, moved.worldRevision)`. Return only the target-safe shape.

- [ ] **Step 6: Run HNK V2-31 + proximity/envelope regressions**

Run the three new tests plus existing portal proximity, target snapshot, and target-envelope tests. Expected: PASS when executable.

- [ ] **Step 7: Commit**

`git add packages/hakodan/src/canonical-world-step.mjs packages/hakodan/test/canonical-world-step-v2.test.mjs && git commit -m "feat(hakodan): orchestrate canonical movement world step"`

---

### Task 4: Validate Goodle canonical actor result

**Files:**
- Create: `src/browser-proof/HnkCanonicalWorldResult.ts`
- Create: `src/browser-proof/HnkCanonicalWorldResult.test.ts`

**Interfaces:**
- Produces: `readHnkCanonicalWorldResult(value)` → fresh `{worldRevision,actor,targetEnvelope}` with exact actor `{id,x,y}`.
- Delegates target-envelope semantics to existing `readHnkTargetEnvelope` and requires envelope revision to equal world revision.

- [ ] **Step 1: Write failing validator tests**

Accept canonical `(alakazam,3,0)@3` with target envelope `revision:3`. Reject invalid/unsafe world revision, extra/missing result keys, extra actor keys, non-finite coordinates, malformed target envelope, and world/target revision mismatch. Add accessor-bearing extra-key test proving forbidden accessor is not executed. Assert caller input is unchanged.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm test -- --run src/browser-proof/HnkCanonicalWorldResult.test.ts`
Expected: FAIL because validator does not exist.

- [ ] **Step 3: Implement exact validator**

Validate outer exact keys `actor,targetEnvelope,worldRevision`; actor exact keys `id,x,y`; positive safe revision; finite numeric coordinates; call existing target-envelope validator; reject revision mismatch with `GOODLE_HNK_CANONICAL_WORLD_RESULT_INVALID`; return fresh target-safe values.

- [ ] **Step 4: Run validator + V2-30 validator regression tests**

Expected: PASS when executable.

- [ ] **Step 5: Commit**

`git add src/browser-proof/HnkCanonicalWorldResult* && git commit -m "feat(browser-proof): validate canonical world results"`

---

### Task 5: Order canonical actor reflections

**Files:**
- Create: `src/runtime/HakodanLiveActorReflection.ts`
- Create: `src/runtime/HakodanLiveActorReflection.test.ts`

**Interfaces:**
- Consumes validated `{worldRevision,actor}`.
- Produces dispositions `created | updated | duplicate | stale | conflict` and retained accepted canonical actor metadata per actor ID.

- [ ] **Step 1: Write failing ordering tests**

Pin `(1,0)@1 → (2,0)@2 → (3,0)@3`; identical `(3,0)@3` is duplicate; different `(2,0)@3` is conflict; `(2,0)@2` after revision 3 is stale. Add two-actor identity isolation even though multi-control is a non-goal, because the registry must not alias IDs.

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- --run src/runtime/HakodanLiveActorReflection.test.ts`
Expected: FAIL because actor reflection state machine does not exist.

- [ ] **Step 3: Implement pure per-ID actor state machine**

Expose `createHakodanLiveActorReflection()` with `deliver(input)` and `get(id)`, mirroring V2-30 ordering semantics but comparing canonical coordinates for same-revision equality/conflict. No Phaser or movement-rule code.

- [ ] **Step 4: Run actor + portal reflection state-machine suites**

Expected: PASS when executable.

- [ ] **Step 5: Commit**

`git add src/runtime/HakodanLiveActorReflection* && git commit -m "feat(runtime): order canonical actor reflections"`

---

### Task 6: Retain canonical Alakazam manifestation

**Files:**
- Create: `src/browser-proof/HakodanActorManifestation.ts`
- Create: `src/browser-proof/HakodanActorManifestation.test.ts`

**Interfaces:**
- Produces a retained actor registry keyed by canonical actor ID.
- Drawing adapter: `create(id,x,y)` and `update(handle,x,y)`.

- [ ] **Step 1: Write failing retained-handle tests**

First `(1,0)@1` creates one handle; `(2,0)@2` and `(3,0)@3` reuse the exact handle and call update; duplicate/stale/conflict do not mutate drawing; another actor ID gets a distinct handle. Evidence sets `rendered:true` and `renderedRevision` only after successful accepted create/update.

- [ ] **Step 2: Run manifestation test and verify RED**

Run: `npm test -- --run src/browser-proof/HakodanActorManifestation.test.ts`
Expected: FAIL because actor manifestation registry does not exist.

- [ ] **Step 3: Implement retained actor manifestation registry**

Keep Phaser out of this module via the injected drawing interface. Preserve latest rendered revision per ID for non-accepted disposition evidence.

- [ ] **Step 4: Run actor manifestation tests**

Expected: PASS when executable.

- [ ] **Step 5: Commit**

`git add src/browser-proof/HakodanActorManifestation* && git commit -m "feat(browser-proof): retain canonical actor manifestation"`

---

### Task 7: Compose canonical world result delivery with V2-30

**Files:**
- Create: `src/browser-proof/HnkCanonicalWorldDelivery.ts`
- Create: `src/browser-proof/HnkCanonicalWorldDelivery.test.ts`
- Reuse: `src/browser-proof/HnkLiveTargetDelivery.ts`

**Interfaces:**
- Produces `createHnkCanonicalWorldDelivery({actorDrawing,targetDelivery})` with `deliver(value)`.
- Pipeline: canonical-result validator → actor ordering → actor manifestation → existing V2-30 target delivery → causal evidence.

- [ ] **Step 1: Write failing causal-delivery tests**

Deliver world results `(1,0)@1`, `(2,0)@2`, `(3,0)@3`; assert same actor handle is retained, actor rendered revision advances, and each target envelope is passed exactly once into the injected existing V2-30 delivery. At revision 3 assert causal evidence contains rendered actor `(3,0)` and rendered/open portal evidence returned by V2-30.

- [ ] **Step 2: Pin duplicate/stale/conflict behavior**

Actor duplicate/stale/conflict must not mutate actor drawing and must not redeliver its target envelope as a new causal step. Invalid canonical result must fail before actor or target mutation.

- [ ] **Step 3: Run delivery test and verify RED**

Run: `npm test -- --run src/browser-proof/HnkCanonicalWorldDelivery.test.ts`
Expected: FAIL because coordinator does not exist.

- [ ] **Step 4: Implement coordinator**

Compose Tasks 4–6 and inject the existing V2-30 target delivery. Only accepted newer actor results proceed to target delivery. Return evidence with world revision plus actor and portal evidence.

- [ ] **Step 5: Run V2-31 delivery + V2-30 live delivery regressions**

Expected: PASS when executable.

- [ ] **Step 6: Commit**

`git add src/browser-proof/HnkCanonicalWorldDelivery* && git commit -m "feat(browser-proof): deliver canonical world updates"`

---

### Task 8: Wire browser input without granting semantic authority

**Files:**
- Modify: `src/browser-proof/main.tsx`
- Create: `src/browser-proof/HnkMovementInput.test.ts`
- Optionally create focused adapter: `src/browser-proof/HnkMovementInput.ts` if needed to keep `main.tsx` small.

**Interfaces:**
- Browser host surface: `window.__HNK_SUBMIT_MOVEMENT_INTENT__(intent)`.
- Canonical host adapter returns unknown target-safe result, then Task 7 validates/delivers it.

- [ ] **Step 1: Write failing input-boundary test**

Assert ArrowRight maps only to `{actorId:"alakazam",direction:"right"}` (and equivalent four arrows). Key capture alone must not call actor drawing/update; actor visual movement occurs only after a canonical host result is delivered.

- [ ] **Step 2: Pin no local semantic fallback**

If canonical host adapter is absent or rejects, Goodle must not synthesize `x±1/y±1`, target state, or target envelope locally.

- [ ] **Step 3: Run input test and verify RED**

Run: `npm test -- --run src/browser-proof/HnkMovementInput.test.ts`
Expected: FAIL because movement-input boundary does not exist.

- [ ] **Step 4: Implement bounded key→intent adapter**

Map arrow keys to the exact movement-intent shape only. Do not include position, delta, threshold, portal data, or revision.

- [ ] **Step 5: Wire `main.tsx` to retained actor + existing portal pipelines**

Create a simple retained Alakazam Phaser visual; expose the host submission function; pass returned canonical world results through Task 7. Keep initial proof/bootstrap deterministic and separate from raw key intent.

- [ ] **Step 6: Publish causal browser evidence**

Extend browser proof evidence to include canonical actor position/rendered revision and portal evidence after both accepted visual mutations. Do not claim a canonical movement from key capture alone.

- [ ] **Step 7: Run focused browser-proof regression suite**

Run V2-31 input/delivery/actor tests plus V2-30 target delivery/portal tests. Expected: PASS when executable.

- [ ] **Step 8: Commit**

`git commit -am "feat(browser-proof): submit canonical movement intents"`

---

### Task 9: Whole-slice authority and promotion review

**Files:** No product changes unless review identifies a defect.

**Interfaces:** Reviews Tasks 1–8 as one cross-repository causal slice.

- [ ] **Step 1: Review HNK canonical authority**

Confirm movement ±1, world revision increment, portal evaluation, and target revision assignment exist only on HNK side.

- [ ] **Step 2: Review Goodle semantic absence**

Search the V2-31 Goodle diff for local actor coordinate arithmetic used as canonical truth and for portal distance/threshold/proximity/transition rules. None may exist.

- [ ] **Step 3: Review causal ordering and identity**

Confirm actor duplicate/conflict/stale rules, per-ID isolation, retained actor handle, retained V2-30 portal handle, and no target redelivery for rejected actor result.

- [ ] **Step 4: Review evidence timing**

`rendered:true` / rendered revisions must follow successful visual mutation, never raw key capture or pure validation/reflection.

- [ ] **Step 5: Review target-safe leakage**

HNK orchestration output must expose only world revision, minimal actor render state, and target envelope; no threshold/formula/proximity reasoning.

- [ ] **Step 6: Inspect actual execution evidence**

If an executor runs tests/browser proof, record actual PASS/FAIL. If runners again terminate pre-step or no executor exists, record `UNEXECUTED-INFRA` and continue structural review without inventing PASS.

- [ ] **Step 7: Fresh whole-branch review before promotion**

Review focus: authority boundary, exact validation, atomic movement, revision causality, actor/portal identity retention, evidence timing, and absence of external infrastructure dependency.
