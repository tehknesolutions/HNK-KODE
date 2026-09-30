# haKodan v1.0 — Roadmap de Linguagem Visual, Kodins e Compilação

**Status:** APROVADO PARA IMPLEMENTAÇÃO — 2026-09-29

## 1. Objetivo

Transformar os contratos v0.9 em uma linguagem de programação utilizável em três superfícies equivalentes:

- HNK-KODE
- PT-BR
- EN

As superfícies podem ser usadas isoladamente ou misturadas token a token quando a resolução semântica for determinística.

A linguagem visual deve funcionar no modelo de blocos inspirado em App Inventor: blocos de ação, dados, lógica, fluxo, funções, eventos, estruturas, operadores e manifestação. O bloco é uma projeção editável do mesmo Semantic ID usado pela sintaxe textual; não é uma linguagem paralela.

## 2. Regra central

```text
TEXTO ────────┐
BLOCOS ───────┼→ Semantic ID → AST → HOM → HNK-IR → TARGET IR → BYTECODE/MACHINE
GLIFO/SIGILO ─┘
```

Um conceito semântico deve poder ser representado por texto, bloco e glifo sem criar três identidades diferentes.

## 3. As três camadas da linguagem

### Camada A — Sintaxe pura

Forma textual determinística, adequada para editor, arquivo, diff, versionamento e compilação.

### Camada B — Blocos

Cada bloco possui:

- Semantic ID;
- categoria;
- sockets de entrada;
- slots de saída;
- tipos esperados;
- children;
- escopo;
- source/provenance;
- posição editorial;
- diagnóstico de conexão inválida.

Conexões inválidas falham fechado e nunca alteram silenciosamente a semântica.

### Camada C — Glifo/Sigilo HNK-KODE

Cada Kodin canônico terá um identificador de glifo próprio. O glifo é uma projeção semântica e visual; geometria, numerologia ou HNK-MATH não podem inventar Semantic IDs.

Os Kodins ainda provisórios permanecem `PROVISIONAL` até Creator Gate. O registry pode reservar seus GIDs sem promovê-los a canon.

## 4. Categorias de blocos v1

1. ACTION — criar, alterar, remover, conectar, transformar, executar.
2. DATA — valor, variável, lista, mapa, registro, memória.
3. LOGIC — condição, comparação, booleanos, AND/OR/NOT.
4. FLOW — quando, se, senão, para, cada, enquanto, então, retorno.
5. FUNCTION — definição, chamada, parâmetros, retorno.
6. EVENT — evento, sinal, trigger, listener.
7. ENTITY — mundo, objeto, entidade, classe, componente, sistema.
8. IO — arquivo, rede, import/export, entrada/saída.
9. SECURITY — capability, permission, allow, deny, authority.
10. AI — agent, prompt, intent, goal, plan, task, role.
11. DESIGN — visual, layout, style, color, image, audio, video.
12. MANIFEST — target, format, adapter, artifact.
13. HNK — Kodins canônicos, glifos, HNK-MATH e operações de projeção.

## 5. Blocos encaixáveis

Todo bloco deve declarar seu contrato de encaixe. Exemplo conceitual:

```text
[SE] ───────────────┐
  condição: [ < ]   │
  então:             │
    [CRIAR entidade]
  senão:             │
    [EMITIR evento]
```

A representação visual não altera a AST. Ela apenas edita a mesma estrutura semântica.

## 6. Tipagem

v1 deve ser explicitamente tipada nos sockets. Tipos inválidos produzem diagnóstico; não existe coerção silenciosa.

Famílias iniciais:

`BOOL, NUMBER, STRING, SYMBOL, ENTITY, TYPE, LIST, MAP, RECORD, FUNCTION, EVENT, FLOW, TARGET, ARTIFACT, ANY`

`ANY` somente quando o contrato do bloco explicitamente permitir.

## 7. Kodins e glifos

O registry atual contém 127 entradas:

- 5 CANON;
- 122 PROVISIONAL.

Canon atual:

`AHNUVA · EMANU · HAYA · HODERU · KODAN`

Cada entrada deve evoluir para:

```text
Kodin
 ├─ Semantic ID
 ├─ PT-BR aliases
 ├─ EN aliases
 ├─ HNK spelling
 ├─ syllabic/phonological metadata
 ├─ GID
 ├─ glyph/sigil
 ├─ HNK-MATH metadata
 ├─ provenance
 └─ canon status
```

Não promover os 122 provisórios automaticamente.

## 8. PT-BR

PT-BR aceita acentuação e forma ASCII quando registradas como equivalentes de normalização:

`ação == acao`

`condição == condicao`

`função == funcao`

`não == nao`

O texto original sempre permanece disponível para editor e provenance. Normalização não é tradução.

## 9. HNK-KODE / PT-BR / EN mistos

Exemplo conceitual válido:

```text
CRIAR Garukan CLASS Teknomage
CREATE Garukan CLASSE Teknomage
CRIAR Garukan CLASS Teknomage
```

Todos devem convergir para a mesma estrutura semântica quando os aliases estiverem registrados e não houver ambiguidade.

## 10. Matemática HNK

HNK-MATH entra como camada estrutural/metadados para:

- família;
- posição;
- relações;
- simetria;
- identidade geométrica;
- correspondências aprovadas;
- checks de consistência.

HNK-MATH não pode gerar uma palavra, Semantic ID ou regra de execução simplesmente por associação geométrica/numerológica.

## 11. Compilação universal

A formulação técnica é:

> haKodan pode alcançar qualquer linguagem, VM, ISA ou formato para o qual exista um backend/adapter validado.

O core não assume uma máquina específica.

```text
Semantic ID
   ↓
AST
   ↓
HOM
   ↓
HNK-IR
   ↓
Target IR
   ├─ JS/TS
   ├─ Python
   ├─ C/C++/C#
   ├─ Rust
   ├─ WASM
   ├─ LLVM IR
   ├─ haKodan bytecode
   └─ native backends
          ↓
       ISA-specific
```

## 12. Milestones

### V1.0-M1 — Block Contract

- schema universal de bloco;
- sockets/slots;
- tipos;
- categorias;
- conexão e diagnóstico;
- round-trip bloco ↔ AST.

### V1.0-M2 — Logic + Function Blocks

- IF/ELSE;
- booleanos/comparadores;
- loops;
- funções;
- parâmetros;
- retorno;
- escopo.

### V1.0-M3 — Triple Surface

- texto PT-BR;
- texto EN;
- HNK-KODE;
- mix token a token;
- bloco ↔ texto;
- bloco ↔ HNK-KODE.

### V1.0-M4 — Kodin Glyph Registry

- GID;
- glifo por Kodin;
- status CANON/PROVISIONAL;
- provenance;
- HNK-MATH metadata;
- render projection.

### V1.0-M5 — Compiler Targets

- target adapters;
- source maps Semantic ID;
- deterministic bytecode;
- primeiro backend adicional validado além de JavaScript.

### V1.0-M6 — Creator Gate

- revisão dos Kodins;
- aprovação explícita;
- promoção controlada de canon;
- snapshot de registry.

## 13. Primeiro gate de implementação

Não iniciar geração em massa de 127 glifos antes do schema de bloco e do Semantic ID registry estarem estáveis. Primeiro construir o contrato que fará cada glifo, palavra e bloco apontar para a mesma identidade.

## 14. Critério de saída v1.0

```text
TEXTO PT-BR ─┐
TEXTO EN ────┼→ mesmo Semantic ID → mesmo AST → mesmo HNK-IR
HNK-KODE ────┤
BLOCO ───────┤
GLIFO ───────┘
```

Com:

- round-trip determinístico;
- fail-closed para ambiguidade;
- provenance preservada;
- canon separado de discovery;
- nenhuma semântica criada por aparência do glifo;
- backend explicitamente validado por target.
