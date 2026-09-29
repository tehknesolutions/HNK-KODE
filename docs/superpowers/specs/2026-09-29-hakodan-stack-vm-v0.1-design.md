# haKodan Stack VM v0.1 — Design Specification

**Status:** DESIGN APPROVED — pre-implementation
**Date:** 2026-09-29
**Scope:** first executable VM architecture above canonical HNK-IR

## 1. Purpose and boundary

haKodan VM v0.1 introduces deterministic execution without redefining Bytecode v0.1. The existing `HAKD 0.1` artifact remains a deterministic canonical HNK-IR binary envelope, not an executable instruction stream.

The execution pipeline is:

`Source → AST → HOM → HNK-IR → deterministic tables → Opcode IR → VM bytecode → Stack VM`

PT-BR and EN remain surface profiles converging on the same semantics. HNK programming lexemes remain fail-closed until canonically resolved.

## 2. Execution model

The VM is stack-based, single-threaded and deterministic. It has no general-purpose registers. Runtime state contains call frames, a typed operand stack, validated object/component references, a deterministic event queue, resource budgets and terminal/trap state.

Frames are isolated. Stack values carry or resolve to declared VM types. Invalid state never falls through to host-language behavior.

## 3. Tables and addressing

Constant Pool, Symbol Table and Type Table are immutable after loading and produced deterministically. Constant values are deduplicated deterministically.

Canonical semantic identity is distinct from physical table index. Surface-language names do not become runtime identity.
Object/component access uses validated structural handles, conceptually `objectIndex → componentTypeId → slotIndex`; arbitrary memory addresses are impossible.

Events use canonical `eventId + targetHandle + payload`. Event dispatch is FIFO and deterministic. Surface names do not participate in dispatch identity.

## 4. Trap, capability and resource model

`TRAP` and `CAPABILITY` are separate concepts. A trap is a deterministic VM failure; a capability is explicit host-granted authority for an external effect.

Required trap classes include `ILLEGAL_OPCODE`, `STACK_UNDERFLOW`, `STACK_OVERFLOW`, `TYPE_MISMATCH`, `INVALID_CONSTANT`, `INVALID_SYMBOL`, `INVALID_HANDLE`, `INVALID_COMPONENT`, `INVALID_EVENT`, `BAD_CONTROL_FLOW`, `CAPABILITY_DENIED` and `RESOURCE_LIMIT`.

VM v0.1 has no active external I/O capabilities. Filesystem, network, UI, subprocesses, clocks, randomness, persistence, devices and other manifestation effects are unavailable by default.

Execution uses deterministic budgets for instructions, stack depth, frame depth, objects and queued events. Exhaustion produces `RESOURCE_LIMIT` rather than host-dependent behavior.

## 5. Opcode IR, encoding and provenance

Instructions exist first as semantic Opcode IR with no numeric opcode assignment. Numeric encoding is assigned only after semantic contracts are frozen.

VM instruction encoding is deterministic and versioned. Operand shapes are defined by each opcode; operands reference deterministic table indices/IDs rather than host objects.

A separate provenance map links `instructionOffset → opcodeIRId → hnkIrNodeId → astNodeId → sourceSpan/profile`. Provenance is diagnostic metadata, not executable semantics; omitting it must not change VM behavior.

## 6. Candidate Semantic ISA v0.1

The candidate ISA contains exactly 17 semantic operations and no external-I/O instruction:

- Control: `NOP`, `HALT`, `TRAP`.
- Stack/value: `CONST`, `POP`, `DUP`.
- Object/component: `OBJECT_REF`, `COMPONENT_REF`, `LOAD_SLOT`, `STORE_SLOT`.
- Event: `EVENT_NEW`, `EVENT_EMIT`, `EVENT_NEXT`, `EVENT_PAYLOAD`.
- Control flow: `JUMP`, `JUMP_IF`, `CALL`, `RETURN`.

No opcode is assigned a number for numerological convenience or address-space symmetry. Semantics precede encoding.

## 7. Instruction contracts and calling convention

Every opcode contract specifies `stack-before → validation → effect → stack-after → traps → PC behavior`.

Representative stack effects are: `CONST c: [] → [T]`; `POP: [T] → []`; `DUP: [T] → [T,T]`; `JUMP_IF target: [Bool] → []`; `LOAD_SLOT: [ComponentRef] → [T]`; `STORE_SLOT: [ComponentRef,T] → []`.

Calls use `CALL target, argc`. The VM validates the target signature, removes/transfers the declared arguments into a new isolated frame and rejects incompatible arity/types. `RETURN` yields zero or one typed value according to the declared signature. Multiple return values are outside v0.1.

`EVENT_NEXT` is non-blocking and deterministic, producing `Event?`; an empty queue does not consult a clock, scheduler or host event loop.

Control-flow targets must resolve to valid instruction boundaries. Stack/type invariants must remain consistent across converging control-flow paths.

## 8. Verification, loading and lifecycle

Executable artifacts follow the mandatory lifecycle:

`DECODE → VERIFY → LOAD → EXECUTE`

`VERIFY` occurs before runtime mutation. It validates format/version, opcode legality, operand shapes, table bounds, jump/call boundaries, signatures, stack effects across control flow, types, resource declarations and provenance-map structure when present.

Verification failure produces `REJECT`; zero instructions execute.
`LOAD` creates only validated runtime structures. Execution begins at an explicit entrypoint with an empty operand stack, explicit initial frame, empty event queue and host-supplied deterministic budgets.

VM execution has exactly three semantic terminal outcomes: `HALTED`, `RETURNED`, or `TRAPPED`. Host JavaScript exceptions are never official VM semantics.

## 9. Security and determinism invariants

- Opcode availability never implies external authority.
- Capabilities are deny-by-default.
- Invalid bytecode never becomes partially executed state.
- Runtime references cannot forge host memory addresses.
- PT-BR/EN semantic equivalence must survive lowering to executable form.
- HNK profile remains locked where canonical programming lexemes are unresolved.
- Debug/provenance metadata cannot change execution semantics.
- VM v0.1 contains no implicit time, randomness, concurrency or external scheduler dependency.

## 10. Testing and release gate

Implementation must proceed test-first. Required test families cover deterministic table construction, Opcode IR contracts, verifier rejection cases, typed stack behavior, frame/call behavior, object/component handles, FIFO events, traps, resource budgets, provenance mapping, deterministic encoding/decoding and PT-BR/EN executable equivalence.

The existing `HAKD 0.1` envelope tests remain regression gates. Introducing executable VM bytecode requires a distinct versioned format/evolution path; the implementation must not silently reinterpret existing `0.1` payloads as opcodes.

## 11. Out of scope for v0.1

External I/O, filesystem/network/UI access, subprocesses, nondeterministic randomness, wall-clock semantics, multithreading, multiple return values, JIT/native compilation, automatic canonical binding, and numerologically assigned opcode values are explicitly outside v0.1.

## 12. Success criterion

v0.1 succeeds when a verified executable artifact can run deterministically in the sandbox, preserve canonical semantic identity and provenance, enforce types/references/budgets, dispatch internal events deterministically, and terminate only as `HALTED`, `RETURNED` or `TRAPPED` without granting implicit external authority.
