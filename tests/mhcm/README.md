# MHCM V0 executable fixtures

This directory defines the first deterministic vertical-slice fixture for KODESCRIPT/MHCM.

Pipeline under test:

`KODE SOURCE -> AST -> HNK-IR -> RUNTIME WORLD`

Current fixture starts at AST until the textual grammar/parser is frozen.

## Fixture chain

1. `world-minimal.ast.json` — valid KODESCRIPT AST V0.
2. `world-minimal.hnk-ir.json` — expected lowering to HNK-IR V0.
3. `world-minimal.runtime.json` — expected deterministic runtime state.

## Required assertions

- AST validates against `spec/mhcm/ast.schema.json`.
- IR validates against `spec/mhcm/hnk-ir.schema.json`.
- Lowering preserves world/entity/property/event/action identity.
- Runtime materialization preserves declared property values.
- Provenance is retained in IR.
- No fixture is promoted to linguistic canon merely because it executes.

## Next test gates

- textual KODESCRIPT grammar + parser fixture
- AST -> IR deterministic lowerer
- IR -> Runtime interpreter
- Address/Edge/Path/Glyph valid and invalid fixtures
- Glyph encode/decode round-trip
- candidate -> validated -> canonical transition tests
- illegal state-transition tests
