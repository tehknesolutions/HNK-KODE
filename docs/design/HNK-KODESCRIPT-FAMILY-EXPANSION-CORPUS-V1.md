# HNK-KODESCRIPT — Family Expansion Corpus V1

Status: EXPERIMENTAL / STRUCTURAL_ONLY  
Date: 2026-09-28

## Objective

Build the first controlled corpus outside the HNK40 Genesis neighborhood and test whether acquisition transfers to structurally unseen glyph families.

No new semantic, phonological, grammatical or sacred binding is created by this protocol.

## Starting point

The exact N=12 universe contains:

- 2,647,892 render-distinct geometric identities;
- 256 coarse families;
- 11,492 topological families;
- 3,041 radial-angular families.

HNK40 currently occupies only 1 coarse, 4 topological and 6 radial-angular families. Therefore HNK40 alone cannot test generalization over the complete KODESCRIPT geometry.

## Experimental unit

The unit of expansion is a **family representative**, not an automatically invented letter or word.

For reproducibility, each selected family must use a deterministic representative: the minimum canonical identity key available in that family.

## Pilot V1

The first pilot targets:

- 32 novel coarse families;
- 64 novel topological families;
- 64 novel radial-angular families;
- at least 32 controlled nearest-family contrast pairs;
- one deterministic representative per selected family;
- 25% of selected families reserved as unseen transfer holdouts.

These numbers are experimental acquisition parameters. They are not linguistic or mathematical canon.

## Family-size strata

Sampling must cover:

1. singleton families;
2. small families: 2–31 identities;
3. medium families: 32–255 identities;
4. large families: 256+ identities.

This prevents the pilot from learning only the densest regions of the space.

## Splits

### HNK40_BENCHMARK

Governed Genesis/regression forms remain visible as the known baseline.

### TRAIN

Families used to teach structural primitives and family rules.

### CONTRAST

Near-neighbor families selected specifically to expose confusions and discriminative features.

### TRANSFER

Whole families never shown during training. Success here measures rule generalization rather than memorization.

### AMBIGUOUS_HOLDOUT

G17 and G20 remain unresolved candidate sets. They are not force-resolved to satisfy a training target.

## Measurements

The pilot records:

- recognition accuracy;
- production accuracy;
- response time;
- confusion matrix;
- delayed retention;
- unseen-family transfer;
- ability to explain the structural rule;
- evidence of memorization versus productive rule use.

## Relationship to language

A geometric representative can become an experimental acquisition stimulus without becoming a linguistic sign.

The following remain forbidden as automatic consequences of geometry:

- assigning a phoneme;
- assigning a lexeme;
- assigning a morpheme;
- assigning grammar;
- assigning sacred correspondence;
- assigning AST/IR behavior;
- promoting a candidate into HNK canon.

Any such promotion requires an explicit HNK-KODE decision, provenance, conflict checking and tests.

## Next implementation gate

Generate a machine-readable representative registry from the exact family census, with deterministic family IDs, representative identity keys, size strata and TRAIN/CONTRAST/TRANSFER split assignments.
