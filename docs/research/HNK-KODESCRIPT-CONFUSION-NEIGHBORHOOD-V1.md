# HNK-KODESCRIPT — Confusion Neighborhood V1

Status: EXPERIMENTAL / STRUCTURAL_ONLY  
Date: 2026-09-28

Family Expansion Corpus V1 already provides 96 deterministic representatives: 72 TRAIN and 24 HOLDOUT, with zero TRAIN/HOLDOUT coarse-family overlap. This document defines the next acquisition layer: structural confusion neighborhoods.

## Purpose

A learner should not only recognize isolated forms. The system must measure whether nearby structural forms are confused and whether learned distinctions transfer to unseen families.

## Distance V1

The V1 metric combines only structural features already present in the family keys:

- component mismatch penalty;
- L1 difference across coarse node/edge counts;
- position-wise mismatch across the normalized topological edge sequence;
- L1 difference across radial/angular features.

No lexeme, phoneme, semantic label, sacred correspondence or grammar role participates in the distance.

## Outputs

The engine can produce:

1. the nearest N structural neighbors for every corpus representative;
2. deterministic nearest contrast pairs;
3. cross-split TRAIN/HOLDOUT comparisons without changing holdout authority.

The initial experiment target is 32 unique contrast pairs.

## Interpretation

A low distance means two forms are structurally similar under this V1 feature metric. It does **not** mean they are semantically related.

Confusion data can later be used to improve teaching order, spacing and discrimination exercises. It cannot automatically create or promote a linguistic binding.

## Implementation

- `packages/kodescript/src/confusion-neighborhood.mjs`
- `packages/kodescript/test/confusion-neighborhood.test.mjs`
- source corpus: `data/acquisition/hnk-family-expansion-corpus.v1.json`

## Next gate

Materialize the 32-pair contrast registry after CI verification, then define the first acquisition-session protocol combining:

`16-glyph 90% language core -> HNK40 structural expansion -> family-expansion contrasts -> unseen-family transfer`.
