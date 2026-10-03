# haKodan V2-13 — Numeric State Operations

V2-13 extends the existing capability registries; it does not add numeric branches to the World Runtime.

## Conditions

- `GT` — state value > comparison value
- `GTE` — state value >= comparison value
- `LT` — state value < comparison value
- `LTE` — state value <= comparison value

All operands must be finite JavaScript numbers. Numeric strings are rejected rather than silently coerced.

## Actions

- `ADD` — adds a finite numeric operand to a numeric state path
- `SUBTRACT` — subtracts a finite numeric operand from a numeric state path

Both use V2-12 nested State Paths and emit the same deterministic change evidence used by other actions.

## Example IR

```js
{
  trigger: "tick",
  condition: { kind: "GT", subject: "alakazam", path: "stats.health", value: 0 },
  actions: [
    { kind: "SUBTRACT", subject: "alakazam", path: "stats.health", value: 25 }
  ]
}
```

This is sufficient as a primitive layer for health, damage, energy, score, resources and counters. Domain-specific clamping/cooldown semantics are intentionally not invented in V2-13.
