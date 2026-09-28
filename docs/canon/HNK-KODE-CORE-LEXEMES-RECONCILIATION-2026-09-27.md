# HNK-KODE — Core Lexemes Reconciliation Ledger

Date: 2026-09-27
Status: **RECONCILIATION / SOURCE-LOCKED**

## Purpose

Establish a single explicit ledger for the core HNK-KODE/HENUVOKODAN decisions recovered during the all-sources migration. This file does not manufacture missing source text and does not silently upgrade historical proposals.

## Evidence boundary

The repository's Drive inventory records that the `HNK — IDIOMA` source family contains:

- language designation `HNK-KODE` / `HENUVOKODAN`;
- sacred-name mappings `YAHUSHA` and `YAHUAH`;
- core lexemes `AHNUVA`, `EMANU`, `HAYA`, `HODERU`;
- `HNK-TRIAD-001`;
- grammar/morphology, glyph and numerology registries;
- dedicated HODERU canon/lexicon/validation/changelog deltas dated 2026-09-20.

The current GitHub default-branch code search does **not** independently surface `AHNUVA` or `HODERU` inside the runtime package. Therefore this ledger treats the Drive-derived decisions as material requiring explicit normalization into runtime registries, not as proof that the runtime already implements them.

## Reconciliation table

| ID | HNK-KODE form | Meaning / role recorded by current HNK canon | Source state | Runtime state | Reconciliation action |
|---|---|---|---|---|---|
| HK-LEX-AHNUVA | `AHNUVA` | AMOR | CANON DECISION / DRIVE SNAPSHOT FAMILY | NOT YET VERIFIED IN RUNTIME | Normalize from exact Drive lexicon/canon source before adding code. |
| HK-LEX-EMANU | `EMANU` | VERDADE | CANON DECISION / DRIVE SNAPSHOT FAMILY | NOT YET VERIFIED IN RUNTIME | Normalize from exact Drive lexicon/canon source before adding code. |
| HK-LEX-HAYA | `HAYA` | VIDA | CANON DECISION / DRIVE SNAPSHOT FAMILY | NOT YET VERIFIED IN RUNTIME | Normalize from exact Drive lexicon/canon source before adding code. |
| HK-LEX-HODERU | `HODERU` | CAMINHO / WAY / VIA / JEITO / MANEIRA / MODO; objetivo/destino only as contextual extension | LATER CANON DELTA / DRIVE 2026-09-20 | NOT YET VERIFIED IN RUNTIME | HODERU delta has precedence over older conflicting path/way proposals after exact-source verification. |
| HK-CON-KODAN | `KODAN` | canonical concept centered on LOGOS; HNK internal theological semantics remain governed by HNK canon | CANON DECISION | NOT YET VERIFIED IN RUNTIME | Keep separate from generic lexical derivation until exact registry source is recovered. |
| HK-NAME-YAHUSHA | `YAHUSHA` | HNK sacred-name mapping for Jesus | HNK CANON / SACRED NAME | NOT YET VERIFIED IN RUNTIME | Sacred namespace; do not derive or mutate automatically. |
| HK-NAME-YAHUAH | `YAHUAH` | HNK sacred-name mapping for YHWH | HNK CANON / SACRED NAME | NOT YET VERIFIED IN RUNTIME | Sacred namespace; do not derive or mutate automatically. |

## HNK-TRIAD-001

Current HNK canon records the conceptual triad as:

- `H` — VERDADE; holiness/transparency layer.
- `N` — VIDA; Zoe/Nazareno layer.
- `K` — CAMINHO; Logos/Luz/forma/metanoia layer.

This triad is a conceptual/semantic authority layer. It must not be confused with a claim that every geometric Mandala path automatically receives one of these meanings.

## HENUVOKODAN identity layer

The language designation is `HNK-KODE`, with `HENUVOKODAN` as the language identity/name in the current project architecture. Historical HNK material also contains an 11-letter/portal HENUVOKODAN system and a creator-key concept. Those historical symbolic rules require their own exact-source migration and must not be reconstructed from memory into executable code.

## Mandala boundary

The N=12 Mandala census is now part of HNK-KODE evidence:

`7,289,096,672 raw walks -> 95,284,518 simple paths -> 47,642,259 reversal classes -> 2,647,892 geometric classes -> 2,647,892 render-distinct classes`.

This mathematical space is a **KODESCRIPT/glyph identity capacity**. It does not create 2,647,892 meanings, words, phonemes or sacred names.

## Runtime promotion gate

Before any row above is added to an executable registry:

1. recover the exact Drive canon/lexicon source where available;
2. preserve source identifier/date/provenance;
3. compare against existing recovered/runtime registries;
4. flag conflicts instead of silently replacing entries;
5. add tests for exact form, meaning, authority state and non-derivability where applicable;
6. only then expose through the HNK-KODE package API.

## Current conclusion

The all-sources migration has established enough evidence to create this reconciliation ledger, but not enough exact source payload has been recovered in the current pass to safely manufacture the missing runtime records. The correct next operation is **exact-source extraction**, not lexical invention.
