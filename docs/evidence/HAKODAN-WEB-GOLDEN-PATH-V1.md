# haKodan Web Golden Path V1 — Execution Evidence

Date: 2026-10-02
Branch: `feat/hakodan-web-manifestation-v1`

## Scope

First product-centered visible manifestation through canonical haKodan semantics:

`WORLD → ENTITY → PROPERTY → EVENT → ACTION → AST → HOM → HNK-IR → Web target → adapter → HTML/JS → browser`

Acceptance fixture:
- World: `AbraIsland`
- Entity: `Alakazam`
- Property: `vida = 100`
- Event: `Despertar`
- Action: `despertar("Alakazam")`

## Static implementation evidence

Implemented on this branch:
- fail-closed Web target capability;
- deterministic Web adapter;
- manifestation orchestrator;
- truthful execution-evidence boundary;
- PT-BR/EN equivalent acceptance fixtures.

## Fresh test execution

Command:
`node --test packages/hakodan/test/*.test.mjs`

Observed result on 2026-10-02:
- tests: **169**
- pass: **169**
- fail: **0**
- duration: **5349.7305 ms**
- Node: **v24.18.0**

## Browser execution observation

Generated artifact: `packages/hakodan/examples/golden-path-web/abra-island.html`.

Executor: installed Google Chrome headless (`chrome.exe --headless=new --dump-dom`).
Chrome exited successfully and the captured post-script DOM contained:
- `<h1>AbraIsland</h1>`;
- `Alakazam`;
- `"vida": 100`;
- `Despertar`;
- `despertar`.

This is real browser execution evidence, not protocol conformance. The generated artifact itself remains `UNVERIFIED` until an executor result is attached through the execution-evidence boundary; the observed Chrome run supplies that external executor evidence.

## Evidence classification

- Semantic Golden Path: **PASS**.
- PT-BR/EN convergence: **PASS**.
- Web target capability: **PASS**.
- Deterministic artifact generation: **PASS**.
- Browser load/script execution/observable DOM: **PASS**.
- Full local haKodan regression suite: **169/169 PASS**.
- Remote CI: **not claimed here**.
- Studio authoring: **not part of this gate**.
- Approved visual identity integration: **not part of this gate**.

## Product consequence

The Acceleration V1 70% gate definition — one real target producing a visible manifestation through canonical haKodan semantics — is now evidenced by the Web V1 vertical slice. This does not imply 70%+ in every subsystem; PCI remains a weighted planning index and is recalculated separately.