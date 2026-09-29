# haKodan Language Surfaces V1

**Status:** PROJECT RULE / implementation may be incremental.

## First-class surfaces

- HNK-KODE
- PT-BR
- EN

VHK source may use one surface or mix all three, token by token, when Semantic Registry resolution is unambiguous.

```text
PT-BR ──────┐
EN ─────────┼→ Semantic IDs → AST → HOM → HNK-IR
HNK-KODE ───┘
```

## PT-BR normalization

PT-BR accepts both diacritic and ASCII forms:

```text
ação == acao
condição == condicao
função == funcao
não == nao
conexão == conexao
```

Store at least:

```text
surfaceOriginal
surfaceNormalized
language
semanticId
```

The original form must remain available for editor/display/provenance.

PT-BR diacritic normalization must not be silently applied to HNK-KODE or EN.

## Resolution

Normalization is not translation.

```text
"Condição" → "condicao"       # normalization
"condicao" → SEM.CONDITION    # semantic resolution
"condition" → SEM.CONDITION   # EN semantic resolution
```

Unknown or ambiguous deterministic input fails closed.

## Authority

A surface alias does not create a new semantic identity. HNK concepts remain above contextual PT-BR/EN equivalents.
