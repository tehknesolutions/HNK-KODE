# HNK-KODESCRIPT — Acquisition Architecture V0.1

Date: 2026-09-27
Status: **DESIGN HYPOTHESES / NOT YET CANONICAL BINDINGS**

## 1. Starting point

The current Mandala N=12 evidence establishes:

```text
7,289,096,672 raw walks
→ 95,284,518 simple paths
→ 47,642,259 reversal classes
→ 2,647,892 geometric classes
→ 2,647,892 render-distinct classes
```

The final currently-computable value **2,647,892** is a geometric identity capacity. It is not an alphabet size, lexicon size, phoneme count or semantic inventory.

## 2. Product separation

```text
MANDALA MATHEMATICS
        ↓
HNK-KODESCRIPT
        ↓
LINGUISTIC BINDING
        ↓
HNK-KODE / HENUVOKODAN
        ↓
LEXICON + GRAMMAR + PROGRAMMING SEMANTICS
        ↓
ACQUISITION / USE / SW LAB
```

- **HNK-KODE** = language authority and, by current project direction, language + full-stack language substrate.
- **HNK-KODESCRIPT** = visual/script encoding, rendering, input, addressing and glyph-composition layer.
- **Mandala** = mathematical/geometric substrate.
- **Strangeverse (SW)** = consumer and acquisition laboratory; it does not independently redefine HNK-KODE canon.

## 3. Core acquisition hypothesis

Humans MUST NOT be expected to memorize 2,647,892 glyphs.

The target is generative literacy:

```text
small learned core
→ recognizable geometric families
→ functional classes
→ roots
→ morphemes
→ words / expressions / code
→ inference of unseen glyphs
```

Primary success criterion:

> A learner can encounter an unseen valid glyph and infer part of its structure/function from previously learned rules.

## 4. Candidate information channels

These are hypotheses to test, not semantic canon.

### H1 — radial layer → broad functional class

A Mandala radial layer may encode a high-level class such as lexical, grammatical, operator, control, relational or metadata family.

Risk: imposing semantics onto geometry without learnability evidence.

### H2 — sector / angular family → root family

Angular location or D9-compatible family membership may identify semantic/phonological root neighborhoods.

Constraint: canonical meaning cannot be inferred merely because a sector exists.

### H3 — path topology → morphological operation

Features of the ordered path may encode derivation/composition behavior. Candidate measurable features include turn sequence, radial transitions, angular transitions, edge-class sequence and structural motifs.

Constraint: reverse traversal does not create a new base geometric identity under the current E5 law.

### H4 — direction → execution metadata

Because `FORM != EXECUTION`, traversal direction may carry a second channel without multiplying base forms. Candidate uses include reading/execution direction, inflection, aspect, voice, polarity or computational execution metadata.

No one candidate use is canonical yet.

### H5 — transform/profile → controlled modifiers

Render/execution profiles may expose controlled non-identity metadata such as color, sound, animation, spatial projection or runtime behavior, provided base glyph identity remains stable.

### H6 — namespace → domain separation

Reserve explicit namespaces so human language, sacred names, runtime/system instructions, Strangeverse content, experimental material and future domains cannot collide silently.

## 5. Learning ladder

The acquisition system should test progressive sets rather than the whole space.

### L0 — primitives

Learn Mandala address logic, path notion, `FORM != EXECUTION`, and a tiny set of visual primitives.

### L1 — canonical core

Teach only explicitly governed HNK-KODE material: core language identity, approved lexemes and approved grammar components.

### L2 — Genesis benchmark

Use HNK40 as a recognition/production benchmark family, not as the alphabet ceiling.

### L3 — families

Teach geometric families and contrast sets. Measure confusion between nearest forms.

### L4 — productive morphology

Teach rules that let learners predict derived function rather than memorize isolated forms.

### L5 — unseen-form inference

Present structurally valid unseen glyphs and measure what learners can correctly infer.

### L6 — composition / code

Move from isolated glyphs into sequences, expressions, AST/IR mappings and executable HNK-KODE constructs once semantics are explicitly bound.

## 6. SW acquisition laboratory

Strangeverse can test acquisition diegetically through:

- inscriptions;
- UI labels;
- puzzles;
- names;
- crafting/technomagic;
- Shimokode interactions;
- controlled recognition tasks;
- production tasks;
- transfer to unseen glyphs.

Telemetry should measure at least:

- recognition accuracy;
- production accuracy;
- response time;
- confusion pairs;
- retention after delay;
- transfer/inference on unseen forms;
- rule use vs rote memorization.

The goal is not to maximize exposure. The goal is to discover the smallest rule system that unlocks the largest reliable expressive space.

## 7. Full-stack / computational bridge

A later HNK-KODE computational layer should preserve reversible stages where possible:

```text
TEXT
↔ AST
↔ HNK-IR
↔ KODESCRIPT PATH/GLYPH
↔ MANDALA ADDRESS/GEOMETRY
```

Visual existence alone MUST NOT imply executable semantics. Execution requires an explicit governed binding from glyph/path to AST/IR operation.

## 8. Evaluation matrix

Every proposed mathematical→linguistic binding should be scored experimentally on:

1. determinism — same rule yields same interpretation;
2. reversibility — encoding can be decoded without hidden information where required;
3. visual separability — low confusion between forms;
4. learnability — humans acquire the rule with reasonable exposure;
5. productivity — learned rules generalize to unseen forms;
6. compositionality — parts combine predictably;
7. namespace safety — domains do not collide silently;
8. backward compatibility — existing HNK-KODE canon is not silently rewritten;
9. computational utility — rule can map cleanly into AST/IR where intended;
10. governance — authority/provenance is explicit.

## 9. First experiment proposal

Do **not** start by assigning all 2,647,892 forms.

Build a controlled experimental corpus:

- governed canonical core;
- HNK40 benchmark;
- a small number of deliberately selected geometric families;
- matched nearest-neighbor/confusion controls;
- unseen forms reserved for transfer testing.

Compare at least three encoding hypotheses:

- A: mostly arbitrary symbol→meaning binding;
- B: family-based visual morphology;
- C: family + topology + execution-metadata composition.

The winning architecture should be chosen by measured acquisition/generalization, not numerology alone.

## 10. Canon gate

No hypothesis in sections 4 or 9 becomes HNK canon merely by being mathematically elegant. Promotion requires:

`STRUCTURAL PROOF → IMPLEMENTATION → HUMAN/ACQUISITION TEST → CONFLICT CHECK → HNK AUTHORITY DECISION → HNK_CANON`

## 11. Immediate implementation targets

1. define machine-readable `GlyphFeatureVector` for N=12 forms;
2. define namespace registry;
3. define binding schema separating geometry from linguistic meaning;
4. define acquisition experiment schema;
5. generate family candidates from measurable path features;
6. integrate HNK40 as benchmark corpus;
7. reserve unseen test corpus;
8. connect SW telemetry later without granting SW authority over the language.
