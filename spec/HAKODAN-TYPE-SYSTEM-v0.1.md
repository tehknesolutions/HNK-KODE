# haKodan Type System v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

The haKodan Type System defines language-neutral semantic types used by AST, HOM, HNK-IR, components, events and future VM opcodes.

## Primitive semantic types

```text
Any
Boolean
Number
String
IdentifierRef
Void
```

These names are internal semantic identifiers, not surface-language keywords.

## Core rules

1. Surface language never defines type identity.
2. PT-BR, EN and future HNK lexical profiles resolve to the same semantic type IDs.
3. Literal types are inferred deterministically.
4. Assignability is explicit.
5. `Any` accepts any value.
6. `Void` represents absence of a value and is not assignable from ordinary literals.
7. Unknown semantic types fail closed.

## v0.1 assignability

- same type → assignable;
- any concrete type → Any;
- Number does not implicitly coerce to String;
- Boolean does not implicitly coerce to Number;
- IdentifierRef is distinct from String.

No silent coercion is allowed in v0.1.
