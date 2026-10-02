# M8 — Target Capability Inventory

Status: IN PROGRESS
Date: 2026-10-02

## Purpose

Advance the Goodle → HNK-KODE → haKodan roadmap after M7 without treating unavailable local/CI execution as a global project lock.

M7 established the explicit `TargetCapabilityRegistry` contract. M8 connects that registry to an auditable inventory of real targets and requires each target path to remain explicit about support.

## Authority boundary

- Goodle remains creator/product-facing.
- HNK-KODE owns shared contracts and semantic identity.
- haKodan remains execution-semantics authority.
- A target capability declaration is evidence of an adapter contract, not permission to invent missing semantics.
- Missing target support MUST resolve as `UNSUPPORTED`.

## Existing M7 contract

A target capability is keyed by:

- `target`
- `format`
- `adapter`

and must declare:

- `artifactPattern`
- `authority`

Resolution returns only `SUPPORTED` or `UNSUPPORTED`.

## M8 inventory record

Every inventory entry MUST carry:

```js
{
  id,
  target,
  format,
  adapter,
  artifactPattern,
  authority,
  source,
  maturity
}
```

`maturity` is one of:

- `DECLARED` — contract exists, runtime conformance not yet proven;
- `CONFORMANT` — repository evidence proves the adapter conforms to the declared contract;
- `UNRESOLVED` — target is known but a safe adapter contract is not yet established.

## Rules

1. Inventory only repository-supported targets; do not invent adapters from product intent.
2. Registration MUST pass through `registerTargetCapability`.
3. Inventory lookup MUST preserve the M7 `SUPPORTED/UNSUPPORTED` behavior.
4. `UNRESOLVED` inventory entries MUST NOT be registered as executable capabilities.
5. Authority and source provenance remain visible in every entry.
6. M8 does not create a third universal IR.
7. External executor availability is supplementary evidence, not a prerequisite for repository increments.

## Acceptance gate

M8 is complete when:

- real target candidates are inventoried from repository evidence;
- supported entries can build a `TargetCapabilityRegistry` deterministically;
- unresolved targets remain non-executable;
- conformance tests cover supported, unsupported, duplicate/conflicting, and unresolved cases;
- public package exports expose the inventory API deliberately;
- the next gate can connect inventory entries to actual target adapters without weakening authority boundaries.

## Next implementation slice

1. Add failing contract tests for the inventory API.
2. Implement `target-capability-inventory.mjs` as a thin layer over M7.
3. Seed only targets supported by repository evidence.
4. Export the API from `packages/goodle/src/index.mjs`.
5. Record executable evidence when available; otherwise classify it according to verification governance and continue without fabricating PASS.
