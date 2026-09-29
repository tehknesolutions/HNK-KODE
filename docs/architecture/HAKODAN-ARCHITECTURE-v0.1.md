# haKodan — Architecture Blueprint v0.1

**Data:** 2026-09-29  
**Status:** arquitetura aprovada; implementação incremental  
**Fonte canônica relacionada:** `docs/canon/HNK-KODE-FRAMEWORK-UNIVERSAL-CANON-v0.1.md`

## Objetivo

Construir o **haKodan**, framework universal do HNK-KODE, em que intenção, narrativa, objetos, componentes, UI, gameplay, documentos, mídia, prompts e automações possam compartilhar um mesmo modelo semântico e produzir targets distintos.

## Pipeline principal

```text
ALEF / INTENT
  ↓
Intent Graph
  ↓
HNK-KODE Surface (HNK | PT-BR | EN | Visual | Glyph)
  ↓
Lexer / Parser
  ↓
Canonical AST
  ↓
HNK Object Model + Type System
  ↓
HNK-IR
  ↔ MHCM / Mandala-HNK
  ↓
Lowering
  ↓
Target IR
  ↓
JS/TS | WASM | HNK VM | C# | PHP | Game/Web/Native adapters
  ↓
Runtime / Artifact
  ↓
MALKUTH / Manifestation
```

## Núcleo semântico

### HNK Object Model (HOM)

Toda entidade HNK pode declarar:

- identity
- type
- state
- properties
- components
- relations
- behaviors
- events
- narrative
- assets
- presentation
- data
- manifestations
- provenance

Princípios:

- POO para identidade e contratos.
- componentes para capacidades.
- sistemas para comportamento coletivo.
- eventos para causalidade.
- narrativa como estrutura executável.
- provenance obrigatório entre camadas.

## Manifestation Engine

O **HNK Manifestation Engine (HME)** recebe HNK-IR e produz artefatos/targets.

Primeiras famílias:

### Code
- TypeScript
- JavaScript
- HTML/CSS
- Node
- futuramente C#/PHP/WASM/Native

### Experience
- Web
- App
- Game
- World
- UI

### Design
- Wireframe
- Mockup
- design specification
- component specification

### Documentation
- Markdown
- DOC/PDF via exporters
- GDD
- PDD
- architecture docs
- runbooks

### Media / AI
- image specification/prompt
- video specification/script/prompt
- audio specification
- agent prompt
- workflow

## Language Profiles

Existe **uma gramática canônica**.

```text
Canonical Grammar
 ├── HNK profile (primary/canonical)
 ├── PT-BR profile (primary human bridge)
 └── EN profile (international interoperability)
```

Cada token de superfície resolve para um Semantic ID. O Semantic ID nunca depende de EN.

## Três níveis de autoria

### Visual
Blocos, nós, Mandala, glifos e editores inspirados em RPG Maker/App Inventor/Scratch.

### Standard
Sintaxe declarativa/narrativa de alta legibilidade.

### Pro
Tipos, interfaces, generics, components, systems, async, patterns e APIs avançadas.

Todos convergem para a mesma AST/HNK-IR.

## Estratégia de implementação

### V0.1 — Vertical Slice
Escopo mínimo executável:

```text
world → entity → property → event → action
```

Requisitos:
- perfil PT-BR funcional;
- perfil EN de interoperabilidade;
- perfil HNK apenas para lexemas canônicos confirmados;
- parser;
- AST;
- HNK-IR;
- target inicial TypeScript/JavaScript;
- teste que prova equivalência PT-BR/EN no mesmo IR;
- provenance básico.

### V0.2 — Object/Component
- HOM
- componentes
- tipos
- sistemas
- relações
- eventos tipados

### V0.3 — Visual Authoring
- graph/block representation
- round-trip Visual ↔ AST
- primeiro adapter Mandala/PATH experimental

### V0.4 — Manifestation Engine
- Web
- Document
- UI spec
- Game/Canvas proof

### V0.5 — Studio
- explorer
- editor
- inspector
- preview
- console
- manifestation selector
- RUN/MANIFEST

### V1.0 — Universal Authoring Baseline
- HNK/PT-BR/EN estáveis
- HOM estável
- HNK-IR versionado
- target adapters documentados
- provenance/source maps
- Language Server
- Studio
- SDK
- CI conformance suite

## Regra de interoperabilidade

HNK-KODE poderá compilar/transpilar para outros ecossistemas, mas **nenhum target externo se torna autoridade semântica**.

```text
HNK-KODE → HNK-IR → target
```

Nunca:

```text
target language → define HNK semantics
```

## Boundary com outros projetos

- **CODEX-HNK**: autoridade canônica e contratos de conhecimento.
- **HNK-KODE**: autoridade da linguagem/framework.
- **HNK-VERSE**: consumidor/runtime de mundos e experiências.
- **TEHKNÉ-OS**: know-how, archaeology, evidence e provenance tecnológica.
- **SimpleWay e demais produtos**: consumidores/targets possíveis; não definem a linguagem.

## Regra de histórico

Documentos antigos não serão apagados quando a arquitetura evoluir. Devem permanecer versionados, com novos documentos declarando explicitamente o que foi promovido, substituído, rejeitado ou mantido.


## Naming contract

- **HNK-KODE**: linguagem/ecossistema linguístico-computacional.
- **haKodan**: framework oficial que implementa HOM, AST, HNK-IR, MHCM, lowering, runtime, Manifestation Engine, adapters e SDK.
- **HNK-KODE Studio**: IDE/ambiente de autoria sobre haKodan.
