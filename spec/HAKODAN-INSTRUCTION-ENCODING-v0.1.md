# haKodan Instruction Encoding v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Defines the first deterministic mapping from semantic Opcode IR instructions to binary instruction records for the haKodan Hybrid VM.

## Principle

Semantic instruction identity is defined first. Numeric opcode values are transport encodings only.

## Initial semantic instruction set

```text
NOP
LOAD_CONST
LOAD_PROPERTY
STORE_PROPERTY
CALL_ACTION
RETURN
```

This set is intentionally minimal and only covers the current vertical slice.

## Operand kinds

```text
Register
ConstantIndex
AddressIndex
SymbolIndex
None
```

## Canonical encodings

Each instruction record is encoded as:

```text
1 byte  opcode
1 byte  operandCount
N * 5 bytes operands
```

Each operand is:

```text
1 byte  kind
4 bytes unsigned value (big-endian)
```

Operand kind codes:

```text
0 None
1 Register
2 ConstantIndex
3 AddressIndex
4 SymbolIndex
```

Opcode codes v0.1:

```text
0x00 NOP
0x01 LOAD_CONST
0x02 LOAD_PROPERTY
0x03 STORE_PROPERTY
0x04 CALL_ACTION
0x05 RETURN
```

These numbers have no symbolic or numerological meaning.

## Arity contracts

- NOP: 0
- LOAD_CONST: Register, ConstantIndex
- LOAD_PROPERTY: Register, AddressIndex
- STORE_PROPERTY: AddressIndex, Register
- CALL_ACTION: SymbolIndex, Register*
- RETURN: 0 or Register

## Determinism

Equivalent PT-BR and EN source programs must produce the same Opcode IR and byte-for-byte identical instruction encoding.

## Boundary

This encoding does not yet define traps, capability checks or source maps. Those remain separate readiness requirements.
