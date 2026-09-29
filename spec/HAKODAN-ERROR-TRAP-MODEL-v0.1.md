# haKodan Error / Trap Model v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Defines canonical runtime failures for the haKodan Hybrid VM.

## Categories

```text
CompileError
ValidationError
TypeError
AddressError
SymbolError
RegisterError
InstructionError
CapabilityError
RuntimeTrap
```

## Canonical trap shape

```text
code
category
message
frameId
owner
programCounter
instruction
provenance
details
fatal
```

## Required trap codes v0.1

```text
TRAP_UNINITIALIZED_REGISTER
TRAP_REGISTER_NOT_DECLARED
TRAP_REGISTER_TYPE_MISMATCH
TRAP_SYMBOL_NOT_FOUND
TRAP_ADDRESS_NOT_FOUND
TRAP_CONSTANT_NOT_FOUND
TRAP_INVALID_OPCODE
TRAP_INVALID_OPERAND
TRAP_PROGRAM_COUNTER
TRAP_RUNTIME_ACTION
```

## Rules

1. Trap codes are stable semantic identifiers.
2. Human-readable messages are not the protocol.
3. A trapped frame transitions to status `trapped`.
4. Program counter and provenance must be captured when available.
5. Unknown or malformed instructions fail closed.
6. Trap objects are serializable and deterministic.
7. Surface language profile cannot change trap semantics.
8. Capability denials will use this model after Capability/Security v0.1 is frozen.
