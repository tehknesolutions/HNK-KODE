# haKodan Object/Component Addressing v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Defines stable addresses for HOM objects, properties and attached components before VM opcode generation.

## Address forms

```text
object:     hnk://world/<world>/entity/<entity>
property:   <object>/property/<property>
component:  <object>/component/<component-id>
```

## Rules

1. Addresses derive from semantic IDs, never surface-language spelling.
2. Object addresses are stable across PT-BR/EN profiles.
3. Component addresses are namespaced under their owning object.
4. Duplicate addresses are invalid.
5. Address resolution must fail closed.
6. Numeric symbol indices may optimize transport but cannot replace semantic addresses in provenance.
