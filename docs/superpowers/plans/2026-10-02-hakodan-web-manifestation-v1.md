# haKodan Web Manifestation V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the first real haKodan manifestation path from the approved Golden Path through a Web/JavaScript adapter to a visible executable artifact with truthful execution evidence.

**Architecture:** Reuse the existing parser, HOM, HNK-IR and Golden Path contract as the only semantic authority. Add a haKodan-owned Web target capability/adapter that lowers canonical HNK-IR into a deterministic self-contained browser artifact, then add an execution-evidence boundary that only reports EXECUTED after a real executor/browser run. Goodle remains a consumer/bridge and is not used as the semantic or runtime authority for this slice.

**Tech Stack:** Node.js ESM, existing `packages/hakodan` parser/HOM/HNK-IR/lowering/runtime contracts, Node test runner, deterministic HTML/JavaScript artifact generation.

**Spec:** `docs/spec/HAKODAN-ACCELERATION-MASTER-SPEC-v1.0.md`; product requirements: `docs/product/HAKODAN-PDD.md`, `docs/product/HAKODAN-GDD.md`; architecture: `docs/architecture/HAKODAN-ARCHITECTURE.md`.

## Global Constraints

- Product authority remains `HNK → HNK-KODE → haKodan → Studio/surfaces → consumers`.
- Golden Path remains `WORLD → ENTITY → PROPERTY → EVENT → ACTION`.
- No parallel AST, HOM, HNK-IR, type system or semantic registry.
- PT-BR and EN surfaces must converge to equivalent canonical semantics.
- Target support is fail-closed: a target is not SUPPORTED without an operational adapter contract.
- `ARTIFACT_GENERATED ≠ EXECUTED`; protocol/conformance evidence is not execution evidence.
- Unsupported target/action states must fail explicitly.
- No new visual canon is invented; the first visible artifact uses functional neutral presentation only.
- No new production dependency is required for V1.

## Review Focus

1. Unsupported target request must fail closed instead of silently falling back to Web.
2. Malformed/incomplete Golden Path input must fail before artifact generation.
3. PT-BR and EN equivalent source must produce semantically equivalent deterministic artifacts.
4. Artifact generation without an executor must remain `UNVERIFIED`, never `EXECUTED`.
5. Runtime/action failure must preserve failure/evidence state and never return a success manifestation.

---

### Task 1: Web Target Capability Contract

**Files:**
- Create: `packages/hakodan/src/targets/web-target-v1.mjs`
- Create: `packages/hakodan/test/web-target-v1.test.mjs`

**Interfaces:**
- Consumes: canonical target name `web`, Golden Path/HNK-IR produced by existing haKodan modules.
- Produces: `WEB_TARGET_V1`, `getWebTargetCapability()`, `assertWebTargetSupported(target)`.

- [ ] **Step 1: Write failing tests** proving `web` resolves as the single V1 supported visible target and unknown targets fail closed with `HAKODAN_TARGET_UNSUPPORTED`.
- [ ] **Step 2: Run** `node --test packages/hakodan/test/web-target-v1.test.mjs` and confirm RED because the module/API does not exist.
- [ ] **Step 3: Implement** the minimal immutable Web capability contract; do not import Goodle capability state as authority.
- [ ] **Step 4: Re-run** the focused test and confirm PASS.
- [ ] **Step 5: Commit** `feat(hakodan): add web target capability v1`.

### Task 2: Deterministic Web Adapter + Artifact

**Files:**
- Create: `packages/hakodan/src/targets/web-adapter-v1.mjs`
- Create: `packages/hakodan/test/web-adapter-v1.test.mjs`
- Modify: `packages/hakodan/src/index.mjs`

**Interfaces:**
- Consumes: `buildGoldenPath(source, { profile })`, `assertWebTargetSupported("web")`, canonical `result.ir`.
- Produces: `buildWebArtifact(goldenPathResult)` returning an immutable artifact descriptor with `target`, `mediaType`, `content`, `semanticHash/input identity` where supported by existing primitives, and `executionEvidence: "UNVERIFIED"`.

- [ ] **Step 1: Write failing tests** asserting a complete HTML document is produced, contains the World/Entity/property state needed for visible inspection, contains deterministic event/action wiring, and starts with `executionEvidence === "UNVERIFIED"`.
- [ ] **Step 2: Add equivalence test** asserting PT-BR/EN Golden Paths produce byte-identical Web artifact content after canonical lowering.
- [ ] **Step 3: Run** `node --test packages/hakodan/test/web-adapter-v1.test.mjs` and confirm RED.
- [ ] **Step 4: Implement** `buildWebArtifact(goldenPathResult)` using only canonical HNK-IR data. Generate deterministic self-contained HTML/JS with neutral functional presentation and no external dependency.
- [ ] **Step 5: Export** the adapter through `packages/hakodan/src/index.mjs` following existing export style.
- [ ] **Step 6: Re-run** focused adapter + Golden Path tests and confirm PASS.
- [ ] **Step 7: Commit** `feat(hakodan): add deterministic web manifestation adapter`.

### Task 3: Manifestation Orchestrator

**Files:**
- Create: `packages/hakodan/src/manifest-v1.mjs`
- Create: `packages/hakodan/test/manifest-v1.test.mjs`
- Modify: `packages/hakodan/src/index.mjs`

**Interfaces:**
- Consumes: source/profile, `buildGoldenPath`, target capability, Web adapter.
- Produces: `manifest(source, { profile, target })` returning `{ goldenPath, target, artifact, status }` with status `ARTIFACT_GENERATED` and no execution claim.

- [ ] **Step 1: Write failing tests** for PT-BR/EN Web manifestation, unsupported target rejection, and incomplete Golden Path rejection.
- [ ] **Step 2: Run** focused test and confirm RED.
- [ ] **Step 3: Implement** the minimal orchestrator: semantic build → target assertion → adapter → artifact. Do not execute inside `manifest()`.
- [ ] **Step 4: Re-run** tests and confirm PASS.
- [ ] **Step 5: Commit** `feat(hakodan): orchestrate golden path web manifestation`.

### Task 4: Real Execution Evidence Boundary

**Files:**
- Create: `packages/hakodan/src/execution-evidence-v1.mjs`
- Create: `packages/hakodan/test/execution-evidence-v1.test.mjs`
- Modify: `packages/hakodan/src/index.mjs`

**Interfaces:**
- Consumes: generated artifact plus explicit executor result.
- Produces: `attachExecutionEvidence(artifact, executorResult)` and stable states `UNVERIFIED | EXECUTED | FAILED`.

- [ ] **Step 1: Write failing tests** proving no executor result can never become EXECUTED, successful executor result can, and runtime failure becomes FAILED with preserved diagnostic data.
- [ ] **Step 2: Run** focused test and confirm RED.
- [ ] **Step 3: Implement** the evidence boundary without fabricating browser/runtime execution.
- [ ] **Step 4: Re-run** and confirm PASS.
- [ ] **Step 5: Commit** `feat(hakodan): add truthful execution evidence boundary`.

### Task 5: Golden Path Web Acceptance Fixture

**Files:**
- Create: `packages/hakodan/examples/golden-path-web/abra-island.pt.hnk`
- Create: `packages/hakodan/examples/golden-path-web/abra-island.en.hnk`
- Create: `packages/hakodan/examples/golden-path-web/README.md`
- Create: `packages/hakodan/test/golden-path-web-acceptance.test.mjs`

**Interfaces:**
- Consumes: public haKodan exports from Tasks 1–4.
- Produces: repository fixture demonstrating `AbraIsland → Alakazam → vida=100 → Despertar → despertar("Alakazam")` through a Web artifact.

- [ ] **Step 1: Add acceptance test** loading both fixtures and asserting canonical/artifact equivalence plus `ARTIFACT_GENERATED/UNVERIFIED` before real execution.
- [ ] **Step 2: Run** the acceptance test and confirm PASS only after prior tasks exist.
- [ ] **Step 3: Document** exact commands and the distinction between generating/opening the artifact and verified execution evidence.
- [ ] **Step 4: Commit** `test(hakodan): add web golden path acceptance fixture`.

### Task 6: Fresh Verification + Product Evidence

**Files:**
- Modify: `.github/workflows/hakodan-kernel.yml` only if the existing workflow does not include the new tests by glob/default runner behavior.
- Create: `docs/evidence/HAKODAN-WEB-GOLDEN-PATH-V1.md`
- Modify: `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`
- Modify: `docs/roadmap/HAKODAN-ROADMAP.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: all focused tests and, when available, actual executor/browser evidence.
- Produces: reproducible evidence record and PCI recalculation based only on observed results.

- [ ] **Step 1: Run** the complete `packages/hakodan` test suite in an available executor; capture exact command, commit SHA, pass/fail counts and environment.
- [ ] **Step 2: Execute/open** the generated Web artifact in an available real browser/executor and capture the observable result. If no executor is available, record `UNVERIFIED` and do not award execution credit.
- [ ] **Step 3: Write** `HAKODAN-WEB-GOLDEN-PATH-V1.md` separating static implementation, test execution, artifact generation and real runtime evidence.
- [ ] **Step 4: Recalculate PCI** from the new evidence; do not force a target percentage.
- [ ] **Step 5: Update** README/roadmap/changelog with the actual evidenced state.
- [ ] **Step 6: Commit** `docs(hakodan): record web golden path execution evidence`.

## Self-review result

- Spec coverage: first real target, adapter, artifact, truthful evidence, PT-BR/EN convergence and visible Golden Path are covered.
- No new semantic authority is introduced.
- Goodle remains outside the execution authority path.
- Unsupported targets and incomplete semantic input have explicit tests.
- The plan deliberately permits `UNVERIFIED` if infrastructure cannot execute the browser; it never converts missing infrastructure into a product PASS.
- The first target is intentionally Web/JavaScript because it minimizes distance from existing lowering while producing an inspectable manifestation without adding dependencies.
