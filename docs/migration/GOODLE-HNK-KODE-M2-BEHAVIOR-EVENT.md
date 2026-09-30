# M2 — Goodle Behavior/Event ↔ haKodan

**Status:** adapter baseline implemented; runtime conformance pending  
**Date:** 2026-09-29

## Source-grounded Goodle model

The source contract in `goodle-browser/src/nucleo/modelo/SintaxeGoodle.ts` defines five operation kinds: `evento`, `condicao`, `acao`, `dado`, `regra`, plus `ExpressaoGoodle`, `FluxoGoodle`, `DadoGoodle`, `RegraGoodle` and `DefinicaoGoodle`.

This migration preserves that taxonomy. It does not replace it with a model inferred from general programming concepts.

## haKodan target boundary

The current haKodan event model provides `ActionDescriptor`, `EventDescriptor` and conversion from the existing HNK-IR event representation. M2 therefore emits **descriptor candidates** rather than claiming every Goodle expression is already canonical.

## Mapping baseline

| Goodle | M2 | Reason |
|---|---|---|
| `FluxoGoodle.quando` with `tipo=evento` | EventDescriptorCandidate | structurally representable |
| `executar[]` with `tipo=acao` | ActionDescriptorCandidate | structurally representable |
| `condicao` | UNRESOLVED | canonical condition contract not yet sufficient |
| `senao[]` | UNRESOLVED | branch contract must be reconciled explicitly |
| `dado` | PRESERVED | persistence/type mapping requires dedicated data contract |
| `regra` | PRESERVED | permission/rule semantics are not equivalent to Event/Action |
| nested `filhos` | PRESERVED/scanned | only promoted after semantic reconciliation |

## Provenance

Every normalized definition and lowered flow records:

- source repository;
- source path;
- source model;
- source flow ID where applicable;
- source expression type;
- adapter gate/version;
- authority status.

## No-invention rule

M2 does not infer that a Goodle action name is a canonical HNK Semantic ID. `tocar`, `diminuir`, or any other source term remains a Goodle source name until the HNK-KODE registry explicitly maps it.

Likewise, conditions and else branches return explicit diagnostics instead of being approximated.

## Implemented artifacts

- `packages/goodle/src/behavior-adapter.mjs`
- `packages/goodle/test/behavior-adapter.test.mjs`
- exports in `packages/goodle/src/index.mjs`

## Verification status

The code and tests are committed on the integration branch. A fresh executable test-suite run is still required before M2 can be marked VERIFIED, because this workflow intentionally avoids local execution and the current chat does not provide a GitHub Actions execution result for these commits.

## Next gate after verification

M3 should reconcile semantic coverage and data/condition contracts before HyperKernel/runtime convergence:

1. source Goodle semantic IDs/terms;
2. HNK Semantic Token Registry;
3. conditions/branching;
4. data mutation and persistence;
5. exact mapping states: MAPPED / UNMAPPED / UNRESOLVED;
6. conformance fixtures across Goodle → haKodan.
