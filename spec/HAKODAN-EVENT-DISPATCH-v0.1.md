# haKodan Event Dispatch Contract v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Defines deterministic event lookup and action dispatch before VM opcodes exist.

## Dispatch model

```text
emit event-id + payload
  ↓
resolve event descriptor
  ↓
validate payload type
  ↓
execute actions in declared order
```

## Rules

1. Event identity is semantic and deterministic.
2. Dispatch order follows the canonical action list.
3. Unknown events fail closed.
4. Payload types use haKodan Type System IDs.
5. v0.1 dispatch is synchronous and ordered.
6. Dispatch returns an execution plan; it does not execute target/runtime side effects yet.
7. PT-BR and EN equivalent source must produce identical dispatch plans.
