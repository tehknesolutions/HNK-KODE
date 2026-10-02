# haKodan HMV-2 + HMV-3 — First Manifestation Slice

Parent product track: #189
Date: 2026-10-02
Status: FROZEN FOR FIRST SLICE

## Objective
Freeze the smallest semantic surface already supported by the repository and select exactly one concrete executable target for the first end-to-end manifestation.

## HMV-2 — Semantic freeze

The first slice is limited to five semantic primitives already represented by the current parser/runtime surfaces:

1. `WORLD`
2. `ENTITY`
3. `PROPERTY`
4. `EVENT`
5. `ACTION`

### Repository-grounded meaning

- `WORLD` is the root declaration and root HOM object.
- `ENTITY` is a contained object inside the world.
- `PROPERTY` is literal state attached to an entity.
- `EVENT` is a named world-level event containing actions.
- `ACTION` is a named invocation with literal arguments inside an event.

### Explicit non-goals for this slice

Do not add language constructs merely for completeness. In particular, HMV-2 does not require loops, conditionals, user-defined functions, inheritance, networking, persistence, generalized UI DSLs, package imports, or new metaphysical/semantic primitives.

The first slice succeeds when these five existing primitives can cross the full manifestation boundary.

## Minimal canonical example

```hakodan
WORLD PrimeiraManifestacao {
  ENTITY Mensagem {
    PROPERTY texto = "haKodan manifestou.";
  }

  EVENT iniciar {
    ACTION mostrar("haKodan manifestou.");
  }
}
```

The exact surface spelling remains governed by the active semantic-token profile; this example documents the semantic shape, not a new lexical authority.

## HMV-3 — Target selection

Selected target: **self-contained HTML document executed by a browser**.

Target identifier for the first adapter:

`hakodan.target.html-document.v1`

### Why this target

The repository audit did not recover an existing concrete haKodan target adapter. Therefore HMV-3 selects the smallest target that can produce a visible artifact using only ubiquitous runtime infrastructure:

`HNK-IR/HOM -> HTML adapter -> .html artifact -> browser -> visible manifestation`

This target does not make HTML, the browser, Goodle, or any external engine the semantic authority of haKodan. HTML is only the first manifestation backend.

## Adapter boundary

The adapter MUST consume canonical haKodan data rather than reparsing source text.

Initial contract:

```text
input: canonical HNK-IR and/or HOM
output: deterministic UTF-8 HTML document
side effect during compile: none
runtime: browser loads generated document
observable evidence: rendered world/entity/property content and event/action result
```

### First action mapping

For HMV-3 only, the canonical demonstration action `mostrar(value)` may map to a deterministic DOM-visible output operation. This mapping is target-specific and must not redefine the core semantics of `ACTION` globally.

## Determinism requirements

For identical canonical input and adapter version:

- generated HTML bytes must be identical;
- ordering must be stable;
- no random identifiers;
- no timestamps embedded in output;
- no network dependency;
- no CDN dependency;
- no paid infrastructure;
- artifact must open directly in a normal browser.

## Golden Path now frozen

```text
ALEF / Creator Intent
  -> haKodan source
  -> parser / AST
  -> HNK-IR
  -> HOM
  -> hakodan.target.html-document.v1
  -> deterministic .html artifact
  -> browser execution
  -> visible result
  -> evidence/provenance
  -> MALKUTH
```

## Acceptance gate for HMV-4

HMV-4 must implement the adapter and prove, with executable tests, at minimum:

1. source parses successfully;
2. HNK-IR is generated;
3. HOM is generated;
4. adapter emits a complete HTML document;
5. entity/property data is present in generated manifestation;
6. the first mapped event/action produces a visible result;
7. repeated compilation is byte-deterministic;
8. malformed/unsupported input fails explicitly rather than silently degrading.

## Architectural authority

haKodan remains the language/framework authority. Goodle may later consume or host artifacts and may contribute evidence/target know-how, but it is not placed in the mandatory first Golden Path.

## Next milestone

**HMV-4 — implement `hakodan.target.html-document.v1`, fixtures and executable conformance tests.**
