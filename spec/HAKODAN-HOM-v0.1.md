# haKodan HOM — HNK Object Model v0.1

**Status:** executable baseline  
**Data:** 2026-09-29  
**Authority:** haKodan / HNK-KODE

## Purpose

HOM is the canonical object model between semantic AST and HNK-IR. It defines what an object *is* independently of its rendering or target runtime.

## Canonical shape

Every HOM object may expose these canonical fields:

```text
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

## Rules

- Identity is stable and addressable through an HNK URI.
- Type expresses semantic identity/contracts.
- Properties hold declared values.
- Components add capabilities without requiring inheritance.
- Relations connect objects semantically.
- Behaviors declare executable capabilities.
- Events model causal triggers.
- Narrative is first-class executable/contextual structure.
- Assets and presentation are target-independent references/specifications.
- Manifestations declare allowable outputs.
- Provenance tracks source profile, AST lineage, IR lineage and build lineage.

## Vertical slice mapping

For v0.1:

```text
WorldDeclaration → HOM World
EntityDeclaration → HOM Entity
PropertyDeclaration → HOM properties
EventDeclaration → HOM Event
ActionDeclaration → HOM Action behavior
```

The model intentionally leaves advanced fields empty until the corresponding language features exist. Empty fields are explicit; they are not invented from context.

## Boundary

HOM is not JavaScript classes, C# classes, Unity GameObjects, React components, Phaser objects or database records. Those are possible target representations of HOM entities.
