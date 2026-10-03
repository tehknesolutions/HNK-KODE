# haKodan Studio V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a usable browser Studio where the Creator edits HNK-KODE, validates canonical semantics, runs the existing manifestation pipeline, inspects WORLD/ENTITY/PROPERTY/EVENT/ACTION, and sees the real Web artifact preview.

**Architecture:** Add a thin `packages/hakodan/studio` browser surface plus a small Studio state/controller module inside haKodan. The controller delegates all semantics to `buildGoldenPath()` and `manifest()`; the browser UI only renders controller state and places `artifact.content` in a sandboxed preview. No second parser, AST, HOM, HNK-IR or renderer is introduced.

**Tech Stack:** Node.js ESM, Node test runner, existing `@hnk/hakodan` modules, dependency-free HTML/CSS/JavaScript browser surface.

**Spec:** `docs/superpowers/specs/2026-10-03-hakodan-studio-v1-design.md`

## Global Constraints

- Authority remains `HNK → HNK-KODE → haKodan → Studio/surfaces → consumers`.
- Studio MUST call canonical haKodan APIs; it MUST NOT parse/reinterpret HNK-KODE itself.
- `ARTIFACT_GENERATED ≠ EXECUTED` remains invariant.
- Unsupported/malformed input fails closed; RUN cannot silently fall back.
- Preview uses generated `artifact.content` and an isolated sandbox boundary.
- Only approved identity/assets may be integrated; unresolved identity remains `UNRESOLVED`.
- No production dependency is added for V1.
## Review Focus

1. Invalid source must expose a text diagnostic and keep RUN/preview from claiming success.
2. Switching PT-BR/EN must use the selected canonical profile and preserve equivalent semantics for equivalent source.
3. Repeated RUN after a failure must not leak a previous successful artifact/inspector state.
4. Preview markup must come only from `manifest().artifact.content`; diagnostics/source must never be injected into the Studio DOM as executable HTML.
5. Preview load alone must remain `UNVERIFIED`; only explicit executor evidence may become `EXECUTED`.

---

### Task 1: Studio Session Controller

**Files:**
- Create: `packages/hakodan/src/studio-session-v1.mjs`
- Create: `packages/hakodan/test/studio-session-v1.test.mjs`

**Interfaces:**
- Consumes: `buildGoldenPath(source,{profile})`, `manifest(source,{profile,target:"web"})`.
- Produces: `createStudioSession({source,profile})`, immutable state, `validate()`, `run()`, `setSource()`, `setProfile()`.

- [ ] Write failing tests for initial state, successful validation, invalid-source diagnostic, profile switching, run success, stale-artifact clearing after failure, and `UNVERIFIED` evidence.
- [ ] Run `node --test packages/hakodan/test/studio-session-v1.test.mjs`; confirm RED because module is absent.
- [ ] Implement the minimal controller; diagnostics are plain strings/codes and all semantic data comes from canonical APIs.
- [ ] Re-run focused test; confirm PASS.
- [ ] Commit `feat(hakodan): add studio session controller`.
### Task 2: Canonical Inspector Projection

**Files:**
- Create: `packages/hakodan/src/studio-inspector-v1.mjs`
- Create: `packages/hakodan/test/studio-inspector-v1.test.mjs`

**Interfaces:**
- Consumes: successful `buildGoldenPath()` result.
- Produces: `projectStudioInspector(goldenPath)` with ordered `world`, `entities`, `properties`, `events`, `actions` view data only.

- [ ] Write failing tests using AbraIsland PT-BR and EN; assert identical inspector projection and exact `AbraIsland/Alakazam/vida=100/Despertar/despertar` values.
- [ ] Add malformed/non-Golden-Path test expecting `HAKODAN_STUDIO_INSPECTOR_INVALID`.
- [ ] Run focused test; confirm RED.
- [ ] Implement a read-only projection from canonical Golden Path structures; do not create new semantics.
- [ ] Re-run; confirm PASS.
- [ ] Commit `feat(hakodan): add canonical studio inspector`.

### Task 3: Browser Studio Shell

**Files:**
- Create: `packages/hakodan/studio/index.html`
- Create: `packages/hakodan/studio/studio.css`
- Create: `packages/hakodan/studio/studio.mjs`
- Create: `packages/hakodan/test/studio-shell-contract.test.mjs`

**Interfaces:**
- Consumes: Studio controller and inspector modules.
- Produces: editor, profile selector, VALIDATE, RUN, diagnostics, inspector, sandboxed preview and evidence status.
- [ ] Write shell-contract tests asserting required controls/regions, `iframe sandbox`, and absence of inline semantic parser logic.
- [ ] Run focused test; confirm RED because Studio files are absent.
- [ ] Implement accessible dependency-free HTML/CSS shell with neutral functional styling; mark unresolved identity in source metadata/comments rather than inventing canon.
- [ ] Wire source/profile changes to session state; VALIDATE renders diagnostics/inspector as text nodes; RUN sets preview `srcdoc` strictly from generated artifact content.
- [ ] Ensure a failed validation/run clears previous preview and canonical inspector success state.
- [ ] Re-run shell + controller + inspector tests; confirm PASS.
- [ ] Commit `feat(hakodan): add studio browser shell`.

### Task 4: Studio Golden Path Acceptance

**Files:**
- Create: `packages/hakodan/test/studio-golden-path-acceptance.test.mjs`
- Create: `packages/hakodan/studio/README.md`

**Interfaces:**
- Consumes: Tasks 1–3 plus existing PT-BR/EN AbraIsland fixtures.
- Produces: acceptance proof that both surfaces validate, inspect and manifest equivalently through Studio APIs.

- [ ] Write acceptance test loading both fixture files and driving controller `validate()` then `run()`.
- [ ] Assert equivalent inspector data, byte-identical artifact content, status `ARTIFACT_GENERATED`, evidence `UNVERIFIED`, and fail-closed invalid-source reset.
- [ ] Run acceptance test; confirm PASS only after Tasks 1–3.
- [ ] Document exact Studio launch/test commands and current V1 non-goals.
- [ ] Commit `test(hakodan): add studio golden path acceptance`.
### Task 5: Real Browser Studio Verification + Product Evidence

**Files:**
- Create: `packages/hakodan/studio/verify-studio-browser.mjs`
- Create: `docs/evidence/HAKODAN-STUDIO-V1.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/roadmap/HAKODAN-ROADMAP.md`
- Modify: `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`

**Interfaces:**
- Consumes: complete Studio and an available real browser executor.
- Produces: observable evidence plus honest PCI recalculation.

- [ ] Run the complete `packages/hakodan` suite and capture fresh test/pass/fail counts and environment.
- [ ] Serve/open Studio in an available real Chrome executor; observe seeded source, validation, inspector, RUN, preview `AbraIsland`, and evidence state without fabricating `EXECUTED`.
- [ ] Exercise an invalid source in the browser and confirm diagnostics appear while stale preview is cleared.
- [ ] Record commands, commit SHA, browser observation and limitations in `HAKODAN-STUDIO-V1.md`.
- [ ] Recalculate PCI from observed evidence only; update roadmap/README/changelog.
- [ ] Commit `docs(hakodan): record studio v1 evidence` and push branch.

## Self-review result

Spec coverage is complete for V1: authoring, PT-BR/EN profile, validation, canonical inspector, RUN, generated preview, fail-closed errors, sandboxing and evidence truthfulness all have owning tasks/tests. Persistence, collaboration, AI generation, deployment, visual Blocks/Mandala and multi-target export remain explicit non-goals. No second semantic authority or new visual canon is introduced.