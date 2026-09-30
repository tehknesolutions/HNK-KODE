# M1 — GoodProject / GoodWorld Contract Extraction

**Status:** IMPLEMENTED AS ADAPTER BASELINE  
**Date:** 2026-09-29

## Source of truth for this gate

The current Goodle source model is named **GoodProjeto** in:

`tehknesolutions/goodle-browser/src/nucleo/modelo/GoodProjeto.ts`

The source currently defines:

- `IntencaoGoodle`
- `ComponenteGoodle`
- `CenaGoodle`
- `RegraGoodle`
- `GoodProjeto`

There is no separate `GoodWorld` TypeScript model in the inspected source path. Therefore this gate does **not** invent one. World semantics are currently represented by the project/cena/componente model and by the Goodle IR/behavior surfaces.

## Exact source contract

### IntencaoGoodle

- `descricao: string`
- `objetivo?: string`
- `restricoes?: string[]`

Decision: **KEEP GOODLE / shared input contract**

The intent remains creator-facing information and must survive every lowering step.

### ComponenteGoodle

- `id`
- `tipo: aplicacao | jogo | sistema`
- `nome`
- `versao`
- `manifestacao: visual | interativa | sistema | hibrida`
- `configuracao?`
- `componentesFilhos?`

Decision:

- identity/name/version/type → **ADAPTER → HOM candidate**
- manifestation → **KEEP GOODLE / target metadata**
- configuration → **KEEP GOODLE until a lossless typed HOM contract exists**
- child components → **UNRESOLVED until canonical HOM relation/component contract**

### CenaGoodle

- `id`
- `nome`
- `componentes: string[]`

Decision: **KEEP GOODLE + UNRESOLVED canonical lowering**

The current haKodan vertical slice does not yet expose a SceneDeclaration.

### RegraGoodle

- `id`
- `nome`
- `expressao?`
- `habilitada`

Decision: **KEEP GOODLE + ADAPTER later**

The current canonical event/action parser is not sufficient to lower arbitrary Goodle rules losslessly.

## What haKodan currently supports

The current vertical slice supports:

```
WORLD
  ├── ENTITY
  │     └── PROPERTY
  │
  └── EVENT
        └── ACTION
```

The HOM model already provides a richer structural envelope:

```
identity
type
state
properties
components
relations
behaviors
events
narrative
assets
presentation
data
manifestations
provenance
```

But the existing parser/lowering path does not yet populate every HOM field from GoodProjeto.

Therefore M1 uses **partial lowering with preservation**, not destructive conversion.

## Adapter contract

```
GoodProjeto
    ↓
normalizeGoodProjeto()
    ↓
GoodProjetoNormalized
    ├── creator
    ├── components
    ├── scenes
    ├── rules
    └── provenance
    ↓
lowerGoodProjeto()
    ↓
CanonicalAstCandidate
    ├── ast
    ├── preservedCreatorModel
    └── diagnostics
```

The canonical candidate currently lowers supported components into named EntityDeclaration nodes.

Unsupported concepts are reported explicitly:

```
PARTIAL
  cenas → UNRESOLVED
  regras → UNRESOLVED
  component configuration → UNRESOLVED
  child components → UNRESOLVED
```

## Non-loss rule

The adapter MUST NOT treat successful AST generation as permission to discard Goodle data.

The original creator model remains available in:

`preservedCreatorModel`

and carries source provenance.

## Provenance minimum

Every normalized GoodProjeto records:

- source repository;
- source path;
- source project ID;
- source project version;
- source model;
- adapter version;
- authority status.

## Explicitly not decided

M1 does not decide:

- final HOM component schema;
- scene semantics;
- arbitrary rule semantics;
- GoodWorld as a new independent model;
- GoodRuntime memory ownership;
- target manifestation selection;
- HNK lexical forms.

Those require later reconciliation gates.

## Acceptance evidence

Fixture:

`packages/goodle/test/fixtures/good-projeto-m1.json`

Tests:

`packages/goodle/test/good-project-adapter.test.mjs`

The fixture demonstrates that a project containing:

- intent;
- component;
- scene;
- rule;
- component configuration

can be normalized and partially lowered while retaining all unsupported creator-level information.

## Next gate

**M2 — Behavior / Event reconciliation**

M2 should reconcile:

```
Goodle:
ExpressaoGoodle
FluxoGoodle
RegraGoodle

↕ adapter

haKodan:
EventDeclaration
ActionDeclaration
Event Model
HOM behaviors/events
```

No arbitrary Goodle rule should be promoted to canonical execution semantics until that contract is explicit.
