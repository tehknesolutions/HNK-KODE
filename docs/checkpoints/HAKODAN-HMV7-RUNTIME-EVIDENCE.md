# haKodan HMV-7 — Runtime Evidence Binding

Parent product track: #189
Date: 2026-10-02
Evidence class: EXECUTION_EVIDENCE
Status: VERIFIED_BROWSER_EXECUTION

## Originating intention

First manifestation objective: prove that a real haKodan program can cross the canonical pipeline into an executable artifact and produce a human-observable runtime effect.

Canonical source artifact:

`packages/hakodan/examples/primeira-manifestacao.hakodan`

Manifestation target:

`hakodan.target.html-document.v1`

Generated artifact:

`packages/hakodan/examples/primeira-manifestacao.html`

HMV-5 integration commit / PR evidence:

- PR #193
- merge commit `74886f4b4780c02ac9e98c4c7d54a5e15830fa23`

## Runtime execution

The generated artifact was loaded in a real browser through an HTML preview of the raw `main` artifact.

Observed execution path:

`ALEF / intention -> haKodan source -> AST -> HNK-IR -> HOM -> hakodan.target.html-document.v1 -> HTML artifact -> browser -> startup EVENT iniciar -> ACTION mostrar("haKodan manifestou.") -> DOM mutation -> visible paragraph`

## Observations

Browser verification confirmed:

- world/document title `PrimeiraManifestacao` was visibly rendered;
- entity `Mensagem` was visibly rendered;
- property `texto` with value `haKodan manifestou.` was visibly rendered;
- static artifact contained an initially empty `section#manifestation` placeholder;
- embedded runtime declared event `iniciar` containing action `mostrar("haKodan manifestou.")`;
- browser execution dispatched `iniciar`;
- JavaScript created and appended a new paragraph to `section#manifestation`;
- the runtime-created paragraph visibly contained `haKodan manifestou.`;
- no browser/JavaScript runtime error was observed during the verification run.

## Static vs runtime distinction

The world/entity/property rendering is present in the generated HTML bytes. The decisive execution observation is different: the paragraph inside `section#manifestation` is not present as static child content before script execution; it is appended by the target runtime when the startup event is dispatched.

Therefore this ledger does not infer execution merely from source or generated markup. It records a browser-observed DOM effect caused by runtime execution.

## Evidence binding

The execution is bound to:

1. originating haKodan source: `primeira-manifestacao.hakodan`;
2. canonical compiler path: parser/AST -> HNK-IR -> HOM;
3. concrete target adapter: `hakodan.target.html-document.v1`;
4. versioned generated artifact: `primeira-manifestacao.html`;
5. repository integration: PR #193 / merge `74886f4b4780c02ac9e98c4c7d54a5e15830fa23`;
6. browser-observed runtime effect: `iniciar -> mostrar(...) -> visible DOM paragraph`.

## Boundary

This is execution evidence for the first HMV vertical slice only. It does not prove every haKodan construct, every target, generalized application generation, HNK40 canon completion, or full product completion.

## Result

`HMV-6 = PASS`

`HMV-7 = EXECUTION_EVIDENCE_BOUND`

This establishes the first evidence-backed ALEF -> MALKUTH manifestation slice for haKodan.
