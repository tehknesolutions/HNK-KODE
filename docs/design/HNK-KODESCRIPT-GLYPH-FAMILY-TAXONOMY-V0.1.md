# HNK-KODESCRIPT — Structural Glyph Family Taxonomy V0.1

Status: **EXPERIMENTAL / STRUCTURAL_ONLY**

## Purpose

Partition the N=12 render-distinct space into learnable, measurable structural families without assigning language meaning prematurely.

## Family hierarchy

### F0 — connected component

- `MF_CG` — the 441-node outer component governed by D9 geometry.
- `CR_D` — the 12-node dodecad component governed by D12 geometry.

CR:T and CR:H cannot form N=12 simple paths and therefore do not participate in the current E5 N=12 identity space.

### F1 — namespace composition

Group by the tuple:

```text
(MF node count, CG node count, CR_D node count)
```

This separates pure-MF, mixed MF↔CG and CR:D forms without inventing semantics.

### F2 — edge composition

Group by counts of:

```text
MF_ANGULAR
MF_RADIAL
MF_CG
CG_CG
CR_D_CYCLE
```

This measures how a glyph is constructed rather than what it means.

### F3 — transition signature

Count ordered adjacent edge-class transitions, for example:

```text
ANGULAR→ANGULAR
ANGULAR→RADIAL
RADIAL→ANGULAR
RADIAL→MF_CG
MF_CG→CG_CG
...
```

The signature is a candidate predictor of perceived visual/morphological family.

### F4 — radial profile

For MF-containing forms record:

- minimum layer;
- maximum layer;
- radial span;
- number of radial edges;
- outward vs inward execution steps.

Direction-sensitive values belong to execution metadata and MUST NOT create a second base glyph identity by themselves.

### F5 — angular profile

Record:

- angular-edge count;
- clockwise/counterclockwise execution steps;
- absolute angular travel;
- circular sector span.

Raw sector number is not a stable family key under D9 quotienting unless normalized relative to the canonical representative.

### F6 — topological complexity

Record:

- turn count;
- edge-class switch count;
- namespace-switch count;
- structural motif signature;
- nearest structural neighbors.

All current N=12 census members are simple paths, so address revisit is always false in the valid corpus.

## Proposed family keys

### `coarse`

```text
component / namespace-composition / edge-composition
```

Use for broad curriculum buckets.

### `topological`

```text
edge-sequence-normal-form / turn-count / switch-count
```

Use for productive-rule experiments.

### `radialAngular`

```text
radial-span / radial-count / angular-count / circular-span
```

Use for visual-family and confusion experiments.

### `confusionNeighborhood`

Computed from feature distance plus render distance. Use only for experiment design; never treat perceptual proximity as semantic proximity without evidence.

## Distance model V0.1

Candidate structural distance:

```text
D = w1*edgeCompositionDistance
  + w2*transitionDistance
  + w3*radialProfileDistance
  + w4*angularProfileDistance
  + w5*topologyDistance
```

Weights are not frozen. Acquisition experiments should estimate them from human confusion data rather than choosing them numerologically.

## Acquisition use

A training set should contain representatives from multiple families while holding out entire neighborhoods. If learners can infer properties of held-out forms, that is evidence for productive literacy rather than memorization.

Suggested initial corpus sizes are experimental only:

- 40 HNK40 benchmark forms;
- 72–144 structural-family representatives;
- matched nearest-neighbor distractors;
- 20–25% held-out forms/families for transfer tests.

## Canon boundary

This taxonomy classifies **form**. It does not state that radial depth means noun/verb, that an angular sector means a semantic root, or that a topology means a grammatical operation. Those are later binding hypotheses requiring explicit tests and HNK authority approval.
