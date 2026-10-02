# haKodan — Product Design Document

Version: Acceleration V1
Date: 2026-10-02
Status: product baseline for implementation

## 1. Product definition

**haKodan is the central framework, runtime, SDK and Manifestation Engine of HNK-KODE.**

HNK-KODE is the language and computational-semantic authority. haKodan implements that authority as an executable creation system. HNK-KODE Studio is the authoring environment built on haKodan. Goodle and other surfaces may consume or bridge into haKodan, but they do not define parallel semantics.

## 2. North Star

Transform intention into a real, visible and verifiable manifestation:

`ALEF / Intent → Surface → Canonical AST → HOM → HNK-IR → Target → Adapter → Artifact → Runtime → MALKUTH / Manifestation`

Execution evidence and provenance follow actual execution; protocol conformance alone never proves execution.

## 3. Product promise

A creator should be able to describe or compose what must exist, while haKodan preserves semantic identity across authoring modes and produces the selected manifestation without making an external target language the semantic authority.

## 4. Authoring modes

- **Visual:** blocks, nodes, glyphs, Mandala and graphical composition.
- **Standard:** highly readable declarative/narrative authoring.
- **Pro:** advanced types, components, systems, APIs and programming constructs.

All modes converge on the same canonical semantics and HNK-IR.

## 5. Language profiles

One canonical grammar is projected through:

1. HNK profile — canonical priority, only confirmed lexemes.
2. PT-BR profile — primary human bridge.
3. EN profile — international interoperability.

Surface tokens resolve to Semantic IDs. English never becomes semantic authority by convenience.

## 6. Golden Path MVP

The first product acceptance path is:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION`

A complete acceptance run must parse/resolve the authored intent, create canonical semantic structures, lower through HOM/HNK-IR, select a supported target, bind a real adapter, produce an artifact, execute/render it visibly, and attach truthful execution evidence/provenance.

## 7. Primary product capabilities

### Semantic creation
- Intent and narrative representation.
- Stable semantic IDs.
- Canonical AST.
- HOM identity/state/components/relations/behaviors/events/assets/presentation/data/manifestations/provenance.
- Type system.

### Compilation/runtime
- HNK-IR.
- VM tables, addressing and dispatch.
- Instruction program/encoding and haKodan bytecode.
- Runtime/trap model.
- Deterministic lowering.

### Manifestation
Target families defined by architecture include:
- Code: JavaScript/TypeScript and future interoperable targets.
- Experience: Web, App, Game, World, UI.
- Design: wireframe, mockup, component/design specification.
- Documentation: Markdown, GDD, PDD, architecture/runbook outputs and exporter-backed formats.
- Media/AI: image/video/audio specifications, prompts, agents and workflows.

A target is only `SUPPORTED` when its operational contract and adapter evidence justify that state.

## 8. User-facing Studio

HNK-KODE Studio should progressively provide:
- explorer;
- editor;
- inspector;
- preview;
- console;
- manifestation selector;
- RUN/MANIFEST controls;
- visual/standard/pro authoring convergence.

The Studio is a surface over haKodan, never a second semantic engine.

## 9. Product principles

1. **haKodan-first:** infrastructure serves manifestation.
2. **One semantic authority:** no target, Studio or Goodle-specific IR may redefine HNK semantics.
3. **Fail closed:** unresolved lexemes/capabilities remain unresolved/unsupported.
4. **Determinism where promised:** equivalent semantics must not diverge because of surface language or insertion order.
5. **Truthful execution:** artifact generation, protocol conformance and execution are distinct states.
6. **Provenance by design:** transformations retain traceability.
7. **Repository truth:** approved product truth is versioned in GitHub.
8. **Preserve history:** superseded documents remain traceable rather than silently erased.

## 10. Current baseline

The repository already contains a dedicated `packages/hakodan` kernel, HOM, canonical IR, bytecode, type/component/event/execution/addressing/dispatch/instruction foundations, tests and kernel workflow. The product-completion baseline for this acceleration scope is recorded separately in `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`.

The largest product gap is not semantic infrastructure. It is the visible end-to-end manifestation path plus authoring UX and fresh execution evidence.

## 11. Success metrics for Acceleration V1

- Product Completion Index crosses the 70% gate through evidence, not milestone inflation.
- One Golden Path manifestation is visibly executable end-to-end.
- One real target is truthfully marked supported through capability→adapter→artifact→runtime evidence.
- PT-BR/EN authoring equivalence remains preserved for the Golden Path.
- Studio/authoring input converges to the same canonical HNK-IR.
- Approved identity/assets are versioned and integrated without invented canon.
- A reproducible release candidate includes test/execution evidence and updated docs.

## 12. Non-goals for this phase

- Expanding provenance milestones merely to increase M-number.
- Claiming universal backend/native coverage before implementation evidence exists.
- Auto-canonizing provisional HNK lexemes or glyphs.
- Rewriting working semantic/runtime foundations without a verified need.
- Treating Goodle as the central product.

## 13. Definition of Done

Acceleration V1 is complete when the repository presents haKodan coherently through README/PDD/GDD/architecture/roadmap/design assets, the Golden Path executes visibly through a real target, execution evidence is captured, Studio/authoring drives the same semantics, the PCI is recalculated from evidence, and an RC is reproducibly documented.
