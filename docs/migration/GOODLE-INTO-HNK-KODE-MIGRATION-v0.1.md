# Goodle → HNK-KODE — Migration & Unification v0.1

**Status:** INTEGRATION BRANCH  
**Source:** `tehknesolutions/goodle-browser`  
**Target:** `tehknesolutions/HNK-KODE`

## Decision

Goodle is being brought into HNK-KODE as the **creator/authoring layer**, while haKodan remains the **canonical computational framework/kernel**.

This is a unification, not a blind copy.

### Canonical boundaries

```text
CODEX-HNK
  ↓ root knowledge / canon
HNK-KODE
  ├── language
  ├── semantic registry
  ├── haKodan
  │    ├── AST
  │    ├── HOM
  │    ├── HNK-IR
  │    ├── lowering
  │    ├── VM/runtime
  │    └── manifestation
  │
  └── Goodle
       ├── creator intent / GAIC
       ├── GoodProject
       ├── GoodWorld authoring model
       ├── Semantic Bridge
       ├── OldRewrite compatibility surface
       ├── visual/block authoring
       └── creator/browser UX contracts
```

## What is absorbed

From Goodle:

- GoodProject / GoodWorld authoring concepts.
- Semantic Bridge and source-family equivalence model.
- OldRewrite compatibility surface.
- Goodle IR as a **creator-layer intermediate representation**.
- HyperKernel orchestration concept, re-scoped as an authoring/execution gateway over haKodan.
- Runtime memory concepts useful for conformance tests and local simulation.
- Tests proving semantic equivalence and behavior.

## What is not duplicated

Goodle MUST NOT create a second competing:

- HNK semantic registry;
- HNK AST;
- HOM;
- HNK-IR;
- type system;
- opcode model;
- VM;
- manifestation engine.

Those remain haKodan responsibilities.

## Translation boundary

```text
Goodle Surface / GoodProject
        ↓
Goodle Semantic Bridge
        ↓
Goodle IR
        ↓
Goodle → haKodan adapter
        ↓
Canonical HNK-KODE Semantic IDs
        ↓
haKodan AST / HOM
        ↓
HNK-IR
        ↓
Target / Runtime / Manifestation
```

## Semantic identity rule

A Goodle semantic concept MUST resolve to a canonical HNK Semantic ID before entering the canonical haKodan pipeline.

Goodle aliases are surface vocabulary, not canonical semantic authority.

Example:

```text
Goodle:
  criar / create

        ↓

HNK Semantic ID:
  ACTION.CREATE

        ↓

haKodan:
  canonical AST / block / IR
```

## Equivalence rule

Goodle's existing equivalence classes:

- direct;
- approximate;
- contextual;
- lossy;

are retained as **mapping metadata**. They do not redefine canonical HNK semantics.

## Source-family rule

Goodle's existing source families such as:

- Phaser
- Godot
- BYOND
- RPG Maker
- TypeScript
- React
- backend

remain adapter/projection knowledge.

They do not become HNK-KODE language authorities.

## Runtime rule

Goodle Runtime/HyperKernel becomes an orchestration boundary. Actual canonical execution must progressively lower into haKodan runtime contracts.

## Migration phases

### M1 — Contract
- establish package boundary;
- establish Semantic Bridge → HNK Semantic ID contract;
- preserve Goodle provenance.

### M2 — Authoring model
- migrate GoodProject/GoodWorld contracts;
- map entities/components/scenes/behaviors to HOM without collapsing the models prematurely.

### M3 — OldRewrite
- migrate parser;
- preserve compatibility;
- lower supported OldRewrite constructs into canonical HNK semantics.

### M4 — Behavior
- migrate event/behavior model;
- map Goodle behavior events to haKodan event descriptors.

### M5 — Runtime
- migrate useful Goodle memory/runtime tests;
- replace duplicate execution paths with haKodan adapters.

### M6 — Studio / Browser
- migrate creator UX contracts;
- Goodle becomes the creator-facing layer of HNK-KODE Studio.

### M7 — Cutover
- HNK-KODE becomes the authoritative repository;
- goodle-browser becomes historical/provenance source;
- duplicate canonical implementations are deprecated only after conformance evidence.

## Non-goals

This migration does NOT:

- delete goodle-browser immediately;
- rewrite HNK-KODE canon;
- promote Goodle aliases into HNK canon;
- force Goodle IR to equal HNK-IR;
- replace HOM with GoodWorld;
- create a third universal IR.

## Acceptance gate

The migration is considered structurally successful when:

1. a Goodle authoring input resolves to canonical HNK Semantic IDs;
2. the same intent can enter haKodan without semantic duplication;
3. provenance identifies Goodle as the originating surface;
4. supported OldRewrite constructs can be validated;
5. the resulting canonical representation can continue through existing haKodan pipelines;
6. no external target becomes semantic authority.
