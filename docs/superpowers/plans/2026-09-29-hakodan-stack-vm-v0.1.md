# haKodan Stack VM v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first deterministic, verified, sandboxed haKodan Stack VM without reinterpreting the existing HAKD 0.1 HNK-IR envelope.

**Architecture:** Add a separate executable artifact path: deterministic tables → semantic Opcode IR → executable encoding → verifier → loader/runtime. Keep modules small and reuse the existing type/component/event contracts; execution is single-threaded, typed, capability-denied by default and terminates only as HALTED, RETURNED or TRAPPED.

**Tech Stack:** Node.js ESM (`.mjs`), built-in `node:test`, `assert/strict`, existing haKodan canonical/type/component/event modules.

**Spec:** `docs/superpowers/specs/2026-09-29-hakodan-stack-vm-v0.1-design.md`

## Global Constraints

- Existing `HAKD 0.1` remains canonical HNK-IR serialization and must retain all regression tests.
- Candidate Semantic ISA v0.1 has exactly 17 operations and no external-I/O opcode.
- Semantic opcode contracts are frozen before numeric encoding is assigned.
- VM is stack-based, single-threaded, deterministic, typed, fail-closed and capability-denied by default.
- `DECODE → VERIFY → LOAD → EXECUTE`; invalid executable input executes zero instructions.
- Terminal execution states are exactly `HALTED`, `RETURNED`, `TRAPPED`.
- Provenance/debug metadata cannot alter execution semantics.
- HNK programming profile remains fail-closed where canonical lexemes are unresolved.

## Review Focus

- Malformed control-flow targets must be rejected before execution, never trapped after partial mutation.
- Empty `EVENT_NEXT` must deterministically produce `Event?` empty state without blocking or consulting host time.
- Recursive/deep calls, stack growth and event floods must end in deterministic `RESOURCE_LIMIT` traps.
- Forged object/component handles must never reach host memory or mutate an unrelated object.
- Executables with/without provenance maps must produce identical semantic outcomes.

---
### Task 1: Deterministic VM Tables

**Files:**
- Create: `packages/hakodan/src/vm-tables.mjs`
- Test: `packages/hakodan/test/vm-tables.test.mjs`

**Interfaces:**
- Consumes: HNK-IR plus existing `TYPE_IDS`/type descriptors.
- Produces: `buildVmTables(ir) -> { constants, symbols, types }`, deeply immutable; `resolveVmIndex(table, semanticId) -> number`.

- [ ] **Step 1: Write failing tests** proving constants deduplicate deterministically, semantic IDs sort/map independently of source-language names, tables are frozen, and unknown semantic IDs fail closed.
- [ ] **Step 2: Run** `node --test packages/hakodan/test/vm-tables.test.mjs`; expect FAIL because `vm-tables.mjs` does not exist.
- [ ] **Step 3: Implement** `buildVmTables(ir)` and `resolveVmIndex(table, semanticId)` with deterministic ordering and no mutation of HNK-IR.
- [ ] **Step 4: Run focal test**; expect all PASS, then run `node --test packages/hakodan/test/*.test.mjs`.
- [ ] **Step 5: Commit** `feat(hakodan): add deterministic VM tables`.

### Task 2: Semantic Opcode IR Contracts

**Files:**
- Create: `packages/hakodan/src/vm-opcode-ir.mjs`
- Test: `packages/hakodan/test/vm-opcode-ir.test.mjs`

**Interfaces:**
- Consumes: deterministic table indices and canonical IDs from Task 1.
- Produces: `VM_OPCODE_NAMES`, `createOpcodeIr(operation, operands, provenanceId?)`, `opcodeContract(operation)`; no numeric opcode values.

- [ ] **Step 1: Write failing tests** asserting exactly the 17 approved names, immutable Opcode IR, declared operand shape/stack effect for every operation, and rejection of unknown operations.
- [ ] **Step 2: Run focal test**; expect module-not-found/undefined contract failure.
- [ ] **Step 3: Implement** semantic contracts for `NOP HALT TRAP CONST POP DUP OBJECT_REF COMPONENT_REF LOAD_SLOT STORE_SLOT EVENT_NEW EVENT_EMIT EVENT_NEXT EVENT_PAYLOAD JUMP JUMP_IF CALL RETURN`.
- [ ] **Step 4: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 5: Commit** `feat(hakodan): define semantic VM opcode IR`.
### Task 3: Executable Format and Deterministic Encoding

**Files:**
- Create: `packages/hakodan/src/vm-executable.mjs`
- Test: `packages/hakodan/test/vm-executable.test.mjs`
- Regression: `packages/hakodan/test/bytecode.test.mjs`

**Interfaces:**
- Consumes: `{ tables, instructions, entrypoint, budgets, provenanceMap? }` built from Tasks 1–2.
- Produces: `encodeVmExecutable(program) -> Uint8Array`, `decodeVmExecutable(bytes) -> decodedProgram`; executable format/version is distinct from `HAKD 0.1`.

- [ ] **Step 1: Write failing tests** for deterministic bytes, round-trip, distinct executable format/version, corruption/version rejection, and identical executable semantics with provenance omitted.
- [ ] **Step 2: Run focal + existing bytecode tests**; new tests FAIL while HAKD 0.1 remains GREEN.
- [ ] **Step 3: Implement** a deterministic versioned executable envelope and assign numeric opcodes only here, one stable code per frozen semantic operation.
- [ ] **Step 4: Run focal, `bytecode.test.mjs`, then all haKodan tests**; expect PASS.
- [ ] **Step 5: Commit** `feat(hakodan): add deterministic VM executable format`.

### Task 4: Static Verifier

**Files:**
- Create: `packages/hakodan/src/vm-verifier.mjs`
- Test: `packages/hakodan/test/vm-verifier.test.mjs`

**Interfaces:**
- Consumes: decoded executable from Task 3 and opcode contracts from Task 2.
- Produces: `verifyVmExecutable(program) -> frozen verifiedProgram`; throws `HAKODAN_VM_VERIFY_*` before runtime exists.

- [ ] **Step 1: Write failing tests** for illegal opcode, malformed operand, table OOB, invalid jump/call boundary, arity/signature mismatch, incompatible stack merge, invalid provenance map, and malformed resource declarations.
- [ ] **Step 2: Add the Review Focus test**: malformed control-flow target is rejected by `verifyVmExecutable` and no executor callback/state mutation occurs.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** verifier data-flow checks and freeze the verified result.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): verify VM executables before load`.
### Task 5: Typed Runtime, Stack, Frames, Traps and Budgets

**Files:**
- Create: `packages/hakodan/src/vm-runtime.mjs`
- Test: `packages/hakodan/test/vm-runtime.test.mjs`

**Interfaces:**
- Consumes: verified program from Task 4 and existing `runtimeTypeOf`/`isAssignable`.
- Produces: `createVmRuntime(verifiedProgram, budgets)`, `pushVmValue`, `popVmValue`, `enterVmFrame`, `leaveVmFrame`, `trapVm`; terminal state schema `{ status, trapCode?, instructionOffset?, provenance? }`.

- [ ] **Step 1: Write failing tests** for typed push/pop, underflow/overflow, isolated frames, 0..1 typed return, and exact terminal-state vocabulary.
- [ ] **Step 2: Add Review Focus tests** for recursive frame growth and operand-stack growth ending in deterministic `RESOURCE_LIMIT`, not host exceptions.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** runtime primitives and deterministic instruction/stack/frame/object/event budget counters; translate internal failures to VM traps.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): add typed deterministic VM runtime`.

### Task 6: Object and Component Handles

**Files:**
- Create: `packages/hakodan/src/vm-handles.mjs`
- Test: `packages/hakodan/test/vm-handles.test.mjs`

**Interfaces:**
- Consumes: loaded object/component state plus existing component definitions/type checks.
- Produces: `createObjectHandle(objectIndex)`, `resolveComponentHandle(runtime, objectHandle, componentTypeId)`, `loadComponentSlot`, `storeComponentSlot`.

- [ ] **Step 1: Write failing tests** for valid resolution, typed LOAD/STORE, unknown object/component/slot, and immutable handle representation.
- [ ] **Step 2: Add Review Focus test** forging object/component indices; assert `INVALID_HANDLE`/`INVALID_COMPONENT` and zero mutation of unrelated objects.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** index-based validated handles only; never expose host object pointers as VM addresses.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): add validated VM object component handles`.
### Task 7: Deterministic Event Queue

**Files:**
- Create: `packages/hakodan/src/vm-events.mjs`
- Test: `packages/hakodan/test/vm-events.test.mjs`

**Interfaces:**
- Consumes: canonical event descriptors from `event-model.mjs`, runtime budget state and validated target handles.
- Produces: `createVmEvent`, `emitVmEvent`, `nextVmEvent`, `eventPayload`; `nextVmEvent` returns `Event?` without blocking.

- [ ] **Step 1: Write failing tests** for canonical event IDs, payload typing, FIFO ordering, invalid event/target and queue budget.
- [ ] **Step 2: Add Review Focus tests**: empty queue returns deterministic empty optional without timers; event flood traps `RESOURCE_LIMIT` at the same count on repeated runs.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** the in-memory FIFO queue with no host event-loop/time dependency.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): add deterministic VM event queue`.

### Task 8: Interpreter and 17 Opcode Semantics

**Files:**
- Create: `packages/hakodan/src/vm-executor.mjs`
- Test: `packages/hakodan/test/vm-executor.test.mjs`

**Interfaces:**
- Consumes: verified/loaded program, runtime primitives, handles, events and semantic opcode contracts.
- Produces: `executeVm(verifiedProgram, options?) -> { status: 'HALTED'|'RETURNED'|'TRAPPED', ... }`.

- [ ] **Step 1: Write failing tests** for `NOP/HALT/TRAP`, `CONST/POP/DUP`, object/component slot operations, all four event operations, `JUMP/JUMP_IF`, and `CALL target, argc`/`RETURN` 0..1.
- [ ] **Step 2: Write trap tests** for all required trap classes and prove host JavaScript exceptions do not escape as VM semantics.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** one deterministic dispatch loop; increment instruction budget before each instruction and use only verified instruction boundaries.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): execute semantic VM opcode set`.
### Task 9: HNK-IR → Opcode IR Lowering and Provenance

**Files:**
- Create: `packages/hakodan/src/vm-lowering.mjs`
- Test: `packages/hakodan/test/vm-lowering.test.mjs`

**Interfaces:**
- Consumes: canonical HNK-IR, Task 1 tables and Task 2 Opcode IR constructors.
- Produces: `lowerIrToVmProgram(ir, options?) -> { tables, instructions, entrypoint, budgets, provenanceMap }`.

- [ ] **Step 1: Write failing tests** for deterministic lowering, canonical IDs independent of PT-BR/EN surface names, valid provenance chain, and fail-closed unsupported IR constructs.
- [ ] **Step 2: Add Review Focus test**: strip `provenanceMap`, encode/verify/execute both artifacts and assert identical terminal status and state.
- [ ] **Step 3: Run focal test**; expect FAIL.
- [ ] **Step 4: Implement** only IR forms currently supported by canonical haKodan lowering; do not invent HNK lexemes or automatic canonical bindings.
- [ ] **Step 5: Run focal + all haKodan tests**; expect PASS.
- [ ] **Step 6: Commit** `feat(hakodan): lower HNK IR to VM opcode IR`.

### Task 10: End-to-End Executable Equivalence and Release Gate

**Files:**
- Create: `packages/hakodan/test/vm-end-to-end.test.mjs`
- Create: `docs/superpowers/HAKODAN-VM-V0.1-COMPLIANCE.md`
- Modify only if required by public exports: `packages/hakodan/src/index.mjs` or the repository's existing export surface.

**Interfaces:**
- Consumes: existing PT-BR/EN parser/lowering pipeline plus Tasks 1–9.
- Produces: executable equivalence proof and release compliance matrix.

- [ ] **Step 1: Write end-to-end tests** proving equivalent PT-BR/EN source → same canonical semantics → same VM program/executable behavior; HNK unresolved profile remains fail-closed.
- [ ] **Step 2: Add regression tests** proving legacy `encodeBytecode/decodeBytecode` still round-trip HAKD 0.1 and are not accepted as executable VM artifacts.
- [ ] **Step 3: Run** `node --test packages/hakodan/test/*.test.mjs`; expect PASS.
- [ ] **Step 4: Run repository gates**: `node --test packages/kodescript/test/*.test.mjs`, `node --test tests/hnk-2647892-kernel.test.mjs`, and `git diff --check`; all exits must be `0`.
- [ ] **Step 5: Write compliance matrix** mapping every design-spec invariant to module/test evidence and marking only `PASS`, `BLOCKED`, or `OUT-OF-SCOPE`.
- [ ] **Step 6: Commit** `docs(hakodan): close VM v0.1 release gate`.
