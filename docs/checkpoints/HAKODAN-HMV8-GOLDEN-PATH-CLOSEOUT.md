# haKodan HMV-8 — ALEF → MALKUTH Golden Path Closeout

Parent product track: #189
Date: 2026-10-02
Status: FIRST_VERTICAL_SLICE_COMPLETE

## Result

haKodan has crossed its first evidence-backed manifestation vertical slice.

```text
ALEF / Creator intention
  -> haKodan source
  -> parser / AST
  -> HNK-IR
  -> HOM
  -> hakodan.target.html-document.v1
  -> deterministic HTML artifact
  -> browser execution
  -> EVENT iniciar
  -> ACTION mostrar(value)
  -> runtime DOM mutation
  -> human-visible result
  -> execution evidence binding
  -> MALKUTH
```

## Completed gates

- HMV-1 — existing haKodan pipeline inventory: COMPLETE
- HMV-2 — minimal semantic slice (`WORLD`, `ENTITY`, `PROPERTY`, `EVENT`, `ACTION`): COMPLETE
- HMV-3 — first concrete target selection: COMPLETE
- HMV-4 — deterministic HTML target adapter: COMPLETE
- HMV-4.1 — event-boundary + strict `mostrar(value)` corrections: COMPLETE
- HMV-5 — reproducible versioned source/generator/artifact: COMPLETE
- HMV-6 — browser-observed execution: PASS
- HMV-7 — runtime evidence bound to source/pipeline/target/artifact: COMPLETE
- HMV-8 — Golden Path closeout: THIS DOCUMENT

## Repository anchors

Primary package: `packages/hakodan`

First canonical example:
- `packages/hakodan/examples/primeira-manifestacao.hakodan`

Generator:
- `packages/hakodan/examples/generate-primeira-manifestacao.mjs`

First target:
- `packages/hakodan/src/target-html-document.mjs`
- target id: `hakodan.target.html-document.v1`

First generated artifact:
- `packages/hakodan/examples/primeira-manifestacao.html`

Execution ledger:
- `docs/checkpoints/HAKODAN-HMV7-RUNTIME-EVIDENCE.md`

Relevant integrations:
- PR #191 — initial HTML target
- PR #192 — event/arity correctness hardening
- PR #193 — first reproducible manifestation artifact
- PR #195 — execution-evidence binding

## What is now proven

For the first vertical slice, repository evidence plus browser observation supports all of the following:

1. haKodan source can represent the frozen semantic subset.
2. The source crosses parser/AST, HNK-IR and HOM boundaries.
3. A concrete haKodan-owned target adapter can lower canonical data into an executable artifact.
4. The artifact is self-contained and browser-executable.
5. A startup event can dispatch a supported action.
6. The action causes a human-visible runtime effect.
7. The observed execution can be bound back to the source, compiler path, target and artifact.

## What is NOT proven

This closeout does not claim:

- full haKodan language completeness;
- generalized natural-language ALEF interpretation;
- arbitrary application/game/site generation;
- generalized event conditions or reactive spatial logic;
- loops, conditionals, functions, inheritance, networking or persistence;
- multiple production-grade targets;
- full HNK40 Creator Canon completion;
- that Goodle is required for haKodan execution;
- that M1–M62 infrastructure equals haKodan product completeness.

## Product interpretation

The project has moved from "architecture capable of describing manifestation" to "one real manifestation path exists and has executed".

The next phase should therefore expand **capability**, not add another evidence/seal/archive layer.

## Recommended next product phase — HAKODAN MANIFESTATION V2

Goal: evolve the proof into a useful creation kernel while keeping ALEF → MALKUTH as the governing test.

Critical path:

1. **Intent Front Door** — accept a structured Creator intention and compile it into the existing canonical semantic surface without requiring hand-authored haKodan source for every creation.
2. **Reactive semantics** — add minimal condition/trigger support so `when entity approaches portal -> open portal` becomes canonical rather than target-specific scripting.
3. **State mutation** — actions must be able to change canonical entity/property state, not only append text.
4. **Manifestation V2 target behavior** — render entities as manipulable scene objects and reflect state changes visibly.
5. **Second Golden Scenario** — `Abra's Island + Alakazam + Portal`: when Alakazam approaches the portal, the portal opens.
6. **Evidence after execution** — continue binding runtime evidence only after the requested behavior is actually observed.

## V2 acceptance scenario

```text
Creator intention:
Create a world named Abra's Island.
Put an entity named Alakazam in it.
Put a portal in the world.
When Alakazam approaches the portal, open the portal.
```

Required observable result:
- world is manifested;
- Alakazam is represented as an entity;
- portal is represented as an entity/object;
- proximity/trigger condition is evaluated at runtime;
- portal state changes from closed to open;
- the state transition is visible;
- evidence binds the observed transition to the originating intention and artifact.

## Governing rule

From this checkpoint onward:

> If a task does not materially improve haKodan's ability to transform ALEF into observable MALKUTH, it is not on the critical path.

Goodle and the M1–M62 evidence/provenance infrastructure remain subordinate supporting systems unless a concrete haKodan capability requires them.
