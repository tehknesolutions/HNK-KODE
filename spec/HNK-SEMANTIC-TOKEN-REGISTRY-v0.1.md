# HNK Semantic Token Registry v0.1

**Status:** BOOTSTRAP — CANONICAL IDS DEFINED; HNK LEXEMES MUST BE CONFIRMED  
**Data:** 2026-09-29

## Regra

O registry desacopla **semântica computacional** de **palavras de superfície**.

A linguagem possui Semantic IDs canônicos. HNK, PT-BR e EN são perfis lexicais.

> HNK é o perfil canônico. PT-BR é a ponte humana principal. EN é interoperabilidade.

Termos HNK não confirmados ficam `UNRESOLVED`. É proibido inventar lexemas para completar a tabela.

## Bootstrap Registry

| Semantic ID | HNK | PT-BR | EN | Status |
|---|---|---|---|---|
| WORLD | UNRESOLVED | mundo | world | bootstrap |
| AREA | UNRESOLVED | área | area | bootstrap |
| OBJECT | UNRESOLVED | objeto | object | bootstrap |
| ENTITY | UNRESOLVED | entidade | entity | bootstrap |
| COMPONENT | UNRESOLVED | componente | component | bootstrap |
| CLASS | UNRESOLVED | classe | class | bootstrap |
| INTERFACE | UNRESOLVED | interface | interface | bootstrap |
| SYSTEM | UNRESOLVED | sistema | system | bootstrap |
| EVENT | UNRESOLVED | evento | event | bootstrap |
| ACTION | UNRESOLVED | ação | action | bootstrap |
| WHEN | UNRESOLVED | quando | when | bootstrap |
| IF | UNRESOLVED | se | if | bootstrap |
| ELSE | UNRESOLVED | senão | else | bootstrap |
| RETURN | UNRESOLVED | retornar | return | bootstrap |
| EMIT | UNRESOLVED | emitir | emit | bootstrap |
| OBSERVE | UNRESOLVED | observar | observe | bootstrap |
| EXPERIENCE | UNRESOLVED | experiência | experience | bootstrap |
| SCENE | UNRESOLVED | cenário | scene | bootstrap |
| CHARACTER | UNRESOLVED | personagem | character | bootstrap |
| INTENT | UNRESOLVED | intenção | intent | bootstrap |
| MANIFEST | UNRESOLVED | manifestar | manifest | bootstrap |
| LANGUAGE | UNRESOLVED | língua | language | bootstrap |

## Lexemas HNK já canônicos relevantes

Estes lexemas existem no idioma HNK e **não devem ser automaticamente promovidos a palavras-chave de programação sem uma decisão semântica explícita**:

| Lexema HNK | Conceito canônico resumido |
|---|---|
| AHNUVA | AMOR |
| EMANU | VERDADE |
| HAYA | VIDA |
| HODERU | CAMINHO / WAY / VIA / JEITO / MANEIRA / MODO |
| KODAN | LOGOS / núcleo conceitual canônico HNK |

## Regra de promoção

Para preencher uma célula `UNRESOLVED`:

1. identificar conceito computacional;
2. comparar com léxico HNK existente;
3. verificar se equivalência é realmente válida;
4. se não houver lexema adequado, submeter proposta linguística separada;
5. somente após aprovação humana, alterar este registry;
6. criar teste de equivalência HNK/PT-BR/EN → mesmo Semantic ID.

## Formato futuro de máquina

O registry deverá ganhar representação JSON/YAML versionada, usada pelo lexer, Language Server, documentação e testes de conformance.
