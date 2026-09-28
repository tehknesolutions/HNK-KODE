# Changelog

All notable HNK-KODE changes are recorded here. Git history remains the immutable version record; this file is the human-readable release ledger.

## [Unreleased]

### Added — 2026-09-28
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
