# haKodan Studio V1 — Design Specification

Date: 2026-10-03
Status: APPROVED DESIGN / SPEC REVIEW
Product authority: HNK → HNK-KODE → haKodan → Studio/surfaces → consumers

## 1. Intent

Turn the already evidenced haKodan Golden Path into a usable creator experience without creating a second semantic authority.

The Creator must be able to author HNK-KODE, validate it, run it, inspect canonical semantics, and see the resulting manifestation in one surface.

Success is not "an editor mockup". Success is a vertical product loop:

`INTENTION → HNK-KODE → VALIDATE → RUN → MANIFEST → PREVIEW → EVIDENCE`

The existing parser, AST, HOM, HNK-IR, target capability, Web adapter, `manifest()` and execution-evidence boundary remain authoritative.
## 2. Selected Architecture

Selected approach: **Hybrid Incremental Studio**.

V1 has five product zones:
1. HNK-KODE source editor with PT-BR/EN profile selection.
2. Validate/Run controls with fail-closed diagnostics.
3. Canonical inspector for WORLD / ENTITY / PROPERTY / EVENT / ACTION.
4. Live Web manifestation preview produced by the existing Web adapter.
5. Evidence/status surface that distinguishes GENERATED, UNVERIFIED, EXECUTED and FAILED.

The Studio calls haKodan public APIs; it does not parse or reinterpret language itself. Any later Blocks, Mandala, glyph or visual authoring surface must compile into the same canonical semantic pipeline.

Goodle may consume Studio/haKodan outputs later, but it is not semantic authority for V1.
## 3. Product Contract

Default seeded example uses the evidenced fixture:
`AbraIsland → Alakazam → vida=100 → Despertar → despertar("Alakazam")`.

RUN is enabled only when validation succeeds. Unsupported target or malformed/incomplete Golden Path fails visibly; no silent fallback is allowed.

Preview content must come from `manifest(...).artifact.content`, not a hand-authored duplicate renderer. The inspector reads canonical Golden Path/HNK-IR output.

V1 does not claim persistent projects, collaboration, AI generation, deployment, visual blocks or multi-target export. Those remain subsequent slices.

## 4. Identity and Assets

Only approved HNK/haKodan identity assets already present in the repository/project may be integrated. Missing logo, glyph, icon, typography, color or illustration decisions are marked `UNRESOLVED` rather than invented.

Functional UI may use neutral browser/system presentation where canon is unresolved. Visual polish cannot alter semantic behavior.
## 5. Error, Security and Evidence Boundaries

Source is treated as untrusted input. Diagnostics must be rendered as text, never injected as executable markup. Preview runs in an isolated iframe/sandbox boundary appropriate to the generated artifact contract.

`ARTIFACT_GENERATED ≠ EXECUTED` remains invariant. A preview load may display an artifact, but `EXECUTED` is attached only from an explicit executor observation accepted by the existing evidence boundary.

No Studio component may manufacture a success state when parsing, semantic validation, target resolution, manifestation or execution fails.

## 6. Acceptance Criteria

V1 is accepted when a user can edit both canonical PT-BR and EN examples, validate them, inspect equivalent canonical semantics, RUN them, and see the generated Web manifestation without leaving Studio.

Invalid source must produce actionable diagnostics and no manifestation. PT-BR/EN equivalent examples must converge to equivalent artifact content. The full pre-existing haKodan suite must remain green.

Tests cover UI-state logic, validation/run gating, canonical inspector mapping, preview isolation, fail-closed errors and the AbraIsland end-to-end Studio path.
## 7. Evolution After V1

V1 deliberately establishes the reusable product seam. Subsequent slices may add:
- project persistence and history;
- glyph-aware autocomplete and HNK-KODE language tooling;
- visual Blocks/Mandala authoring that lowers to the same semantics;
- approved HNK identity system and asset browser;
- additional real targets/adapters;
- Goodle integration and deployment/export workflows.

None of these may fork the canonical AST/HOM/HNK-IR pipeline.

## 8. Non-goals / Unresolved

No new HNK canon is defined by this spec. No visual identity value absent from approved sources is inferred. No percentage/PCI credit is awarded merely for writing this specification.

Implementation must be TDD-driven and evidence-backed. Product completion/PCI is recalculated only after fresh tests and observable Studio behavior exist.