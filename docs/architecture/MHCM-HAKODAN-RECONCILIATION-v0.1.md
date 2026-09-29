# MHCM ↔ haKodan Reconciliation v0.1

Status: architecture reconciliation
Date: 2026-09-29

## Decision

The experimental `packages/kodescript/src/mhcm-runtime-v0.mjs` vertical slice is not a second runtime architecture.
It is classified as an early executable experiment whose responsibilities are already being absorbed by haKodan.

Canonical executable path:

```text
HNK / PT-BR / EN surfaces
        ↓
Semantic IDs
        ↓
Canonical AST
        ↓
HOM — HNK Object Model
        ↓
HNK-IR
        ↕
MHCM — Mandala-HNK Computational Model
        ↓
haKodan pre-opcode / execution model
        ↓
haKodan bytecode / future opcode stream
        ↓
Runtime + Manifestation targets
```

## Responsibility boundary

### HNK-KODE
Owns language surfaces, semantic identity, grammar and source representation.

### HOM
Owns semantic object identity, state, components, relations, behaviors, events, narrative, assets, presentation, data, manifestations and provenance.

### HNK-IR
Owns language-independent canonical computational representation.

### MHCM
Owns Mandala/gliph/path computational projection and addressing semantics. MHCM is a peer/projection around HNK-IR, not a competing parser, IR or runtime.

### haKodan
Owns compiler/runtime infrastructure: lowering, execution frames/registers, VM tables, addressing/dispatch integration, bytecode and future opcode execution.

### HME / manifestation targets
Own output-specific projections such as code, web, app, game, document, design and media.

## Migration rule for the experimental MHCM slice

`lowerAstToIr()` MUST NOT become a parallel canonical lowerer. Canonical AST→IR remains in haKodan.

`materializeRuntime()` MUST NOT become a parallel runtime. Runtime materialization/execution evolves through `packages/hakodan` execution model and future VM/runtime modules.

The experimental files remain temporarily as provenance and TDD evidence until their useful assertions are ported to haKodan tests. After equivalent coverage exists, they may be deprecated/removed in a dedicated cleanup change.

## Invariants

1. No English keyword is semantic authority; language profiles resolve to Semantic IDs.
2. HNK lexemes are never invented to fill unresolved compiler vocabulary.
3. PT-BR and EN equivalent programs converge to the same Canonical AST/HNK-IR.
4. MHCM never forks semantic identity from HNK-IR.
5. haKodan is the only executable framework/runtime line under HNK-KODE.
6. Provenance must survive lowering boundaries whenever representable.
7. New runtime work lands under `packages/hakodan`, unless explicitly classified as an isolated experiment.

## Current implementation mapping

```text
parser.mjs              → language profile parsing / AST / HNK-IR bridge
semantic-tokens.mjs     → semantic token registry implementation
hom.mjs                 → HOM projection
canonical-ir.mjs        → canonical IR serialization
lowering.mjs            → target lowering
pre-opcode.mjs          → pre-opcode package (IR + tables + execution model)
execution-model.mjs     → typed virtual registers + structured frames
addressing.mjs          → runtime addressing
vm-tables.mjs           → VM tables
event-dispatch.mjs      → event dispatch catalog
bytecode.mjs            → HAKD deterministic bytecode container
```

## Next executable gate

Port the two useful assertions from `mhcm-runtime-v0.test.mjs` into haKodan-native integration tests:

- deterministic AST → canonical IR/HOM/pre-opcode path;
- deterministic world/entity/property/event/action materialization through the haKodan execution/runtime model.

Do not delete the experimental slice until the haKodan-native tests demonstrate equivalent or stronger coverage.
