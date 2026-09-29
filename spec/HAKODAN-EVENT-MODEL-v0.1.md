# haKodan Event Model v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Events formalize causal behavior independently of renderer/runtime.

## Event descriptor

```text
id
name
payloadType
actions[]
provenance
```

## Action descriptor

```text
id
name
arguments[]
returnType
```

## Rules

- event IDs are deterministic within their owning world/object;
- action order is semantically significant;
- payload types use haKodan Type System IDs;
- event/action names remain user-domain identifiers, not reserved keywords;
- source profile is provenance only and cannot change event semantics.
