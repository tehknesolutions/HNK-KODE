# HNK40 — Visual Reconciliation V1

Status: **ACTIVE / RESEARCH / NON-CANONICAL**

## Purpose

Reconcile the three currently available visual/structural layers without silently replacing any of them:

1. E5 Mandala structural PATH projections.
2. Historical HNK40 V2 Candidate D vector freeze.
3. New HENUVOKODAN visual plates / glyph proposals.

The goal is to measure preservation, divergence and unresolved identity before any final visual promotion.

## Authority boundary

- E5 PATH geometry is structural evidence, not semantic or visual canon.
- Candidate D is a historically frozen visual candidate, not automatically `VISUAL-CANON-V2`.
- New visual plates are proposals until individually reconciled and explicitly promoted by the Human Gate.
- No semantic, phonological, sacred, numerological, PUA or Unicode assignment may be inferred from geometric similarity alone.

## Frozen inputs

### E5 structural layer

- Rule: `HNK40-E5-V4-DIRECTION-DISTANCE@1`.
- 40 legacy identities.
- 4 DIRECT.
- 34 DERIVED_UNIQUE.
- 2 DERIVED_AMBIGUOUS (`G17`, `G20`).
- 0 NO_E5_PROJECTION.

Ambiguous records remain candidate sets and MUST NOT be collapsed by visual convenience.

### Candidate D historical visual layer

Historical evidence records:

- 40/40 vector glyphs frozen as candidates.
- machine legibility/uniqueness PASS at 16/24/32/48 px.
- high-risk similarity pairs: 0.
- medium-risk similarity pairs: 0.
- maximum measured similarity: 0.549.
- sprite SHA-256: `87ee43f3785165397752a21eaceffcda8b3240748125062ca275bf8d46234ca4`.
- ordered G01–G40 SHA-256: `78668df0f707952b7c280de52526abaa2b7900597fb8ff362a3a08641fd1bce5`.

Historical gate state was `READY_FOR_FINAL_HUMAN_PROMOTION`, not final visual canon.

### Mandala renderer geometry

Frozen structural measurements used for reconciliation:

- source canvas: 900×900.
- center: `(449.5,449.5)`.
- 72 sectors × 5°.
- Sector 01 starts at 90°.
- six radial data layers.
- measured radial boundaries: `168.5 → 190.5 → 208.5 → 231.5 → 310.5 → 387.5 → 419.5` px.

## Reconciliation pipeline

For each `G01…G40`, produce one record with:

- `glyphId`
- E5 resolution status
- E5 preferred projection or candidate set
- Candidate D vector identity/hash
- new-plate identity/reference when available
- normalized geometric descriptors
- topology descriptors
- visual-distance metrics
- preservation classification
- human-review state

### Preservation classification

Allowed states:

- `PRESERVED`
- `PRESERVED_WITH_STYLING`
- `STRUCTURAL_VARIANT`
- `VISUAL_REDESIGN`
- `AMBIGUOUS_E5`
- `MISSING_NEW_PLATE`
- `REQUIRES_HUMAN_GATE`

No classification promotes canon by itself.

## Comparison order

1. Verify identity and provenance.
2. Normalize Candidate D vectors without destroying topology.
3. Render E5 PATH using frozen Mandala coordinates.
4. Normalize new plate geometry when available.
5. Compare topology first, geometry second, styling third.
6. Record exact divergences rather than forcing equivalence.
7. Route G17/G20 through ambiguity-aware comparison against every minimum-score E5 candidate.
8. Generate a 40-row reconciliation matrix.
9. Run pairwise confusion/legibility regression after any accepted redesign.
10. Submit only the resulting exact vector set to the Human Gate.

## Promotion rule

`VISUAL-CANON-V2` may be declared only after explicit Human Gate approval of an exact ordered G01–G40 vector set and its integrity hashes.

Approval of this research pipeline is not approval of any individual visual glyph.

## Immediate next artifact

`data/benchmarks/hnk40-visual-reconciliation.v1.json`

This artifact SHALL preserve unresolved/missing evidence explicitly and SHALL NOT fabricate new-plate geometry when source plates are unavailable.