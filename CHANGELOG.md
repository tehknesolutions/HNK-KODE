# Changelog

All notable HNK-KODE changes are recorded here. Git history remains the immutable version record; this file is the human-readable release ledger.

## [Unreleased]

### Added — 2026-09-28
- Added deterministic Family Expansion Corpus V1: 96 representatives = 72 TRAIN + 24 HOLDOUT with zero coarse-family leakage.\n- Family Expansion V1 deliberately excludes the HNK40 Genesis coarse family and reserves 23 unseen MF+CG coarse families + 1 CR:D representative for transfer testing.\n- Added Language Eligibility V1 policy/schema/runtime: 38 HNK40 resolved experiment-ready, 2 ambiguity-preserved holdouts, 0 automatic semantic bindings.
- Added Language × Mathematics Bridge V1: 33 recovered lexemes / 140 authored forms mapped onto HNK40 structural families; neither corpus uses G17/G20.
- Added exact acquisition curriculum bands: 21 CORE_OBSERVED, 17 EXPANSION_RESOLVED, 2 AMBIGUOUS_HOLDOUT.
- Added exact shared-corpus frequency frontier: 14 glyphs for 80%, one unique 16-glyph set for 90%, 18 glyphs for 95%.
- Added exact acquisition frontier solver and regression tests.
- Published exact full-space structural family census: 256 coarse, 11,492 topological, and 3,041 radial-angular families, each partitioning all 2,647,892 geometric identities.\n- Added shardable Burnside-weighted family census core/CLI and HNK40 family benchmark classification.\n- Fixed topological family keys to be reversal-invariant and expanded N=12 circular sector-span schema.\n- Established `HNK-2647892 Mathematical Kernel` as a machine-verifiable N=12 research baseline.
- Added `data/math/hnk-2647892.manifest.v1.json`, schema, Node invariant tests, and GitHub Actions gate.
- Locked the enumeration funnel `7,289,096,672 → 95,284,518 → 47,642,259 → 2,647,892` and the independent Burnside D9 cross-check.
- Explicitly separated geometric identity count from vocabulary, semantics, and acquisition inventories.
- Mirrored HNK40 → E5 Hybrid Projection V1 research result from CODEX-HNK.
- Added `spec/hnk40-e5-hybrid-projection.schema.json`.
- Registered the reproducible 40-record result: 4 DIRECT, 34 DERIVED_UNIQUE, 2 DERIVED_AMBIGUOUS (G17/G20).
- Preserved the authority boundary: derived structural projections remain `canonical: false`.

### Repository policy
- GitHub is the primary persistent source of truth.
- Local workspaces are disposable execution environments, not authoritative storage.
- Persistent code, specs, datasets, research results and operational decisions must be committed and pushed.
- Cross-repository mirrors must retain provenance to their source repository/commit.
