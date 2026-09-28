# HNK40 → KODESCRIPT Family Baseline V1

Status: STRUCTURAL_ONLY / EXPERIMENTAL
Date: 2026-09-28

## Purpose

Use the HNK40 Hybrid V1 benchmark as the first measured corpus for the HNK-KODESCRIPT structural family taxonomy without assigning semantics.

## Input

- 40 HNK40 legacy identities.
- 42 E5 projection candidates because G17 and G20 retain two candidates each.
- Feature vector: `GFV-N12-0.1`.
- Mathematical universe: HNK-2647892 N=12 render-distinct geometric identities.

## Measured family cardinality inside the HNK40 benchmark

Across the 42 projection candidates:

- `coarse`: **1** family
- `topological`: **4** families
- `radialAngular`: **6** families

This is a property of the HNK40 benchmark only. It is **not** the family count of the full 2,647,892-space.

## Ambiguous legacy identities

G17 and G20 remain identity-ambiguous at E5.

For both:

- coarse family: stable across both candidates;
- topological family: stable across both candidates;
- radialAngular family: not stable.

Observed difference:

- one candidate has circular angular span 6;
- the other has circular angular span 7.

Therefore ambiguity can disappear at one abstraction layer while remaining visible at another. KODESCRIPT must preserve both identity ambiguity and per-family stability instead of forcing one scalar resolution.

## Important finding

The HNK40 seed occupies a very narrow structural region:

All current HNK40 E5 candidates share the same coarse signature:

`MF_CG|N:12-0-0|E:7-4-0-0-0`

That means the 40 Genesis forms are useful as a regression/benchmark family but cannot by themselves represent the diversity of the complete 2,647,892 identity space.

## Acquisition implication

The next acquisition corpus must deliberately sample outside the HNK40 neighborhood.

Minimum target:

1. preserve HNK40 as benchmark/core;
2. select representatives from distinct topological/radial-angular families;
3. include MF↔CG forms;
4. include the single CR:D geometric class;
5. reserve whole families/neighborhoods as unseen transfer tests.

The learning objective remains generative literacy, not memorization of millions of glyphs.

## Machine artifacts

- `data/benchmarks/hnk40-e5-hybrid-projection.v1.json`
- `data/benchmarks/hnk40-kodescript-family-classification.v1.json`
- `packages/kodescript/src/glyph-feature-vector.mjs`
- `packages/kodescript/src/benchmark-family-classifier.mjs`

## Next gate

Build a cloud-shardable family census over the full HNK-2647892 universe and compute:

- number of coarse families;
- number of topological families;
- number of radialAngular families;
- family-size distribution;
- representative identity per family;
- nearest-family/confusion neighborhoods.

No semantic or phonological meaning is assigned by this census.
