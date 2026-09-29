# Changelog

All notable HNK-KODE changes are recorded here. Git history remains the immutable version record; this file is the human-readable release ledger.

## [Unreleased]

### HOM + Bytecode — 2026-09-29
- Added **HOM — HNK Object Model v0.1** as the canonical object layer between semantic AST and HNK-IR.
- HOM now models identity, type, state, properties, components, relations, behaviors, events, narrative, assets, presentation, data, manifestations and provenance.
- Implemented executable HOM mapping for the vertical slice `world → entity → property → event → action`.
- Added **haKodan Bytecode v0.1** with deterministic `HAKD` framing, versioning, payload length and FNV-1a integrity checksum.
- Bytecode v0.1 is explicitly a framed canonical HNK-IR binary format, not yet a VM opcode stream or native machine code.
- Added bytecode encoder/decoder with validation for magic, version, length, checksum and HNK-IR payload.
- Refactored canonical HNK-IR serialization into a dedicated module.
- Changed binary lowering so `lowerToBinary()` emits formal haKodan Bytecode v0.1 instead of raw UTF-8 JSON bytes.
- Added tests for HOM provenance/relations/events, PT-BR↔EN byte-for-byte bytecode equivalence, bytecode round-trip and corruption detection.

### Executable kernel — 2026-09-29
- Added machine-readable haKodan Semantic Token Registry v0.1 and Canonical Grammar v0.1.
- Bootstrapped `packages/hakodan` as the executable framework kernel.
- Added PT-BR and EN surface profiles converging to the same canonical AST and HNK-IR.
- Enforced an explicit HNK profile lock while programming lexemes remain unresolved.
- Added deterministic JavaScript lowering.
- Added deterministic binary lowering from canonical HNK-IR bytes.
- Added tests proving PT-BR/EN equivalence across AST, HNK-IR, JavaScript target and binary output.
- Added GitHub Actions gate `hakodan-kernel.yml`.

### Added — 2026-09-29
- Established **haKodan — Canon Universal v0.1** as the official Grupo HNK framework built on HNK-KODE.
- Canonized the language priority **HNK → PT-BR → EN**, with one Canonical Grammar and shared AST/HNK-IR semantics.
- Defined the nine computational layers **L8 ALEF/Intent → L0 Binary/Malkuth**.
- Added the **haKodan Architecture Blueprint v0.1**: Intent Graph, HNK Object Model, AST, HNK-IR, MHCM, lowering, targets, Manifestation Engine, SDK and Studio.
- Established the multiparadigm model: POO for identity/contracts, components for capabilities, systems for collective behavior, events for causality and narrative as executable structure.
- Defined three authoring surfaces — Visual, Standard and Pro — converging to the same HNK-IR.
- Defined artifact targets beyond software: Web, App, Game, World, UI, Mockup, Wireframe, DOC, GDD, PDD, Image, Video, Audio, Prompt, Agent and Workflow.
- Added **HNK Semantic Token Registry v0.1** with canonical Semantic IDs and PT-BR/EN profiles.
- Locked the rule that unresolved HNK keywords remain `UNRESOLVED`; HNK lexemes must never be invented merely to complete programming syntax.
- Preserved existing canonical HNK lexemes (AHNUVA, EMANU, HAYA, HODERU, KODAN) without automatically reassigning them as programming keywords.
- Established provenance/source-map requirements across Intent → Surface → AST → HNK-IR → target/binary.
- Canonized naming boundary: **HNK-KODE = idioma + linguagem computacional; haKodan = framework/runtime/SDK de manifestação; HNK-KODE Studio = ambiente de autoria**.
- Reaffirmed repository boundaries: CODEX-HNK = integral canon, HNK-KODE = language authority and haKodan source repository, HNK-VERSE = world/experience consumer, TEHKNÉ-OS = technological know-how/evidence/provenance.

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
