# HNK40 — Batch A Creator Human Gate V1

Status: `AWAITING_CREATOR_DECISION`
Authority: `CREATOR_GATE / NO AUTOMATIC CANON PROMOTION`
Scope: `G01–G10`

## Evidence chain

For every item in this gate the decision chain is:

`authoritative new-plate crop → ordered normalized trace → geometry SHA-256 → Candidate D core primitive → reconciliation proposal → Creator decision`

Candidate D auxiliary corner circles/baselines are excluded from core comparison. Candidate D is comparison evidence only and was not allowed to repair the new-plate trace.

## Batch A proposals

| Gxx | New-plate recovered core | Candidate D core | Research proposal | Creator decision |
|---|---|---|---|---|
| G01 | axis + closed loop | P01 axis + upper arc + small circle | `REDESIGNED` | `PENDING` |
| G02 | single curved polyline | P02 axis + horizontal + diagonal | `REDESIGNED` | `PENDING` |
| G03 | single vertical axis | P03 triangular polyline + base | `REDESIGNED` | `PENDING` |
| G04 | single open curve | P04 upper arc + horizontal + center circle | `REDESIGNED` | `PENDING` |
| G05 | single bent/open polyline | P05 upper arc + axis + horizontal | `REDESIGNED` | `PENDING` |
| G06 | cross | P06 closed diamond + center circle | `REDESIGNED` | `PENDING` |
| G07 | axis + right branch; upper-right mark unresolved | P07 axis + horizontal + upper arc | `CONFLICT` | `PENDING` |
| G08 | complex open polyline | P08 closed complex polygon | `REDESIGNED` | `PENDING` |
| G09 | single curved polyline | P09 forked axis + horizontal | `REDESIGNED` | `PENDING` |
| G10 | portal + upper axis | P10 upper arc + axis + small circle | `REDESIGNED` | `PENDING` |

## Creator actions

For each item, or for the batch where appropriate, the Creator may issue:

- `APPROVE_NEW_PLATE` — accept the recovered new-plate geometry as the visual authority for that Gxx.
- `KEEP_CANDIDATE_D` — reject the new-plate redesign and retain Candidate D core.
- `APPROVE_TRANSFORM` — explicitly define/approve a transformation relationship rather than independent redesign.
- `REQUEST_RETRACE` — source interpretation is not accepted; trace again.
- `DEFER` — leave unresolved and do not promote.

## Special gate — G07

G07 cannot be treated as geometrically complete until the upper-right mark is explicitly resolved or deferred. Its main body may still be reviewed independently.

Allowed G07 mark dispositions:

- `MARK_IS_PART_OF_G07`
- `MARK_IS_NOT_PART_OF_G07`
- `MARK_REQUIRES_RETRACE`
- `MARK_DEFERRED`

## Batch-level fast path

Because G01–G06 and G08–G10 all currently have the same research proposal (`REDESIGNED`), the Creator may approve them together with:

`BATCH_A_APPROVE_NEW_PLATE_EXCEPT_G07`

This is equivalent to `APPROVE_NEW_PLATE` for G01–G06 and G08–G10 only. G07 remains independently gated.

The Creator may also issue `BATCH_A_REQUEST_RETRACE` to reject all current recovered traces without deciding Candidate D authority.

## Canon mutation rule

No `VISUAL-CANON-V2` artifact may be written from this gate while Creator decisions remain `PENDING`. Research proposals are not canon.

## On approval

After explicit Creator decisions:

1. write `hnk40-batch-a-creator-decisions.v1.json`;
2. bind decisions to source crop hashes + geometry hashes + Candidate D reference;
3. promote only approved geometry into the Visual Canon V2 candidate registry;
4. preserve deferred/conflict records without defaults;
5. open Batch B G11–G20.
