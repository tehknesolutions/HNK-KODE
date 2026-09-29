# VHK Visual ↔ Textual Authoring Contract V1

## Rule

VHK textual syntax and VHK visual blocks are two authoring surfaces of the same semantic program.

```text
TEXT ───┐
        ├→ AST → HOM → HNK-IR
BLOCKS ─┘
```

## Block families

1. DECLARATION
2. FUNCTION
3. LOGIC
4. DATA
5. RELATION
6. EVENT
7. MANIFESTATION
8. AI/VIBE

## Block contract

A block may contain:
`id, category, type, inputs, outputs, attributes, scope, children, relations, payload, metadata`.

Connections are typed and scope-aware.

Errors include:
`TYPE_ERROR`, `INVALID_CONNECTION`, `INVALID_SCOPE`, `INVALID_BLOCK`, `INVALID_TARGET`, `MISSING_INPUT`, `MISSING_OUTPUT`, `AMBIGUOUS_STRUCTURE`, `UNSUPPORTED_OPERATION`.

Natural-language vibe input may propose a block tree, but deterministic semantics must remain inspectable and must not be silently guessed.
