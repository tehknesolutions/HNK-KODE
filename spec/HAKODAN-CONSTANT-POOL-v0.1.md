# haKodan Constant Pool v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

The Constant Pool deduplicates literal values used by HNK-IR before opcode generation.

## Entry shape

```text
index
type
value
```

## Rules

1. Constants are canonicalized by semantic type + value.
2. First canonical occurrence determines index.
3. Duplicate literals reuse the same index.
4. Object-key ordering cannot affect pool ordering.
5. PT-BR and EN equivalent programs must produce identical pools.
