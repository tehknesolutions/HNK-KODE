# Goodle × HNK-KODE — Architecture Reconciliation M0

**Status:** INTEGRATION BASELINE  
**Date:** 2026-09-29  
**Source systems:** `tehknesolutions/goodle-browser` and `tehknesolutions/HNK-KODE`

## Purpose

This document records the first reconciliation pass before deeper migration.

The objective is not to erase either architecture. It is to assign each existing responsibility to one authoritative layer and use explicit adapters where the models differ.

## Decision matrix

| Area | Goodle | HNK-KODE / haKodan | Decision |
|---|---|---|---|
| Creator experience | Strong product surface | Studio foundation | KEEP GOODLE + integrate into Studio |
| GAIC / creator intent | Goodle-native | ALEF / Intent | ADAPTER / shared intent contract |
| GoodProject | Product truth | HOM/AST are computational models | KEEP GOODLE; lower to haKodan |
| GoodWorld | Product/world model | HOM | KEEP GOODLE; adapter |
| Semantic Dictionary | Goodle source vocabulary | HNK Semantic Token Registry | SHARED CONTRACT; HNK registry is canonical |
| Goodle IR | Creator-layer normalized IR | HNK-IR | KEEP GOODLE IR; adapter/lowering |
| OldRewrite | Creator syntax | HNK-KODE profiles | KEEP as compatibility surface; converge semantics |
| Events/actions | Goodle behavior model | haKodan Event/Action Model | ADAPTER |
| Types | Goodle partial model | haKodan Type System | HAKODAN |
| Blocks | Goodle authoring | Block Contract V1 | SHARED CONTRACT / adapter |
| Runtime | GoodRuntime | haKodan runtime/VM | HAKODAN as execution authority; GoodRuntime becomes adapter/orchestration |
| HyperKernel | Goodle orchestration | haKodan kernel/runtime | RE-SCOPE; do not duplicate VM semantics |
| Manifestation | Goodle product promise | HME/targets | SHARED BOUNDARY; haKodan executes canonical lowering |
| Provenance | Goodle metadata | HNK governance + provenance | SHARED CONTRACT |
| Studio | GoodStudio | HNK-KODE Studio | UNIFY product surface |
| Browser | Goodle Browser | no equivalent requirement | KEEP GOODLE as visible creator surface |
| React/Phaser | Goodle manifestation technologies | target adapters | TARGETS, never semantic authority |
| Godot/BYOND/RPG Maker | Goodle source/adapter knowledge | target/source adapters | ADAPTER KNOWLEDGE |
| CODEX authority | Goodle consumer | ROOT CANON | CODEX-HNK remains ROOT |
| TEHKNE-OS evidence | Goodle consumes principles | provenance/knowledge layer | CROSS-CUTTING |

## 1. GoodProject ↔ HOM

Do not declare these equivalent.

GoodProject is the Goodle product-level source model. HOM is the canonical computational object model.

Required path:

```
GoodProject
  ↓
GoodWorld / GoodEntity / GoodComponent / GoodBehavior
  ↓
Semantic IDs + typed lowering
  ↓
haKodan AST / HOM
  ↓
HNK-IR
```

GoodProject retains creator-facing concepts that have no direct HOM equivalent.

## 2. Goodle IR ↔ HNK-IR

Do not merge the formats in V0.1.

Goodle IR is intentionally small and creator-oriented:

```
id
semantica
familia
parametros
filhos
origem
metadados
```

HNK-IR is deeper and execution-oriented.

Therefore:

```
Goodle IR → adapter/lowering → haKodan AST/HOM → HNK-IR
```

No third universal IR is introduced.

## 3. Semantic Dictionary ↔ HNK Registry

This is the most important authority correction.

The Goodle dictionary can preserve:

- source term;
- source family;
- equivalence level;
- historical Goodle semantic ID;
- contextual requirements.

But it MUST NOT invent HNK-KODE canonical IDs.

Current bootstrap HNK registry contains IDs such as:

```
WORLD
AREA
OBJECT
ENTITY
COMPONENT
CLASS
INTERFACE
SYSTEM
EVENT
ACTION
WHEN
IF
ELSE
RETURN
EMIT
OBSERVE
EXPERIENCE
SCENE
CHARACTER
INTENT
MANIFEST
LANGUAGE
```

Goodle mappings are only promoted when an exact registry-backed semantic identity exists.

Example:

```
Goodle: quando
  source ID: comportamento.reacao.quando
  HNK ID: WHEN
  status: MAPPED

Goodle: posicionar / position
  source ID: espaco.posicao
  HNK ID: none
  status: UNMAPPED
```

This preserves source knowledge without silently expanding the HNK canon.

## 4. OldRewrite ↔ HNK-KODE surface

OldRewrite remains a compatibility/creator surface.

It should eventually converge on the same semantic registry used by PT-BR, EN and future HNK profiles.

The parser must not contain runtime-specific logic.

## 5. GoodStudio ↔ HNK-KODE Studio

Do not maintain two IDE products long-term.

Recommended final naming:

**HNK-KODE Studio**

with **Goodle Creator** as the creator-facing experience/layer.

Conceptually:

```
HNK-KODE Studio
 ├── Goodle Creator
 ├── language editor
 ├── visual/block editor
 ├── semantic inspector
 ├── HOM/AST inspector
 ├── HNK-IR inspector
 ├── runtime console
 └── manifestation controls
```

## 6. GoodRuntime ↔ haKodan Runtime

GoodRuntime should not remain a competing execution kernel.

It can survive as:

- creator orchestration;
- capability broker;
- compatibility adapter;
- browser integration;
- experience session layer.

Canonical program semantics and execution contracts belong to haKodan.

## 7. GAIC ↔ ALEF / Intent

These should converge through a shared intent contract.

Goodle/GAIC is responsible for understanding creator intent and generating proposals.

haKodan is responsible for canonical semantic representation after intent resolution.

Rule:

```
Human intent remains authoritative.
AI proposes.
Canonical contracts validate.
```

## 8. GoodWorld ↔ HNK Object Model

GoodWorld should remain the high-level world authoring model.

Its concepts should map progressively:

```
GoodWorld
 ├── GoodScene      → SCENE / HOM structures
 ├── GoodEntity     → ENTITY / HOM
 ├── GoodComponent  → COMPONENT / HOM
 ├── GoodBehavior   → EVENT/ACTION + systems
 ├── GoodData       → typed HOM data
 └── GoodRule       → canonical behavior/event structures
```

Mappings that are not yet represented in HNK-KODE remain UNRESOLVED/UNMAPPED.

## 9. Provenance

Every lowering step must retain origin.

Minimum provenance:

```
sourceProject
sourceRepository
sourcePath
sourceVersion
sourceSemanticId
sourceTerm
equivalence
authorityStatus
targetSemanticId
```

This permits reconstruction and audit.

## 10. Authority stack

```
CODEX-HNK
  ROOT CANON
      ↓
HNK-KODE
  DOMAIN CANON
      ↓
haKodan
  COMPUTATIONAL FRAMEWORK / RUNTIME
      ↓
Goodle
  CREATOR / AUTHORING EXPERIENCE
      ↓
Targets / Experiences
```

TEHKNE-OS remains cross-cutting for knowledge, evidence and provenance.

## 11. Explicit non-decisions

The following remain unresolved until dedicated reconciliation:

- full GoodProject-to-HOM mapping;
- complete GoodWorld component taxonomy;
- Goodle runtime memory vs haKodan memory model;
- HyperKernel capability boundaries;
- HEPGA vs HNK artifact/package model;
- visual editor model;
- OldRewrite full grammar;
- automatic target selection;
- complete semantic registry coverage.

These must not be silently decided by implementation.

## 12. M0 acceptance

M0 is structurally accepted when:

1. Goodle is inside HNK-KODE as a creator layer;
2. Goodle IR remains distinct from HNK-IR;
3. GoodProject remains distinct from HOM;
4. Goodle source semantics retain provenance;
5. only registry-backed IDs enter canonical HNK lowering;
6. unsupported mappings remain explicitly UNMAPPED;
7. no third universal IR is introduced;
8. haKodan remains the computational authority;
9. CODEX-HNK remains ROOT CANON.

Next gate: **M1 — GoodProject / GoodWorld contract extraction and adapter design.**
