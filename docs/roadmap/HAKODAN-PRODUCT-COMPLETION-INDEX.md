# haKodan Product Completion Index (PCI)

Baseline date: 2026-10-02
Baseline commit inspected: `25a13ee8433e3e91a8540cd8142106a84665ed32`

## Why this exists

Milestone number is not completion percentage. M62 means the architecture has passed through milestone M62; it does not mean haKodan is 62% product-complete.

PCI scores product completion from repository evidence. Static implementation earns partial credit; user-visible/runtime claims require stronger evidence.

## Baseline

| Dimension | Weight | Evidence score | Weighted contribution | Evidence basis |
| --- | ---: | ---: | ---: | --- |
| Product/Canon & requirements | 10% | 75% | 7.50 | authority model, README, architecture/spec corpus exist; acceleration-era PDD/GDD not yet consolidated |
| haKodan semantic core/HOM/AST | 15% | 80% | 12.00 | dedicated haKodan package; HOM/component/event/execution/addressing primitives and focused tests exist |
| HNK-IR/compiler/lowering | 15% | 72% | 10.80 | canonical IR, bytecode, instruction program/encoding and related foundations exist; Golden Path lowering not yet acceptance-proven |
| Manifestation Engine/routing/adapters | 15% | 55% | 8.25 | substantial routing/manifestation/adaptation infrastructure exists, especially in Goodle integration; product-centered haKodan path not yet closed |
| Real runtime/targets | 15% | 35% | 5.25 | execution/kernel primitives exist; one audited real visible target Golden Path is not yet established |
| Studio/authoring UX | 10% | 25% | 2.50 | visual/textual contracts and Goodle authoring bridge exist; complete haKodan-centered Studio path remains unresolved |
| Visual identity/assets integration | 5% | 25% | 1.25 | canonical lexical SVG assets exist; complete approved haKodan UI identity + runtime integration not yet audited |
| Tests/QA/execution evidence | 7.5% | 55% | 4.125 | many focused tests/workflows exist; fresh acceleration-branch execution evidence not captured |
| Documentation/PDD/GDD/architecture | 5% | 50% | 2.50 | architecture corpus exists; unified PDD/GDD/current roadmap still missing |
| Versioning/release/distribution | 2.5% | 35% | 0.875 | changelog/version history exists; acceleration RC with reproducible visible manifestation not yet cut |

## Evidence-backed baseline PCI

**55.05%**

Rounded dashboard value: **55%**.

This is a planning index, not a claim that 55% of every conceivable haKodan feature exists. It measures the approved Acceleration Master Spec dimensions and weights.

## Interpretation

The project is stronger than a prototype in semantic/runtime foundations, but weaker than its milestone count suggests in visible product manifestation. The fastest safe path upward is not more provenance nesting; it is converting existing core infrastructure into one real Golden Path, then exposing it through haKodan authoring UX and release evidence.

## Highest leverage to 70%+

1. Consolidated PDD/GDD/architecture/README/roadmap.
2. Golden Path semantic acceptance contract.
3. One real target + adapter + visible execution.
4. Execution evidence captured from that real path.
5. Approved identity/assets wired into the authoring/runtime surface.

## Scoring rules

- Repository-visible source without test: partial credit only.
- Test source without fresh execution: `TEST_DEFINED`, not executable proof.
- Workflow existence without a successful relevant run: no execution claim.
- Protocol conformance never upgrades itself to execution evidence.
- Missing/contradictory identity or canon is `UNRESOLVED`, not guessed.
- Scores change only when evidence changes.

## Target gates

- **60% gate:** product documentation consolidated + Golden Path contract defined.
- **70% gate:** one real target produces a visible manifestation through canonical haKodan semantics.
- **80% gate:** authoring/Studio path drives the same Golden Path; identity/assets integrated; fresh integration execution captured.
- **90% gate:** broader target/runtime coverage, robust regression suite, release/distribution path and reduced unresolved design/canon gaps.
- **100% of this acceleration scope:** all Definition-of-Done requirements in `HAKODAN-ACCELERATION-MASTER-SPEC-v1.0.md` satisfied with evidence. This does not mean the universal haKodan vision can never expand.


## 2026-10-02 Web Manifestation V1 recalculation

Fresh evidence changes the weighted scores to: Product/Canon 95%, Semantic Core 90%, IR/compiler 88%, Manifestation 80%, Real runtime/targets 70%, Studio 25%, Identity/assets 25%, Tests/QA 85%, Documentation 90%, Versioning/release 45%.

Weighted PCI: **74.45%** (dashboard: **74%**).

Evidence: docs/evidence/HAKODAN-WEB-GOLDEN-PATH-V1.md. The increase is driven by consolidated product documentation, the canonical Golden Path, a fail-closed real Web target/adapter, deterministic artifact generation, fresh 169/169 local tests, and observed Chrome execution. Studio/authoring and approved identity/assets remain the largest product gaps.
