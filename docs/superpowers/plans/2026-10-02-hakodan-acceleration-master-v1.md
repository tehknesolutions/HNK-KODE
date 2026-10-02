# haKodan Acceleration Master V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing HNK-KODE infrastructure into an evidence-backed, documented, branded and executable haKodan product with one complete visible manifestation Golden Path.

**Architecture:** Preserve the existing semantic/provenance infrastructure and redirect implementation toward haKodan's vertical manifestation path. Documentation, assets, runtime and authoring surfaces converge on canonical HOM/AST and HNK-IR; Goodle remains subordinate and may not fork canonical semantics.

**Tech Stack:** Existing HNK-KODE JavaScript/Node modules, repository-native tests, SHA-256 evidence/provenance contracts, current target/adapter infrastructure, repository Markdown/assets.

**Spec:** `docs/spec/HAKODAN-ACCELERATION-MASTER-SPEC-v1.0.md`

## Global Constraints

- haKodan is the central product.
- Preserve existing M1–M62 work unless a verified defect requires change.
- `PROTOCOL_CONFORMANCE ≠ EXECUTION_EVIDENCE`.
- No unsupported capability may be reported as supported.
- No missing visual/canonical decision may be silently invented.
- Runtime PASS requires fresh executable evidence.
- Repository is the versioned source of truth.

## Review Focus

- Existing docs that still frame Goodle rather than haKodan as the product center.
- Capability registry entries that describe targets without a real executable adapter.
- Mock/artifact-only flows accidentally reported as manifestation execution.
- Approved visual assets lacking provenance or code integration.
- Golden Path semantic divergence between authoring input, HOM/AST and HNK-IR.

---

### Task 1: Repository truth audit and PCI baseline

**Files:**
- Create: `docs/audit/HAKODAN-REPOSITORY-AUDIT-v1.md`
- Create: `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`

**Interfaces:**
- Consumes: `main`, packages, tests, docs, assets, canon, spec and current M1–M62 chain.
- Produces: evidence-backed capability inventory and weighted PCI baseline.

- [ ] Inventory repository surfaces and classify each capability as `IMPLEMENTED_STATIC`, `TEST_DEFINED`, `EXECUTION_VERIFIED`, `UNRESOLVED`, or `LEGACY`.
- [ ] Map each PCI dimension to concrete repository evidence.
- [ ] Record contradictions/duplication without deleting source evidence.
- [ ] Publish baseline percentage only from scored evidence.
- [ ] Commit audit and PCI baseline.

### Task 2: Product-first documentation consolidation

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Create: `docs/product/HAKODAN-PDD.md`
- Create: `docs/product/HAKODAN-GDD.md`
- Create: `docs/architecture/HAKODAN-ARCHITECTURE.md`
- Create: `docs/roadmap/HAKODAN-ROADMAP.md`

**Interfaces:**
- Consumes: Task 1 audit + master spec + existing canonical docs.
- Produces: coherent product/technical source of truth centered on haKodan.

- [ ] Rewrite README hierarchy and quick-start around haKodan without deleting authority/governance constraints.
- [ ] Consolidate PDD: vision, users, jobs, modes, Golden Path, requirements, success metrics and DoD.
- [ ] Consolidate GDD: WORLD/ENTITY/PROPERTY/EVENT/ACTION model, interaction semantics, world/runtime capabilities and authoring behavior.
- [ ] Consolidate architecture: intent→semantic model→HOM/AST→HNK-IR→target→adapter→artifact→execution→evidence.
- [ ] Publish roadmap by delivery waves rather than arbitrary milestone count.
- [ ] Update changelog with acceleration phase and preserved M1–M62 lineage.
- [ ] Commit documentation consolidation.

### Task 3: Visual identity and asset truth

**Files:**
- Create: `docs/design/HAKODAN-DESIGN-SYSTEM.md`
- Create: `assets/hakodan/ASSET-MANIFEST.md`
- Modify/Create: approved runtime asset locations discovered by audit.

**Interfaces:**
- Consumes: repository assets and previously approved identity evidence only.
- Produces: canonical token/asset manifest and code-ready approved assets.

- [ ] Inventory all existing haKodan/HNK-KODE identity assets with source/provenance/status.
- [ ] Mark unsupported or conflicting identity decisions `UNRESOLVED`.
- [ ] Define only evidenced typography/color/iconography/layout/motion tokens.
- [ ] Normalize approved asset paths under `assets/hakodan/` without losing originals/provenance.
- [ ] Add tests/checks for broken referenced asset paths where repository tooling supports it.
- [ ] Commit design system and asset manifest.

### Task 4: Golden Path semantic contract

**Files:**
- Create/Modify: focused haKodan semantic/HOM/AST/HNK-IR modules identified by Task 1.
- Create: focused Golden Path contract tests.

**Interfaces:**
- Consumes: canonical semantic IDs and existing lowering infrastructure.
- Produces: deterministic `WORLD → ENTITY → PROPERTY → EVENT → ACTION` representation through HNK-IR.

- [ ] Write failing acceptance tests for one canonical Golden Path example.
- [ ] Verify failure before implementation.
- [ ] Implement minimal missing semantic/HOM/AST lowering contracts without parallel IRs.
- [ ] Run focused tests and capture result.
- [ ] Commit semantic Golden Path.

### Task 5: Real target + adapter + artifact

**Files:**
- Modify: existing target capability registry/inventory/router/binding/dispatch modules as identified by audit.
- Create/Modify: one concrete target adapter.
- Test: target/adaptation integration tests.

**Interfaces:**
- Consumes: Golden Path HNK-IR from Task 4.
- Produces: real artifact for one explicitly supported target.

- [ ] Select the simplest already-supported or nearest-to-supported target from repository evidence; do not invent support.
- [ ] Write failing integration test proving capability selection and adapter binding.
- [ ] Implement only the missing adapter/artifact path.
- [ ] Verify unsupported targets remain fail-closed.
- [ ] Commit real target path.

### Task 6: Visible manifestation execution

**Files:**
- Modify/Create: runtime entry point for the selected target.
- Create: end-to-end Golden Path test/fixture.

**Interfaces:**
- Consumes: Task 5 artifact.
- Produces: visible manifestation plus truthful execution result.

- [ ] Write end-to-end test that distinguishes artifact generation from actual execution/rendering.
- [ ] Implement the minimal execution surface needed for visible WORLD/ENTITY/EVENT/ACTION behavior.
- [ ] Capture execution output/exit state in an actual executor when available.
- [ ] Fail closed when no executor evidence exists.
- [ ] Commit visible manifestation path.

### Task 7: Evidence/provenance integration

**Files:**
- Modify: existing execution-evidence/provenance integration only where needed.
- Test: Golden Path evidence lineage tests.

**Interfaces:**
- Consumes: real execution result from Task 6.
- Produces: execution evidence linked to intent/artifact/provenance.

- [ ] Write tests proving protocol artifacts alone cannot become execution evidence.
- [ ] Bind actual execution result into existing evidence provider/bridge.
- [ ] Verify provenance links back to the Golden Path intent/artifact.
- [ ] Run focused evidence tests.
- [ ] Commit evidence integration.

### Task 8: haKodan authoring/Studio surface

**Files:**
- Modify/Create: existing authoring/Studio surface discovered in audit.
- Modify: approved asset references from Task 3.
- Test: authoring→canonical semantic model integration.

**Interfaces:**
- Consumes: canonical Golden Path interfaces from Tasks 4–6.
- Produces: user-facing path that creates the same canonical HNK-IR.

- [ ] Write integration test proving authoring input converges on canonical semantics rather than a parallel Goodle IR authority.
- [ ] Expose Golden Path creation/editing through the smallest viable haKodan authoring experience.
- [ ] Apply approved design tokens/assets.
- [ ] Verify desktop/mobile behavior where the existing surface supports both.
- [ ] Commit authoring surface.

### Task 9: Release consolidation

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`
- Create: `docs/releases/HAKODAN-ACCELERATION-RC1.md`

**Interfaces:**
- Consumes: completed tasks and executable evidence.
- Produces: reproducible release-candidate record and updated PCI.

- [ ] Run all available focused/integration tests and record commands/results without inventing PASS.
- [ ] Recalculate PCI from final evidence.
- [ ] Update README quick-start/current-status sections.
- [ ] Update changelog/version/release notes.
- [ ] Verify all referenced assets/docs exist.
- [ ] Commit RC1 consolidation.

## Self-review result

Coverage: product authority, repository truth, documentation, PDD/GDD, architecture, roadmap, identity/assets, semantic core, HNK-IR, real target, execution, evidence, Studio/UX, QA and release are represented. M63+ provenance expansion is intentionally excluded unless demanded by Golden Path defects.
