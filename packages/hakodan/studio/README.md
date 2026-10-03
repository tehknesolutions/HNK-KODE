# haKodan Studio V1

Browser authoring surface over the canonical haKodan pipeline.

## Creator loop

`HNK-KODE → VALIDATE → canonical inspector → RUN → manifest() → Web artifact → sandboxed preview`

The Studio is deliberately thin: it does not own a parser, AST, HOM, HNK-IR or renderer. Semantic authority remains in `packages/hakodan/src`.

## Seed

The initial source is the canonical PT-BR AbraIsland fixture:

- WORLD `AbraIsland`
- ENTITY `Alakazam`
- PROPERTY `vida = 100`
- EVENT `Despertar`
- ACTION `despertar("Alakazam")`

Select `EN` when authoring the equivalent English surface.

## Run

Serve the repository over HTTP and open:

`/packages/hakodan/studio/index.html`

The surface is dependency-free. Direct `file://` loading may be restricted by browser module/CORS policy, so HTTP serving is the supported development route.

## Test

Focused acceptance:

`node --test packages/hakodan/test/studio-golden-path-acceptance.test.mjs`

Studio contracts:

`node --test packages/hakodan/test/studio-session-v1.test.mjs packages/hakodan/test/studio-inspector-v1.test.mjs packages/hakodan/test/studio-shell-contract.test.mjs packages/hakodan/test/studio-golden-path-acceptance.test.mjs`

Full haKodan regression:

`node --test packages/hakodan/test/*.test.mjs`

## Evidence semantics

A successful RUN produces `ARTIFACT_GENERATED` and the artifact remains `UNVERIFIED`. Merely displaying it in the Studio preview does not manufacture `EXECUTED`; explicit executor observation must cross the existing execution-evidence boundary.

## V1 non-goals

Persistence, collaboration, AI generation, deployment, Blocks/Mandala visual authoring, multi-target export and unresolved visual-identity decisions are intentionally outside this slice.
