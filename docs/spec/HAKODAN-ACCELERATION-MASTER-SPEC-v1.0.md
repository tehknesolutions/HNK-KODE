# haKodan Acceleration Master Spec v1.0

Status: APPROVED DIRECTION / EXECUTION BASELINE
Date: 2026-10-02

## 1. Product authority

The focus of this repository is **haKodan**.

- HNK-KODE: language + computational language/domain.
- **haKodan: central framework, runtime, SDK and Manifestation Engine.**
- HNK-KODE Studio: authoring environment for haKodan.
- Goodle: subordinate creator/authoring surface and migration/know-how source. Goodle MUST NOT create a competing semantic canon, HOM, HNK-IR, type system or VM.

Product hierarchy for this acceleration phase:

`HNK → HNK-KODE → haKodan → Studio/authoring surfaces → consumers`

## 2. North-star outcome

haKodan must transform a real intention into a real, visible, verifiable manifestation:

`ALEF / Intent → Semantic Model → HOM / AST → HNK-IR → Target Adapter → Artifact → Execute → Visible Result → Execution Evidence → Provenance`

The first product gate is not another provenance milestone. It is an executable vertical slice.

## 3. Golden Path MVP

The minimum manifestation vocabulary is:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION`

Acceptance requires one complete example to:
1. enter through the supported intent/authoring surface;
2. lower into canonical haKodan semantic structures;
3. produce HNK-IR;
4. select a real supported target through the capability registry;
5. bind a real adapter;
6. generate an artifact;
7. execute/render the artifact;
8. expose a visible result;
9. capture truthful execution evidence;
10. link evidence back through provenance without promoting protocol conformance into execution evidence.

## 4. Acceleration rule

M1–M62 and the existing provenance chain are preserved as infrastructure. New horizontal provenance expansion is frozen unless required by the Golden Path or a discovered integrity defect.

Every new task must answer at least one of:
- Does this make haKodan more executable?
- Does this make haKodan more usable?
- Does this make haKodan more testable/verifiable?
- Does this consolidate/document/version already-built haKodan capability?
- Does this apply the approved haKodan visual/product identity?

Otherwise it goes to backlog.

## 5. Repository-as-source-of-truth

All approved project truth must be versioned in this repository. Required canonical surfaces:

- `README.md` — product-first entry point centered on haKodan.
- `CHANGELOG.md` — versioned delivery history.
- `docs/product/HAKODAN-PDD.md` — Product Design Document.
- `docs/product/HAKODAN-GDD.md` — interaction/world/game-capability design where applicable.
- `docs/architecture/HAKODAN-ARCHITECTURE.md` — runtime/compiler/manifestation architecture.
- `docs/roadmap/HAKODAN-ROADMAP.md` — product roadmap and completion index.
- `docs/design/HAKODAN-DESIGN-SYSTEM.md` — approved visual identity and tokens only.
- `assets/hakodan/` — approved source/runtime assets with provenance.
- `packages/` — implementation.
- `tests/` — executable acceptance and regression coverage.

No visual asset, semantic rule or canonical statement may be silently invented to fill a missing approved source. Missing evidence is marked `UNRESOLVED`.

## 6. Product Completion Index (PCI)

Progress is measured by evidence, not milestone count. M62 does not mean 62%.

Weighted dimensions:
- Product/Canon & requirements — 10%
- haKodan semantic core/HOM/AST — 15%
- HNK-IR/compiler/lowering — 15%
- Manifestation Engine/routing/adapters — 15%
- Real runtime/targets — 15%
- Studio/authoring UX — 10%
- Visual identity/assets integration — 5%
- Tests/QA/execution evidence — 7.5%
- Documentation/PDD/GDD/architecture — 5%
- Versioning/release/distribution — 2.5%

A dimension earns completion only from repository-visible evidence and, where execution is claimed, executable evidence.

## 7. Delivery waves

### Wave A — Truth & consolidation
Inventory main, reconcile open branches/PRs, classify implemented vs tested vs executable, remove/merge redundant M60-era documentation only when preservation is guaranteed, and publish the PCI baseline.

### Wave B — Product documentation
Rewrite README around haKodan; consolidate complete PDD, GDD/TDD, architecture, glossary, authority hierarchy, roadmap, Definition of Done and release model.

### Wave C — Identity & assets
Inventory existing approved assets and visual decisions; establish design tokens and asset manifest; place approved assets under `assets/hakodan`; wire assets into actual product surfaces. Missing approval stays `UNRESOLVED`.

### Wave D — Manifestation Golden Path
Implement/test the complete WORLD→ENTITY→PROPERTY→EVENT→ACTION vertical slice through a real target and visible result.

### Wave E — Studio/UX
Expose the Golden Path through the haKodan authoring experience, preserving convergence on the same canonical semantic model/HNK-IR.

### Wave F — Verification & release
Run focused + integration suites in a real executor, capture execution evidence, update PCI, changelog, version and release documentation, and cut the first acceleration release candidate.

## 8. Definition of Done for this acceleration phase

The phase is complete only when:
- haKodan is the explicit center of README/PDD/GDD/architecture/roadmap;
- the repository has a coherent versioned documentation set without contradictory product hierarchy;
- approved identity/assets are inventoried and wired into code where applicable;
- one Golden Path manifestation executes visibly end-to-end;
- execution evidence is captured from a real executor;
- tests cover semantic lowering, target selection, adapter binding, artifact generation and visible execution path;
- a PCI report states evidence-backed completion and remaining gaps;
- a release candidate is versioned with changelog and reproducible instructions.

## 9. Non-goals

- Continuing M63+ merely to increase milestone count.
- Treating Goodle as the central product.
- Claiming runtime success from protocol conformance.
- Inventing missing visual/canonical decisions.
- Rewriting proven infrastructure without a Golden Path requirement.

## 10. Governing invariant

**haKodan is the center. Everything else in this repository must either implement, expose, verify, document or consume haKodan.**
