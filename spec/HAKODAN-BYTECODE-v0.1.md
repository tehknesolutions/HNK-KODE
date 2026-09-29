# haKodan Bytecode v0.1

**Status:** deterministic framed bytecode baseline  
**Data:** 2026-09-29

## Scope

haKodan Bytecode v0.1 formalizes the first binary representation of canonical HNK-IR.

It is **not yet a VM instruction set** and must not be described as native machine code.

v0.1 is a deterministic binary envelope around canonical HNK-IR JSON. A future bytecode version may introduce opcodes while preserving versioned decoding.

## Frame

All integers are unsigned big-endian.

```text
offset  size  field
0       4     magic = ASCII "HAKD"
4       1     major = 0
5       1     minor = 1
6       2     flags = 0
8       4     payloadLength
12      4     checksum FNV-1a 32-bit
16      N     UTF-8 canonical HNK-IR payload
```

## Invariants

1. Magic must be `HAKD`.
2. Version must be recognized.
3. Payload length must exactly match remaining bytes.
4. Checksum must validate.
5. Payload must parse as HNK-IR JSON.
6. Equivalent PT-BR and EN programs must produce byte-for-byte identical bytecode.
7. HNK profile remains locked while required HNK programming lexemes are unresolved.

## Canonical payload

Canonical JSON recursively sorts object keys before UTF-8 encoding. Arrays preserve semantic order.

## Future evolution

Reserved future layers:
- constant table;
- symbol table;
- type table;
- opcode stream;
- source/provenance map;
- manifestation metadata;
- signatures/capabilities.

Any incompatible change increments the bytecode version.
