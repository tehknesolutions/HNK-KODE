# haKodan Golden Path Web V1

Canonical acceptance fixture for the first visible haKodan Web manifestation.

Flow:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION → AST → HOM → HNK-IR → WEB → HTML/JS`

Fixtures:
- `abra-island.pt.hnk` — PT-BR surface.
- `abra-island.en.hnk` — EN surface.
- `generate.mjs` — generates `abra-island.html` through `manifest()`.

Generate:

```bash
node packages/hakodan/examples/golden-path-web/generate.mjs
```

Generation reports `ARTIFACT_GENERATED / UNVERIFIED`. A browser/executor observation is required before execution may be recorded as `EXECUTED`.

Acceptance source: AbraIsland, entity Alakazam, `vida = 100`, event Despertar, action `despertar("Alakazam")`.