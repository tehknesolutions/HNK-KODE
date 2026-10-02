# haKodan Design System — Evidence Baseline

Version: Acceleration V1
Date: 2026-10-02
Status: EVIDENCE-LOCKED

## Rule

This document does not invent a new haKodan brand. It separates product identity that is explicitly established from visual decisions that still require approved evidence.

## Established identity

- Product name: **haKodan**.
- Domain/language: **HNK-KODE**.
- Authoring environment: **HNK-KODE Studio**.
- Product hierarchy: `HNK → HNK-KODE → haKodan → Studio/surfaces → consumers`.
- Semantic priority: `HNK → PT-BR → EN`.
- Computational arc: `ALEF / Intent → ... → MALKUTH / Manifestation`.
- Authoring modes: Visual, Standard, Pro.
- Canonical semantic convergence: all surfaces resolve to the same Semantic IDs / AST / HOM / HNK-IR.

## Canonical visual-language assets already present

The repository contains canonical lexical glyph assets for confirmed HNK lexemes including:

- AHNUVA
- EMANU
- HAYA
- HODERU
- KODAN

These assets belong to the HNK-KODE canonical language/visual corpus. Their presence does **not** by itself approve a complete UI brand, logo system, color palette or typography for haKodan.

## Product UI tokens

Until an approved source is found or supplied, the following remain explicitly `UNRESOLVED`:

- primary/secondary UI colors;
- typography families and scale;
- haKodan logo/wordmark treatment beyond the textual name;
- icon family;
- border/radius/shadow system;
- motion language;
- Studio layout styling beyond functional requirements;
- marketing/hero imagery.

Implementation MUST NOT silently promote arbitrary values for these fields into canon.

## Functional UI requirements independent of styling

The Studio/product surface may implement functional structure before brand tokens are resolved:

- Explorer
- Editor
- Inspector
- Preview
- Console
- Manifestation selector
- RUN / MANIFEST controls
- clear semantic/target/runtime error states
- visible execution/result state

Functional accessibility and legibility take precedence over decorative styling while visual canon is unresolved.

## Visual authoring rule

Blocks, nodes, glyphs and Mandala projections are representations of canonical semantics. Visual geometry may resolve known Semantic IDs, but unknown geometry cannot invent semantics.

## Asset use policy

1. Preserve original source/provenance.
2. Distinguish `CANONICAL_LANGUAGE_ASSET` from `PRODUCT_UI_ASSET`.
3. Do not rename a language glyph into a UI icon without explicit approval.
4. Prefer references/manifests over duplicate binaries until a product-specific normalized asset set is approved.
5. Missing approval is `UNRESOLVED`, not a license to improvise.

## Next promotion gate

A complete haKodan visual identity becomes `APPROVED` only after the asset inventory identifies an explicit approved source for palette, typography, logo/iconography and applicable UI treatment, or those decisions are approved and versioned in a later change.
