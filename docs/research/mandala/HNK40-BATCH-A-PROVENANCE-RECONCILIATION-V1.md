# HNK40 — Batch A Provenance Reconciliation V1

Status: `PASS / TRACE_INPUT_CORRECTED`
Authority: `RESEARCH / NON-CANONICAL`

## Why this gate exists

Before reconstructing G01–G10, the Batch A preparation pass produced a second provisional matrix region `[357,536] → [1162,716]`. That region MUST NOT replace the earlier specimen registry without proof.

The canonical research registry on this branch already binds the exact conversation source bytes as:

- file: `HNK-IDIOMA--canvas-iso-arquitetura-do-glifo-sistema-completo-40-caracteres.png`
- size: `1536×1024`
- bytes: `3,483,750`
- SHA-256: `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`
- matrix region: `[424,533] → [1163,719]`
- order: 4×10 row-major G01–G40

A direct byte-level recheck in the active runtime independently reproduced the same file size and SHA-256. Therefore there is NO source-hash conflict. The earlier shortened hash text shown in conversation was only an abbreviated/mistyped presentation and is superseded by the full registry value above.

## Batch A authoritative source cells

Vector/human tracing for Batch A MUST use the already-bound registry cells, not the provisional `[357,536]` preparation crops:

- G01 `[424,533,498,580]`
- G02 `[498,533,572,580]`
- G03 `[572,533,646,580]`
- G04 `[646,533,720,580]`
- G05 `[720,533,794,580]`
- G06 `[794,533,867,580]`
- G07 `[867,533,941,580]`
- G08 `[941,533,1015,580]`
- G09 `[1015,533,1089,580]`
- G10 `[1089,533,1163,580]`

The SHA-256 of each authoritative cell remains the value stored in `data/benchmarks/hnk40-new-plate-specimen-registry.v1.json`.

## Decision

1. Exact source-byte provenance: `PASS`.
2. Full source SHA-256: `f67dab0eac436f636a2a28789420c81754943852b222b8547fdb12c388de27d9`.
3. Provisional Batch A crops from `[357,536] → [1162,716]`: `REJECTED_AS_TRACE_AUTHORITY`.
4. Registry matrix `[424,533] → [1163,719]`: `AUTHORITATIVE_RESEARCH_BINDING`.
5. No vector strokes have been approved or invented by this reconciliation.

## Next gate

Re-materialize G01–G10 from the authoritative registry boxes and perform vector/human trace reconstruction only from those exact cells. Candidate D may be displayed for comparison after tracing but MUST NOT be used to fill ambiguous strokes.