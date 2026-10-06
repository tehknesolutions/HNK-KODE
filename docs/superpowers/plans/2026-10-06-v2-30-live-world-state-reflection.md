# V2-30 Live World State Reflection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the one-shot HNK-KODE → Goodle portal proof into an ordered live reflection channel that updates the same running Phaser manifestation while haKodan remains the sole gameplay-semantic authority.

**Architecture:** HNK-KODE evolves HNK Target Envelope v1 with a positive safe-integer `revision`; Goodle validates the exact revised shape, applies ordering/idempotency/conflict rules per target ID, and exposes a synchronous host delivery boundary. Phaser retains one portal manifestation handle per ID and mutates that handle only after an accepted newer update; browser evidence distinguishes received, accepted, and rendered revisions.

**Tech Stack:** HNK-KODE Node.js ESM + `node:test`; Goodle Browser TypeScript + Vitest + React 19 + Phaser 3.

**Spec:** `docs/superpowers/specs/2026-10-06-v2-30-live-world-state-reflection.md`

## Global Constraints

- haKodan owns coordinates, DISTANCE/proximity, threshold rules, `closed → open`, canonical state, and revision assignment.
- Goodle owns validation, target identity lookup, ordering/staleness checks, idempotent reflection, retained Phaser mutation, and observed render evidence only.
- Revised exact envelope keys are `schema,target,kind,revision,snapshot`; snapshot remains exactly `id,state`.
- `schema="hnk.target-envelope.v1"`, `target="goodle-browser"`, `kind="portal-state"` remain exact constants.
- `revision` MUST be a positive JavaScript safe integer.
- No silent compatibility with the old four-key v1 shape; producer, consumer, and fixture migrate together.
- No HTTP, WebSocket, Supabase, queue, daemon, persistence, cross-repository runtime import, or CI dependency.
- Pure adapters/pre-render intent MUST NOT claim `rendered:true`.
- `UNEXECUTED-INFRA` remains distinct from PASS and product FAIL.

## Review Focus

- Same revision + different snapshot must be a conflict and must not mutate visual state.
- Stale revision must not roll back canonical/visual/rendered evidence.
- Updates for different portal IDs must not share retained manifestation identity/state.
- Duplicate identical revision must not recreate/mutate the Phaser manifestation or advance rendered evidence.
- Invalid revisions (`0`, negative, fractional, unsafe integer, string) must be rejected before runtime state mutation.

---

### Task 1: Evolve HNK-KODE envelope producer with revision

**Files:**
- Modify: `packages/hakodan/src/target-envelope.mjs`
- Modify: `packages/hakodan/test/target-envelope-v2.test.mjs`

**Interfaces:**
- Consumes: `toTargetEnvelope(evaluated, revision)` where `revision` is a positive safe integer.
- Produces: exact `{schema,target,kind,revision,snapshot:{id,state}}`.

- [ ] **Step 1: Write failing producer tests**

Add assertions that `toTargetEnvelope(evaluated,3)` deep-equals the revised five-key envelope; reject `undefined`, `0`, `-1`, `1.5`, `Number.MAX_SAFE_INTEGER+1`, and `"3"`; preserve fresh snapshot/envelope objects and semantic-field non-leakage.

- [ ] **Step 2: Run focused producer test and verify RED**

Run: `node --test packages/hakodan/test/target-envelope-v2.test.mjs`
Expected: FAIL because current producer has no revision contract.

- [ ] **Step 3: Implement minimal producer evolution**

Change signature to `toTargetEnvelope(evaluated, revision)`; validate with `Number.isSafeInteger(revision) && revision > 0`; malformed revision or evaluated state throws `HAKODAN_TARGET_ENVELOPE_INVALID`; return exact five-key envelope.

- [ ] **Step 4: Run focused haKodan regression suite**

Run: `node --test packages/hakodan/test/target-envelope-v2.test.mjs packages/hakodan/test/portal-target-snapshot-v2.test.mjs packages/hakodan/test/portal-proximity-state-v2.test.mjs`
Expected: PASS when an executor is available.

- [ ] **Step 5: Commit**

`git commit -am "feat(hakodan): version live target envelopes by revision"`

---

### Task 2: Migrate canonical cross-repo fixture

**Files:**
- Modify: `packages/hakodan/test/fixtures/hnk-target-envelope-v1.portal-open.json`
- Modify in Goodle: `src/browser-proof/fixtures/hnk-target-envelope-v1.portal-open.json`
- Modify fixture assertions in producer/consumer tests as needed.

**Interfaces:**
- Canonical fixture becomes `open@3` and must be byte-identical in both repos.

- [ ] **Step 1: Update HNK-KODE fixture to exact revised payload**

Use `{"schema":"hnk.target-envelope.v1","target":"goodle-browser","kind":"portal-state","revision":3,"snapshot":{"id":"portal-1","state":"open"}}` plus final newline.

- [ ] **Step 2: Update Goodle fixture to the exact same bytes**

No additional fields or formatting divergence.

- [ ] **Step 3: Pin compatibility assertions**

HNK producer output for `revision=3` deep-equals parsed fixture; Goodle consumer accepts parsed fixture and returns revision plus snapshot according to Task 3's interface.

- [ ] **Step 4: Compare fixture blob SHA / parsed equality**

Expected: same Git blob SHA where GitHub normalization is identical; otherwise parsed deep equality plus byte comparison from an available executor.

- [ ] **Step 5: Commit separately per repo**

HNK: `test(hakodan): migrate live envelope fixture`; Goodle: `test(browser-proof): migrate live envelope fixture`.

---

### Task 3: Evolve Goodle exact envelope validator

**Files:**
- Modify: `src/browser-proof/HnkTargetEnvelope.ts`
- Modify: `src/browser-proof/HnkTargetEnvelope.test.ts`

**Interfaces:**
- Produces: `readHnkTargetEnvelope(value: unknown): { revision:number; snapshot:HakodanPortalSnapshot }`.

- [ ] **Step 1: Write failing exact-validation tests**

Assert open/closed envelopes return `{revision,snapshot}`; old four-key shape is rejected; invalid revisions `0,-1,1.5,MAX_SAFE_INTEGER+1,"3"` are rejected; extra keys, wrong constants, and accessor-bearing forbidden extras remain rejected without executing forbidden values; caller input remains unchanged.

- [ ] **Step 2: Run consumer test and verify RED**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelope.test.ts`
Expected: FAIL against current four-key validator/return shape.

- [ ] **Step 3: Implement exact revised validator**

Require sorted keys `kind,revision,schema,snapshot,target`; validate constants and positive safe-integer revision; validate snapshot exact keys before delegating snapshot validation; return fresh `{revision,snapshot}`.

- [ ] **Step 4: Run consumer + reflection regression tests**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelope.test.ts src/browser-proof/HakodanPortalInput.test.ts src/runtime/HakodanPortalReflection.test.ts`
Expected: PASS when executable.

- [ ] **Step 5: Commit**

`git commit -am "feat(browser-proof): validate live envelope revisions"`

---

### Task 4: Add pure live ordering/identity state machine

**Files:**
- Create: `src/runtime/HakodanLivePortalReflection.ts`
- Create: `src/runtime/HakodanLivePortalReflection.test.ts`

**Interfaces:**
- Consumes: validated `{revision,snapshot}`.
- Produces: a pure disposition/result for one target ID: `created | updated | duplicate | stale | conflict`, plus last accepted canonical state/revision; no Phaser dependency.

- [ ] **Step 1: Write failing state-machine tests**

Pin sequence `closed@1 → closed@2 → open@3`; assert accepted revision/state after each newer update. Pin identical `open@3` as `duplicate`; `closed@3` after `open@3` as `conflict`; `closed@2` after `open@3` as `stale`. Add two-ID test proving portal-2 updates do not change portal-1 state.

- [ ] **Step 2: Run state-machine tests and verify RED**

Run: `npm test -- --run src/runtime/HakodanLivePortalReflection.test.ts`
Expected: FAIL because live state machine does not exist.

- [ ] **Step 3: Implement minimal pure state machine**

Expose a factory such as `createHakodanLivePortalReflection()` returning `deliver(input)` and `get(id)`. Store only reflection metadata keyed by snapshot ID. Newer revision accepts; identical same revision duplicates; same revision/different state conflicts; older revision stale. Do not add gameplay rules.

- [ ] **Step 4: Run state-machine suite**

Expected: all ordering/identity tests PASS when executable.

- [ ] **Step 5: Commit**

`git add src/runtime/HakodanLivePortalReflection* && git commit -m "feat(runtime): order live portal reflections"`

---

### Task 5: Retain and mutate Phaser portal manifestations

**Files:**
- Create: `src/browser-proof/HakodanPortalManifestation.ts`
- Create: `src/browser-proof/HakodanPortalManifestation.test.ts`
- Modify: `src/browser-proof/main.tsx`

**Interfaces:**
- Produces a retained manifestation registry keyed by portal ID.
- `create/update` receives only accepted canonical reflection result; returns observed render evidence including stable manifestation identity and `renderedRevision`.

- [ ] **Step 1: Write failing retained-manifestation contract**

Using a narrow fake drawing adapter (not real Phaser), assert first `closed@1` creates one handle; `closed@2` and `open@3` reuse the exact same handle; duplicate/stale/conflict dispositions do not call visual mutation; portal-2 receives a distinct handle.

- [ ] **Step 2: Run manifestation contract and verify RED**

Run: `npm test -- --run src/browser-proof/HakodanPortalManifestation.test.ts`
Expected: FAIL because retained manifestation adapter does not exist.

- [ ] **Step 3: Implement retained manifestation adapter**

Keep Phaser-specific creation/mutation behind a tiny injected drawing interface. On accepted `created/updated`, create or mutate the retained handle and only then return evidence with `rendered:true` and `renderedRevision=acceptedRevision`. Duplicate/stale/conflict return disposition evidence without a new render claim.

- [ ] **Step 4: Wire `main.tsx` Scene to the retained adapter**

Replace one-shot portal drawing with retained registry initialization in `Scene.create()`. Preserve existing visual closed/open representation; do not restart Scene for updates.

- [ ] **Step 5: Run manifestation + existing browser-proof regressions**

Run focused Vitest suite including `HakodanPortalManifestation`, `HakodanPortalBrowserProof`, and live reflection tests. Expected: PASS when executable.

- [ ] **Step 6: Commit**

`git commit -am "feat(browser-proof): retain live portal manifestation"`

---

### Task 6: Add synchronous host delivery boundary and evidence

**Files:**
- Create: `src/browser-proof/HnkLiveTargetDelivery.ts`
- Create: `src/browser-proof/HnkLiveTargetDelivery.test.ts`
- Modify: `src/browser-proof/main.tsx`

**Interfaces:**
- Expose browser host function `window.__HNK_DELIVER_TARGET_ENVELOPE__(value: unknown)` after Scene initialization.
- Delivery pipeline: exact envelope validator → live ordering state machine → retained manifestation adapter → evidence publication.

- [ ] **Step 1: Write failing delivery-pipeline tests**

Deliver `closed@1 → closed@2 → open@3` and assert evidence fields `receivedRevision`, `acceptedRevision`, `renderedRevision`, canonical/visual state, manifestation, and `rendered:true` after accepted render. Assert identical duplicate, conflict, and stale deliveries expose their disposition and do not advance rendered revision. Assert invalid envelope fails before state mutation.

- [ ] **Step 2: Run delivery tests and verify RED**

Run: `npm test -- --run src/browser-proof/HnkLiveTargetDelivery.test.ts`
Expected: FAIL because live delivery boundary does not exist.

- [ ] **Step 3: Implement pure delivery coordinator**

Compose Task 3 validator, Task 4 state machine, and Task 5 manifestation adapter. Keep it transport-agnostic and synchronous.

- [ ] **Step 4: Expose bounded browser host function**

In `main.tsx`, assign `window.__HNK_DELIVER_TARGET_ENVELOPE__` only after Scene/manifestation infrastructure is ready. Bootstrap the initial envelope through this same function rather than a separate semantic path.

- [ ] **Step 5: Publish temporal browser evidence**

Ensure `window.__GOODLE_BROWSER_PROOF__.hakodan.portal` reflects received/accepted/rendered revisions and disposition. Never publish `rendered:true` for a delivery before visual mutation succeeds.

- [ ] **Step 6: Run focused Goodle V2-30 suite**

Run all new live-envelope/state/manifestation/delivery tests plus existing reflection/browser-proof tests. Expected: PASS when executable.

- [ ] **Step 7: Commit**

`git commit -am "feat(browser-proof): deliver live HNK target envelopes"`

---

### Task 7: Whole-slice review and promotion gate

**Files:** No product changes unless review finds a defect.

**Interfaces:** Reviews Tasks 1–6 as one cross-repo slice.

- [ ] **Step 1: Review HNK-KODE authority boundary**

Confirm revision assignment/export exists without leaking semantic inputs and without importing Goodle runtime code.

- [ ] **Step 2: Review Goodle authority boundary**

Search diff for distance, threshold, proximity, or semantic transition logic. None may be introduced by V2-30.

- [ ] **Step 3: Review ordering/identity invariants**

Confirm duplicate/conflict/stale behavior, per-ID isolation, and retained manifestation identity match the spec.

- [ ] **Step 4: Review evidence correctness**

Confirm received/accepted/rendered revisions are distinct concepts and `rendered:true` only follows successful visual creation/mutation.

- [ ] **Step 5: Verify migrated protocol fixture equality**

Both repos must encode the same exact revised envelope.

- [ ] **Step 6: Inspect available execution evidence**

If a real executor runs the focused suites/browser proof, record PASS/FAIL from actual output. If jobs again terminate pre-runner or no executor is available, record `UNEXECUTED-INFRA` without converting it to PASS or product FAIL.

- [ ] **Step 7: Request fresh whole-branch review before merge/promotion**

Review focus: authority boundary, exact validation, revision ordering, identity isolation, retained object reuse, evidence timing, no external infrastructure dependency.
