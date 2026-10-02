# haKodan Manifestation V2-1 — Minimal Reactive Semantics

Parent: #199
Date: 2026-10-02
Status: FROZEN FOR V2 GOLDEN SCENARIO

## Repository baseline

The current language already reserves semantic token `WHEN` (`quando` / `when`), but the parser does not yet consume it. Current events contain only actions; entities contain literal properties; HOM already exposes `state`, `relations`, `behaviors`, and `events` surfaces that can carry the V2 model without making the HTML target the semantic authority.

## Goal

Add the smallest canonical reactive model needed to express:

> When Alakazam approaches Portal, set Portal.open = true.

V2-1 defines semantics only. Parser/runtime/target implementation belongs to V2-2+.

## Canonical reactive primitives

### 1. TRIGGER
A trigger starts evaluation of a reactive rule. For V2 the only required trigger is world/runtime update (`tick`). It is an execution concern and must not encode browser events as canonical semantics.

### 2. CONDITION
A condition is a pure predicate over canonical runtime state. V2 requires one predicate:

`NEAR(subject, target, threshold)`

Semantics: true when Euclidean distance between subject and target positions is less than or equal to threshold.

Canonical position for this slice:

```text
entity.state.position = { x: Number, y: Number }
```

Distance:

```text
sqrt((subject.x-target.x)^2 + (subject.y-target.y)^2) <= threshold
```

The condition must not mutate state.

### 3. REACTIVE RULE
A rule binds trigger + condition + actions.

Canonical conceptual shape:

```text
ReactiveRule {
  id
  trigger
  condition
  actions[]
}
```

For V2 the rule is level-triggered: while the condition is true it may be evaluated repeatedly, but state mutation must be deterministic and idempotent for the Golden Scenario.

### 4. STATE MUTATION
V2 requires one canonical mutation action:

`SET(subject, path, value)`

Golden Scenario instance:

```text
SET(Portal, state.open, true)
```

The mutation belongs to haKodan runtime semantics. Targets only observe/render the resulting canonical state.

## Golden Scenario canonical model

```text
World: AbrasIsland

Entity: Alakazam
  state.position = { x: 0, y: 0 }

Entity: Portal
  state.position = { x: 10, y: 0 }
  state.open = false

ReactiveRule: OpenPortalWhenAlakazamApproaches
  trigger = tick
  condition = NEAR(Alakazam, Portal, 2)
  actions = [SET(Portal, state.open, true)]
```

Initial state MUST keep Portal closed. A test/runtime driver may move Alakazam toward Portal by changing canonical position; the portal transition must result from evaluation of the rule, not from target-specific JavaScript that directly opens it.

## AST direction for V2-2

The minimal new AST nodes should preserve semantics rather than browser mechanics:

```text
WhenDeclaration
NearCondition
SetAction
EntityReference
StatePath
```

No DOM selectors, CSS classes, keyboard keys, animation APIs, or browser event names belong in these nodes.

## HNK-IR direction for V2-2

HNK-IR should carry:

```text
world.entities[].state
world.rules[] {
  id,
  trigger,
  condition,
  actions
}
```

The IR must resolve entity references to canonical entity IDs before target lowering.

## HOM direction for V2-2

HOM should use its existing generic surfaces:

- entity `state` for `position` and `open`;
- world `behaviors` for reactive rules;
- existing object identity IDs for references;
- provenance on introduced rule/state semantics.

## Determinism

Given identical canonical state + rule set + runtime step:

- condition result must be identical;
- action order must be stable;
- state mutation result must be identical;
- no random values or wall-clock time may participate in V2 Golden Scenario semantics.

## Explicit non-goals

V2-1 does NOT define:

- generalized physics/collision engine;
- arbitrary boolean expression language;
- nested condition trees;
- else branches;
- loops;
- async actions;
- networking;
- persistence;
- animation semantics;
- generalized 3D vectors;
- target/browser event semantics.

Those remain backlog until a concrete haKodan capability requires them.

## Acceptance contract for V2-2/V2-3

Implementation must prove:

1. canonical source/AST can represent the rule without target-specific leakage;
2. HNK-IR resolves Alakazam and Portal identities;
3. HOM carries positions, portal open state, and the reactive behavior;
4. runtime evaluates NEAR from canonical state;
5. moving Alakazam outside threshold keeps Portal closed;
6. moving Alakazam inside threshold causes SET to transition Portal `false -> true`;
7. repeated evaluation remains deterministic;
8. unsupported reactive constructs fail explicitly.

## Governing boundary

haKodan owns reactive semantics and canonical state transitions. HTML/browser manifestation may expose controls to move Alakazam and may render the Portal, but it must consume the haKodan state transition rather than redefine it.
