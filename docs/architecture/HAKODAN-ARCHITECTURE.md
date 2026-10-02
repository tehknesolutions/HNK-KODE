# haKodan — Current Architecture

Version: Acceleration V1
Date: 2026-10-02
Supersedes as current entry point, but does not delete: `HAKODAN-ARCHITECTURE-v0.1.md`

## Authority hierarchy

`HNK → HNK-KODE → haKodan → HNK-KODE Studio / authoring surfaces → consumers/targets`

- HNK-KODE owns language/computational semantics.
- haKodan implements the framework/runtime/SDK/Manifestation Engine.
- Studio and Goodle-like authoring surfaces consume haKodan and must converge on canonical semantics.
- External targets implement output/runtime behavior but never define HNK semantics.

## Canonical pipeline

```text
ALEF / INTENT
  ↓
Intent / Narrative Graph
  ↓
Surface Profile (HNK | PT-BR | EN | Visual | Glyph)
  ↓
Resolve / Parse
  ↓
Canonical AST
  ↓
HOM — HNK Object Model + Type System
  ↓
HNK-IR
  ↔ optional canonical projections such as MHCM / Mandala-HNK
  ↓
VM/Lowering structures
  ↓
Target selection + capability registry
  ↓
Adapter binding
  ↓
Target artifact
  ↓
Runtime / Renderer / Exporter
  ↓
MALKUTH / VISIBLE MANIFESTATION
  ↓
Execution Evidence
  ↓
Audit / Provenance / conformance artifacts
```

## Critical state distinction

```text
INTENT
≠ PLAN
≠ HNK-IR
≠ ARTIFACT
≠ PROTOCOL_CONFORMANCE
≠ EXECUTION_EVIDENCE
```

Only a real runtime/executor result may authorize an execution claim.

## HOM

HOM is the canonical object layer between authored semantics/AST and HNK-IR. Its conceptual surface includes identity, type, state, properties, components, relations, behaviors, events, narrative, assets, presentation, data, manifestations and provenance.

The implementation strategy is multiparadigm:
- object orientation for identity/contracts;
- components for capabilities;
- systems for collective behavior;
- events for causality;
- narrative as executable structure.

## HNK-IR and VM foundations

The repository already contains canonical IR, VM tables, addressing/dispatch, hybrid execution-model foundations, instruction IR/encoding/programs, bytecode framing and trap/runtime primitives. These are preserved and used by the Golden Path rather than rewritten for the acceleration phase.

## Manifestation Engine

The Manifestation Engine is responsible for converting canonical HNK-IR into target-specific artifacts through explicit capability and adapter contracts.

Target families may include Code, Experience, Design, Documentation and Media/AI. Family declaration is not equivalent to backend support. Operational support must be evidence-backed.

## Capability flow

```text
HNK-IR
 → requested target
 → target capability registry/inventory
 → SUPPORTED? fail closed if not
 → manifestation router
 → adapter binding
 → dispatch
 → artifact
 → executor/runtime
 → execution result
```

## Evidence flow

Execution evidence is downstream of actual execution. Existing M-series audit/provenance/certificate/registry/seal/archive infrastructure remains available for integrity and traceability, but is no longer the product roadmap driver.

## Golden Path

Acceleration V1 is organized around:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION`

This path must traverse canonical semantics and reach a visible target/runtime result.

## Authoring convergence

Visual, Standard and Pro modes must never create parallel semantic authorities:

```text
Visual ─┐
Standard ├→ Semantic IDs → Canonical AST/HOM → HNK-IR
Pro ────┘
```

Goodle may provide migration know-how or an authoring bridge, but it remains subordinate to this convergence rule.

## Repository architecture boundaries

- `packages/hakodan`: central implementation kernel/runtime.
- `packages/goodle`: supporting creator/migration/provenance/authoring bridge; not central semantic authority.
- `docs/canon` and canonical specs: authority/governance inputs.
- `docs/product`: product requirements and experience definition.
- `docs/architecture`: current and historical architecture.
- `docs/roadmap`: evidence-backed progress and sequencing.
- `assets/hakodan`: approved haKodan product assets after identity audit.
- canonical lexical/glyph assets remain distinct from UI-brand approval unless explicitly established.

## Acceleration architecture rule

No new subsystem is added merely because it is architecturally interesting. New work must close an evidenced gap in execution, usability, verification, documentation or approved product identity.
