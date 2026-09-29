# haKodan Universal Target Ladder V1

## Principle

Kodin semantics are target-independent.

```text
KODIN
→ Semantic ID
→ AST
→ HOM
→ HNK-IR
→ backend/lowering
→ target
```

## Target families

### Source targets
TypeScript, JavaScript, Python, C#, C++, Rust, PHP, Java/Kotlin, Swift and future validated adapters.

### Portable/low-level IR
WebAssembly, LLVM IR and domain IRs where applicable.

### VM/bytecode
haKodan bytecode; adapters may target JVM bytecode or .NET IL when formally implemented.

### Native
x86-64, ARM64, RISC-V or future ISA through a validated compiler backend/assembler.

### Binary containers
Platform-specific formats such as ELF, PE/COFF and Mach-O.

## Constraint

haKodan may be described as convertible to **any target for which a validated backend exists**. It must not claim one universal native binary.

Source maps/provenance should trace low-level output back to HNK-IR, AST and semantic source.
