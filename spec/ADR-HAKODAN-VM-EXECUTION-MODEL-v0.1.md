# ADR — haKodan VM Execution Model v0.1

**Status:** ACCEPTED  
**Data:** 2026-09-29  
**Decision:** Hybrid VM — typed virtual registers + structured call/event frames

## Context

haKodan is not only a low-level language runtime. It must preserve traceability from HNK-KODE → AST → HOM → HNK-IR → VM execution, while supporting events, components, worlds, visual authoring, future WASM lowering and source/provenance mapping.

Three execution models were evaluated.

| Criterion | Stack VM | Register VM | Hybrid |
|---|---|---|---|
| Compact instruction operands | strong | medium | medium |
| Direct mapping from SSA/IR-like values | medium | strong | strong |
| Human/debug traceability | medium | strong | strong |
| Visual node/block correspondence | medium | strong | strong |
| Event/action frames | medium | medium | strong |
| Simple interpreter | strong | medium | medium |
| Fewer implicit intermediate states | weak | strong | strong |
| Future WASM translation | strong | strong | strong |
| Component/world addressing | medium | strong | strong |
| Provenance per value/instruction | medium | strong | strong |

## Decision

haKodan v0.1 adopts a **hybrid execution model**:

1. **Typed virtual registers** carry explicit values and references inside an action/instruction stream.
2. **Structured frames** represent world/event/action invocation state, arguments, return values, traps and provenance.
3. A small internal operand stack MAY be used by adapters/implementation internals, but it is not part of the canonical VM semantic contract.
4. Canonical Opcode IR addresses operands explicitly through register IDs, table indices and semantic addresses.
5. Registers are virtual and unbounded at IR level; physical allocation is a later target concern.

## Why not pure Stack VM

A pure stack model introduces hidden state through push/pop order. That is compact and interpreter-friendly, but less suitable for reversible editing, source maps, visual authoring and explicit provenance because intermediate value identity is implicit.

## Why not pure Register VM

A pure register machine handles explicit dataflow well, but event/world execution still requires structured invocation context, return boundaries, capability context and trap provenance. Encoding all of that as ordinary registers would blur lifecycle semantics.

## Canonical frame

```text
ExecutionFrame
  frameId
  kind            = World | Event | Action
  owner
  parentFrame
  registers
  arguments
  returnValue
  programCounter
  capabilityContext
  provenance
  status
```

## Canonical register

```text
Register
  id              = r0, r1, ...
  type
  value
  initialized
  provenance
```

## Invariants

- reading an uninitialized register is a trap;
- type identity follows haKodan Type System;
- register IDs are local to a frame;
- event actions execute in canonical declared order;
- semantic addresses and table indices remain distinct;
- source-language profile cannot alter execution semantics;
- register allocation is deterministic at Opcode IR generation time.

## Consequence

Instruction Encoding v0.1 will be designed for explicit operands, for example conceptually:

```text
LOAD_CONST r0, const#1
LOAD_PROPERTY r1, address#3
CALL_ACTION symbol#7, r0
STORE_PROPERTY address#3, r1
RETURN r1
```

These names are illustrative semantics only. Numeric opcodes are not assigned by this ADR.
