# haKodan HMV-1 — Golden Path Inventory

Parent product track: #189
Date: 2026-10-02
Status: FIRST PASS COMPLETE

## Objective
Identify the shortest repository-grounded path from Creator intention to a real executable manifestation, centered on `packages/hakodan` rather than Goodle.

## What already exists in haKodan

### Semantic / object layer
- `packages/hakodan/src/hom.mjs` defines HOM nodes and semantic validation.
- `packages/hakodan/src/component-model.mjs` and `event-model.mjs` provide component/event primitives.
- `packages/hakodan/src/manifestation-graph-v0.9.mjs` provides a manifestation graph contract.

### Parse / IR layer
- `packages/hakodan/src/parser.mjs` parses the current textual haKodan form into AST and exposes `toHnkIr(ast)`.
- `packages/hakodan/src/canonical-ir.mjs` canonicalizes the HNK-IR deterministically.

### Instruction / execution layer
- `instruction-encoding.mjs`, `instruction-program.mjs`, `bytecode.mjs` provide instruction/bytecode surfaces.
- `execution-model.mjs` validates execution steps, targets and effects and can build an execution plan.
- `event-dispatch.mjs` provides event dispatch behavior.

### Package identity
`packages/hakodan/package.json` describes the package as the `haKodan executable language/framework kernel` and exposes a Node test suite.

## Critical finding
The repository already has substantial pieces for:

`HOM → AST/parser → HNK-IR → instruction/execution model`

but HMV-1 did **not** recover a concrete haKodan target adapter/runtime that demonstrably turns this pipeline into a visible user-observable artifact. That is the current Golden Path gap.

Goodle contains manifestation/target/evidence infrastructure, but it must be treated as candidate know-how/supporting integration. It must not become the architectural authority over haKodan.

## Shortest recommended Golden Path

Do not attempt every future target. Select one target with the smallest real execution surface and prove:

`Creator Intent → minimal haKodan semantic object → HOM → AST/HNK-IR → one concrete target adapter → generated artifact → execute → visible result`

Then attach evidence/provenance only after the real result exists.

## HMV-2 input
Freeze only the semantic primitives required by the first slice:
- WORLD
- ENTITY
- PROPERTY
- EVENT
- ACTION

Do not expand the language merely for completeness before the first manifestation.

## HMV-3 decision required from repository evidence
Select exactly one concrete executable target. Prefer a target that can produce a self-contained visible artifact without external paid infrastructure. Candidate selection must be based on what can actually be implemented/executed from the current repository, not on enum names or aspirational capability declarations.

## Runtime truth
This inventory is repository/static evidence only. It does not claim that the complete haKodan pipeline has executed successfully end-to-end.
