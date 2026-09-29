# haKodan VM Opcode Readiness Gate v0.1

**Status:** PRE-OPCODE GATE  
**Data:** 2026-09-29

## Purpose

This gate defines what must be stable before haKodan introduces an executable VM opcode stream.

## Completed prerequisites

- Canonical semantic token IDs independent of surface language.
- PT-BR and EN profiles converging to the same AST/HNK-IR.
- HNK profile fail-closed while programming lexemes remain unresolved.
- HOM v0.1.
- Type System v0.1.
- Component Model v0.1.
- Event Model v0.1.
- Deterministic canonical HNK-IR serialization.
- Framed haKodan Bytecode v0.1 with version, size and integrity checksum.
- PT-BR/EN byte-for-byte bytecode equivalence.

## Required before Opcode Set v0.1 is frozen

1. ✅ Symbol Table contract — completed in HAKODAN-SYMBOL-TABLE-v0.1.
2. ✅ Constant Pool contract — completed in HAKODAN-CONSTANT-POOL-v0.1.
3. ✅ Type Table encoding — completed in HAKODAN-TYPE-TABLE-v0.1.
4. ✅ Object/Component addressing contract — completed in HAKODAN-OBJECT-COMPONENT-ADDRESSING-v0.1.
5. ✅ Event dispatch contract — completed in HAKODAN-EVENT-DISPATCH-v0.1.
6. ✅ Execution model decision — Hybrid VM (typed virtual registers + structured frames), accepted in ADR-HAKODAN-VM-EXECUTION-MODEL-v0.1.
7. ✅ Deterministic instruction encoding — completed in HAKODAN-INSTRUCTION-ENCODING-v0.1 with initial Opcode IR and binary instruction records.
8. Error/trap model.
9. Capability/security boundary.
10. Source/provenance mapping from opcode offset back to HNK-IR/AST/source.

## Current readiness

**7/10 prerequisites completed.**

A deterministic pre-opcode package now combines canonical HNK-IR with Symbol, Constant, Type, Address and Event Dispatch tables. It is still intentionally not a complete VM until traps, capabilities and source maps are frozen.

## Rule

No opcode may be assigned for numerological convenience or to fill an address space.

Opcode semantics come first. Numeric encoding is assigned only after the semantic instruction set is reviewed.

## Planned execution chain

```text
HNK-KODE
  ↓
AST
  ↓
HOM
  ↓
HNK-IR
  ↓
Symbol/Constant/Type Tables
  ↓
Opcode IR
  ↓
haKodan VM Bytecode
  ↓
VM
  ↓
Manifestation
```

Bytecode v0.1 remains a canonical HNK-IR binary envelope until this gate is satisfied.
