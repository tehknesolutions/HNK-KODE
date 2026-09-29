# HNK40 Item-Level Reconciliation — E4 → E5

Date: 2026-09-29
Status: RESEARCH_REGISTER / NON-CANONICAL

## Authority boundary

This register records the currently implemented structural bridge only. It does **not** promote E5 identities to linguistic canon.

E4 evidence:
- 40/40 candidates
- 40/40 PATH round-trip
- 40/40 EDGE round-trip
- 40/40 HNKP2 CRC
- 40/40 58-byte packets
- 40/40 immutable HNKP1 evidence
- semantic assignments: 0
- canonical promotions: 0

E5 V4:
- DIRECT: 4
- DERIVED_UNIQUE: 34
- DERIVED_AMBIGUOUS: 2
- NO_E5_PROJECTION: 0
- PENDING_RULE: 0
- ambiguous identities: G17 and G20
- every emitted candidate is a 12-node simple path
- derived projections remain DERIVED_STRUCTURAL and canonical=false

## Item register

| Legacy ID | E5 status | Acquisition mode | Canonical E5 identity |
|---|---|---|---|
| G01 | DIRECT | STRUCTURAL_TARGET | NO |
| G02 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G03 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G04 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G05 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G06 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G07 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G08 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G09 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G10 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G11 | DIRECT | STRUCTURAL_TARGET | NO |
| G12 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G13 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G14 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G15 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G16 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G17 | DERIVED_AMBIGUOUS | CANDIDATE_SET | NO |
| G18 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G19 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G20 | DERIVED_AMBIGUOUS | CANDIDATE_SET | NO |
| G21 | DIRECT | STRUCTURAL_TARGET | NO |
| G22 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G23 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G24 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G25 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G26 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G27 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G28 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G29 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G30 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G31 | DIRECT | STRUCTURAL_TARGET | NO |
| G32 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G33 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G34 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G35 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G36 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G37 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G38 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G39 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |
| G40 | DERIVED_UNIQUE | STRUCTURAL_TARGET | NO |

## Ambiguity rule

G17 and G20 remain candidate sets. No preferred E5 projection is selected.

The ambiguity is structurally meaningful: coarse and topological family membership remains stable across the two candidates, while radial-angular family membership can differ.

## Provenance

Primary repository artifacts:
- `docs/research/mandala/evidence/HNK40-E4-GENESIS-PROJECTION-REPORT.md`
- `docs/research/mandala/HNK40-E5-HYBRID-PROJECTION-V1-RESULT.md`
- `data/benchmarks/hnk40-e5-hybrid-projection.v1.json`
- `data/acquisition/hnk40-e5-acquisition.v1.json`
- `docs/research/HNK40-KODESCRIPT-FAMILY-BASELINE-V1.md`

## Next gate

1. Reconcile each G01–G40 legacy fingerprint against the current E4 source manifest.
2. Preserve both candidate paths for G17/G20.
3. Add stable source IDs to the Source Registry.
4. Connect each item to acquisition provenance without promoting semantics.
5. Only after that, expand the corpus beyond HNK40 into the full HNK-2647892 structural universe.

## Explicit non-goals

This register does not infer:
- phonemes;
- meanings;
- numerological values;
- visual ordinals;
- PUA assignments;
- CRC semantics;
- transport semantics;
- lexicographic tie-breaks;
- word mappings.

Those require independent authority/evidence.
