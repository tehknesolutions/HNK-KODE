# haKodan Type Table v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

The Type Table maps semantic type IDs to deterministic compact indices used by future VM instructions and binary tables.

## v0.1 canonical order

```text
0 Any
1 Boolean
2 Number
3 String
4 IdentifierRef
5 Void
```

## Rules

- numeric indices are transport encodings, not semantic meaning;
- order is versioned;
- a future incompatible reorder requires a table-format version change;
- PT-BR, EN and future HNK profiles use the same table.
