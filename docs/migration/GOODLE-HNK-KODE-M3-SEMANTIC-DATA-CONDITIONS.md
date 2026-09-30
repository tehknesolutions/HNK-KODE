# M3 — Semantic Registry + Data + Conditions

**Status:** IMPLEMENTED BASELINE / VERIFICATION PENDING  
**Date:** 2026-09-29

## Purpose

M3 creates the non-inventive boundary between Goodle source semantics and the HNK-KODE Semantic Token Registry, while preserving Goodle data/persistence and condition expressions that do not yet have a lossless canonical target.

## Registry authority

The HNK Semantic Token Registry is the authority for canonical computational IDs. Goodle source terms may map only to IDs already present there.

No Goodle source term becomes a new HNK Semantic ID merely because it is useful or common.

Examples:

- `quando` → `WHEN` → MAPPED
- `se` → `IF` → MAPPED
- `senão` → `ELSE` → MAPPED
- `tocar` → no current registry ID → UNMAPPED
- `diminuir` → no current registry ID → UNMAPPED

HNK lexical forms remain separately governed and unresolved where the registry says so.

## Data contract

`DadoGoodle` is preserved with:

- id;
- name;
- source type;
- persistence flag;
- initial value;
- provenance.

M3 deliberately does not equate `persistente=true` with any particular database, memory, file, runtime store, or HNK persistence primitive. Storage semantics remain `UNRESOLVED` until the runtime/data contract is explicit.

## Condition contract

Goodle `condicao` expressions remain `UNRESOLVED` at operator level.

The registry concepts `IF` and `ELSE` establish control-flow vocabulary, but they do not define arbitrary operators such as `maiorQueZero`, `temVida`, comparisons, predicates, truthiness, or branching evaluation.

Therefore M3 preserves:

- source condition name;
- parameters;
- provenance;
- any exact registry classification that exists;
- an explicit unresolved diagnostic.

## Machine states

M3 uses three distinct states:

- `MAPPED` — exact canonical registry ID exists;
- `UNMAPPED` — source term has no registry ID;
- `UNRESOLVED` — a broader semantic contract is still required even if part of the vocabulary is known.

These states must not be collapsed.

## Artifacts

- `packages/goodle/src/semantic-data-adapter.mjs`
- `packages/goodle/test/semantic-data-adapter.test.mjs`
- export from `packages/goodle/src/index.mjs`

## Verification note

The branch currently has an older Gate 03 workflow failure whose job contains no executed steps. The workflow itself depends on an external frozen CODEX archive and is not evidence that the newly added Goodle tests failed. No fresh executable test result is available for M3 in this GPT+GitHub-only workflow, so M3 remains `VERIFICATION PENDING`.

## Next gate

M4 should reconcile HyperKernel/GoodRuntime with haKodan Runtime while preserving this rule:

**creator orchestration may live in Goodle; canonical execution semantics belong to haKodan.**
