# HNK Target Envelope v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the manual HNK-KODE/haKodan → Goodle Browser link with a versioned JSON-compatible envelope while preserving haKodan as sole gameplay-semantic authority.

**Architecture:** HNK-KODE wraps the existing minimal `{id,state}` portal snapshot in `hnk.target-envelope.v1`; transport remains host-supplied data rather than a service. Goodle validates exact envelope keys/constants, extracts exactly `{id,state}`, and feeds the existing portal input/reflection/Phaser evidence path. Neither repository imports runtime code from the other.

**Tech Stack:** HNK-KODE Node.js ESM + `node:test`; Goodle Browser TypeScript + Vitest + React 19 + Phaser 3.

**Spec:** `docs/superpowers/specs/2026-10-06-hnk-target-envelope-v1.md`

## Global Constraints

- Exact schema: `hnk.target-envelope.v1`.
- Exact target: `goodle-browser`.
- Exact kind: `portal-state`.
- Snapshot is exactly `{id,state}`; `id` is non-empty and `state` is exactly `closed|open`.
- No coordinates, distance, threshold, proximity boolean, transition logic, callbacks, or dormant branches cross the protocol boundary.
- Exact-key validation on envelope and snapshot; no silent fallback.
- Producer and consumer return/use fresh data without mutating caller-owned protocol values.
- No HTTP, queue, database, Supabase, GitHub Action, daemon, persistence, or cross-repository runtime dependency.
- Runner availability is certification evidence only, never a semantic dependency.

## Review Focus

- Extra envelope/snapshot keys must be rejected, not ignored.
- Unsupported/future `schema` must fail explicitly rather than downgrade.
- Wrong `target` or `kind` must fail before reflection/rendering.
- Callback/accessor-bearing malformed payloads must not be executed during validation.
- Input envelope/snapshot must remain unchanged after Goodle validation/reflection.

---

### Task 1: HNK-KODE target-envelope producer

**Files:**
- Create: `packages/hakodan/src/target-envelope.mjs`
- Create: `packages/hakodan/test/target-envelope-v2.test.mjs`
- Reuse: `packages/hakodan/src/portal-target-snapshot.mjs`

**Interfaces:**
- Consumes: `toPortalTargetSnapshot(evaluated) -> {id,state}`.
- Produces: `toTargetEnvelope(evaluated) -> {schema:"hnk.target-envelope.v1",target:"goodle-browser",kind:"portal-state",snapshot:{id,state}}`.

- [ ] **Step 1: Write failing producer tests**

Test names/assertions:
- `wraps evaluated portal state in exact v1 envelope`: deep-equal the canonical four-key envelope for an `open` evaluated portal.
- `does not leak semantic inputs`: assert envelope/snapshot contain no coordinates, threshold, proximity, transition, formula, or callback keys.
- `returns fresh protocol objects`: mutate returned snapshot and assert the evaluated input is unchanged.
- `rejects malformed evaluated state`: expect `HAKODAN_TARGET_ENVELOPE_INVALID`.

- [ ] **Step 2: Run producer test and verify RED**

Run: `node --test packages/hakodan/test/target-envelope-v2.test.mjs`
Expected: FAIL because `target-envelope.mjs` / `toTargetEnvelope` does not exist.

- [ ] **Step 3: Implement producer**

Create `toTargetEnvelope(evaluated)` in `packages/hakodan/src/target-envelope.mjs`. Delegate snapshot validation/minimization to `toPortalTargetSnapshot`; translate any malformed producer-boundary input to `HAKODAN_TARGET_ENVELOPE_INVALID`; return a fresh exact-key envelope.

- [ ] **Step 4: Run producer test and focused haKodan regression suite**

Run: `node --test packages/hakodan/test/target-envelope-v2.test.mjs packages/hakodan/test/portal-target-snapshot-v2.test.mjs packages/hakodan/test/portal-proximity-state-v2.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

`git add packages/hakodan/src/target-envelope.mjs packages/hakodan/test/target-envelope-v2.test.mjs && git commit -m "feat(hakodan): emit HNK target envelope v1"`

---

### Task 2: Goodle exact envelope validator/unpacker

**Files:**
- Create: `src/browser-proof/HnkTargetEnvelope.ts`
- Create: `src/browser-proof/HnkTargetEnvelope.test.ts`
- Reuse: `src/browser-proof/HakodanPortalInput.ts`

**Interfaces:**
- Consumes: unknown host-supplied value.
- Produces: `readHnkTargetEnvelope(value: unknown): HakodanPortalSnapshot`.

- [ ] **Step 1: Write failing consumer tests**

Test names/assertions:
- `unpacks exact open v1 portal envelope`: returns exactly `{id:"portal-1",state:"open"}`.
- `unpacks exact closed v1 portal envelope`: returns exactly `{id:"portal-1",state:"closed"}`.
- `rejects missing envelope`: throws `GOODLE_HNK_TARGET_ENVELOPE_MISSING`.
- `rejects unsupported schema`: throws `GOODLE_HNK_TARGET_ENVELOPE_INVALID`.
- `rejects wrong target or kind`: each throws the same canonical invalid-envelope error.
- `rejects extra envelope and snapshot keys`: each throws rather than stripping unknown keys.
- `does not execute callback/accessor payloads`: use a payload whose forbidden extra property getter/callback increments/throws; assert no execution while validation rejects the shape.
- `does not mutate caller envelope`: deep-compare input before/after successful unpack.

- [ ] **Step 2: Run consumer test and verify RED**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelope.test.ts`
Expected: FAIL because `HnkTargetEnvelope.ts` / `readHnkTargetEnvelope` does not exist.

- [ ] **Step 3: Implement exact validator/unpacker**

Create `readHnkTargetEnvelope(value: unknown): HakodanPortalSnapshot`. Require exact top-level keys `schema,target,kind,snapshot`; compare exact constants; require snapshot exact keys `id,state`; then delegate final snapshot validation to `readHakodanPortalInput`. Do not enumerate/read unknown property values after key-name validation and do not invoke any value.

- [ ] **Step 4: Run consumer tests and existing reflection tests**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelope.test.ts src/browser-proof/HakodanPortalInput.test.ts src/runtime/HakodanPortalReflection.test.ts src/browser-proof/HakodanPortalBrowserProof.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

`git add src/browser-proof/HnkTargetEnvelope.ts src/browser-proof/HnkTargetEnvelope.test.ts && git commit -m "feat(browser-proof): validate HNK target envelope v1"`

---

### Task 3: Replace raw portal bootstrap with envelope bootstrap

**Files:**
- Modify: `src/browser-proof/main.tsx`
- Create: `src/browser-proof/HnkTargetEnvelopeBrowserProof.test.ts`

**Interfaces:**
- Consumes: `window.__HNK_TARGET_ENVELOPE__?: unknown` through `readHnkTargetEnvelope` from Task 2.
- Produces: existing `window.__GOODLE_BROWSER_PROOF__`, with unchanged portal evidence shape.

- [ ] **Step 1: Write failing integration contract**

Test the pure boundary used by `main.tsx`: a canonical open envelope must yield a snapshot that produces `canonicalState="open"`, `visualState="open"`, `rendered=true`, `manifestation="portal-open"`; repeat for closed/`portal-closed`. Assert missing envelope fails explicitly and no raw `__HAKODAN_PORTAL_STATE__` fallback is used.

- [ ] **Step 2: Run integration contract and verify RED**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelopeBrowserProof.test.ts`
Expected: FAIL because browser proof still consumes raw portal bootstrap.

- [ ] **Step 3: Modify browser proof bootstrap**

In `src/browser-proof/main.tsx`, replace `window.__HAKODAN_PORTAL_STATE__` with `window.__HNK_TARGET_ENVELOPE__`; call `readHnkTargetEnvelope` before `createHakodanPortalVisualProof`; keep Phaser rendering/evidence logic unchanged. Remove the obsolete raw portal global declaration.

- [ ] **Step 4: Run browser-proof unit/regression suite**

Run: `npm test -- --run src/browser-proof/HnkTargetEnvelopeBrowserProof.test.ts src/browser-proof/HnkTargetEnvelope.test.ts src/browser-proof/HakodanPortalBrowserProof.test.ts src/browser-proof/HakodanPortalInput.test.ts src/runtime/HakodanPortalReflection.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

`git add src/browser-proof/main.tsx src/browser-proof/HnkTargetEnvelopeBrowserProof.test.ts && git commit -m "feat(browser-proof): consume HNK target envelope bootstrap"`

---

### Task 4: Cross-repository protocol fixture and compatibility gate

**Files:**
- Create in HNK-KODE: `packages/hakodan/test/fixtures/hnk-target-envelope-v1.portal-open.json`
- Create in Goodle Browser: `src/browser-proof/fixtures/hnk-target-envelope-v1.portal-open.json`
- Create/modify tests in each repo to assert their local fixture equals the canonical v1 values and is accepted by their respective producer/consumer boundary.

**Interfaces:**
- Consumes/produces no runtime dependency; fixtures are duplicated protocol evidence only.
- Produces a reviewable compatibility artifact proving both repos agree on the serialized shape.

- [ ] **Step 1: Add canonical fixture independently to both repos**

Exact JSON value:
`{"schema":"hnk.target-envelope.v1","target":"goodle-browser","kind":"portal-state","snapshot":{"id":"portal-1","state":"open"}}`

- [ ] **Step 2: Add fixture compatibility assertions**

HNK-KODE: producer output deep-equals parsed fixture. Goodle: parsed fixture is accepted and unpacks to exactly `{id:"portal-1",state:"open"}`.

- [ ] **Step 3: Run focused suites in both repos**

HNK-KODE: `node --test packages/hakodan/test/target-envelope-v2.test.mjs packages/hakodan/test/portal-target-snapshot-v2.test.mjs`
Goodle: `npm test -- --run src/browser-proof/HnkTargetEnvelope.test.ts src/browser-proof/HnkTargetEnvelopeBrowserProof.test.ts`
Expected: PASS where an executable runner is available. If GitHub Actions fails before steps/runner assignment, record infrastructure failure separately and do not relabel semantic tests as failed or passed.

- [ ] **Step 4: Commit fixture gates separately per repo**

HNK-KODE: `git commit -m "test(hakodan): pin target envelope v1 fixture"`
Goodle: `git commit -m "test(browser-proof): pin HNK envelope v1 fixture"`

---

### Task 5: Whole-slice review and promotion gate

**Files:** No product-code changes unless review finds a defect.

**Interfaces:** Verifies Tasks 1–4 as one protocol slice.

- [ ] **Step 1: Review HNK-KODE diff**

Confirm producer cannot leak semantic inputs and introduces no Goodle runtime import.

- [ ] **Step 2: Review Goodle diff**

Confirm consumer has no proximity/distance/transition logic and introduces no HNK-KODE runtime import.

- [ ] **Step 3: Verify protocol equality**

Compare both canonical fixtures byte-for-byte or parsed deep equality; exact constants must match the spec.

- [ ] **Step 4: Verify browser evidence contract**

For open: `canonicalState=open`, `visualState=open`, `manifestation=portal-open`. For closed: corresponding closed values. Browser/Phaser execution is a certification gate when a runner/browser is available, not a prerequisite for the protocol semantics to exist.

- [ ] **Step 5: Request fresh whole-branch review before merge**

Review focus: exact keys, unsupported versions, wrong target/kind, execution safety, immutability, authority boundary, no cross-repo imports, no external-infrastructure dependency.
