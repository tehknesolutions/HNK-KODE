# haKodan Asset Manifest

Version: Acceleration V1
Date: 2026-10-02

## Purpose

Inventory product-relevant assets without converting uncertain visual material into canon.

## Status vocabulary

- `CANONICAL_LANGUAGE_ASSET` — canonical HNK-KODE language/glyph material.
- `APPROVED_PRODUCT_ASSET` — explicitly approved for haKodan product UI/brand.
- `REFERENCE_ONLY` — useful reference but not product canon.
- `UNRESOLVED` — provenance/approval insufficient.

## Confirmed repository asset family

| Asset | Existing repository location | Status | Product use |
| --- | --- | --- | --- |
| AHNUVA glyph | `assets/canonical/lexical-glyphs/` | CANONICAL_LANGUAGE_ASSET | semantic/glyph representation; not automatically a UI icon |
| EMANU glyph | `assets/canonical/lexical-glyphs/` | CANONICAL_LANGUAGE_ASSET | semantic/glyph representation; not automatically a UI icon |
| HAYA glyph | `assets/canonical/lexical-glyphs/` | CANONICAL_LANGUAGE_ASSET | semantic/glyph representation; not automatically a UI icon |
| HODERU glyph | `assets/canonical/lexical-glyphs/` | CANONICAL_LANGUAGE_ASSET | semantic/glyph representation; not automatically a UI icon |
| KODAN glyph | `assets/canonical/lexical-glyphs/` | CANONICAL_LANGUAGE_ASSET | semantic/glyph representation; not automatically a UI icon |

## Product-brand inventory

| Category | Status | Ruling |
| --- | --- | --- |
| haKodan logo | UNRESOLVED | no product-specific approved asset established by current repository audit |
| UI palette | UNRESOLVED | do not invent |
| typography | UNRESOLVED | do not invent |
| Studio icons | UNRESOLVED | do not repurpose glyphs silently |
| motion assets | UNRESOLVED | do not invent |
| hero/marketing imagery | UNRESOLVED | do not invent |

## Normalization policy

This directory is the canonical destination for **approved haKodan product assets**. Existing canonical language assets remain in their authoritative location until a deliberate product-use decision requires a derived/reference asset here.

No binary duplication is performed merely to make this directory look populated.

## Code integration status

`PENDING`: product-specific UI assets cannot be truthfully wired until approved product identity evidence exists. Functional Studio/Golden Path work may proceed using neutral implementation defaults that are not promoted as haKodan canon.

## Provenance requirement

Every future entry promoted to `APPROVED_PRODUCT_ASSET` must record source path/reference, approval state, intended use and, where practical, content hash/version.
