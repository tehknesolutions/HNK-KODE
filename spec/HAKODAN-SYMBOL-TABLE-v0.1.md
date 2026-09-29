# haKodan Symbol Table v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

The Symbol Table assigns deterministic semantic addresses to named HNK-IR objects before opcode generation.

## Symbol kinds

- World
- Entity
- Property
- Event
- Action

## Entry shape

```text
index
id
kind
name
owner
type
```

## Rules

1. Symbols are derived from canonical HNK-IR, never from surface-language spellings.
2. Symbol order is deterministic.
3. Symbol IDs are globally stable inside the compiled world graph.
4. Duplicate semantic IDs are rejected.
5. Property symbols reference semantic type IDs.
6. PT-BR and EN equivalents must produce identical symbol tables.
