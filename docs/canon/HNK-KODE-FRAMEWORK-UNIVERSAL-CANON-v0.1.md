# HNK-KODE Framework — Canon Universal de Linguagem e Camadas v0.1

**Status:** CANON UNIVERSAL — GRUPO HNK  
**Data:** 2026-09-29  
**Autoridade:** HNK / CODEX-HNK / HNK-KODE  
**Fonte de verdade operacional:** `tehknesolutions/HNK-KODE`

## 1. Princípio fundamental

O **HNK-KODE Framework** é um sistema computacional multicamada que transforma:

> **INTENÇÃO → ESTRUTURA → PROGRAMA → EXECUÇÃO → MANIFESTAÇÃO**

Sua arquitetura cobre desde a expressão humana de altíssimo nível até representações computacionais binárias.

A linguagem não será construída tendo o inglês como idioma-base.

A ordem canônica é:

> **HNK → PT-BR → EN**

- **HNK** constitui a linguagem semântica primária.
- **PT-BR** constitui a primeira interface linguística humana do framework.
- **EN** constitui a camada internacional de interoperabilidade.

Nenhuma dessas superfícies pode produzir semânticas diferentes.

```text
HNK ───────┐
           │
PT-BR ─────┼──→ AST CANÔNICA → HNK-IR
           │
EN ────────┘
```

Portanto:

> **três formas de expressão → uma única linguagem computacional.**

## 2. Regra de autoridade linguística

O compilador não deve internamente pensar em palavras inglesas como `world`, `class`, `if`, `function` e depois traduzi-las.

Ele deve operar sobre **identificadores semânticos independentes da língua**.

Exemplo conceitual:

```text
HNK_TOKEN_WORLD
HNK_TOKEN_OBJECT
HNK_TOKEN_EVENT
HNK_TOKEN_CONDITION
HNK_TOKEN_ACTION
```

Cada perfil linguístico resolve esses símbolos.

```text
SEMANTIC ID          HNK          PT-BR        EN
WORLD                [HNK]        mundo        world
OBJECT               [HNK]        objeto       object
COMPONENT            [HNK]        componente   component
EVENT                [HNK]        evento       event
ACTION               [HNK]        ação         action
WHEN                 [HNK]        quando       when
RETURN               [HNK]        retornar     return
```

Os termos marcados `[HNK]` só podem ser preenchidos pelo **léxico canônico HNK-KODE**.

> **Proibição:** não criar palavras HNK arbitrariamente para completar a sintaxe.

## 3. As nove camadas computacionais

```text
L8  ALEF / INTENT
        ↓
L7  NARRATIVE / EXPERIENCE
        ↓
L6  VISUAL / GLYPH / BLOCK
        ↓
L5  HNK-KODE HIGH LEVEL
        ↓
L4  OBJECT + COMPONENT + TYPE
        ↓
L3  SYSTEM / LOGIC / RUNTIME MODEL
        ↓
L2  HNK-IR
        ↓
L1  BYTECODE / WASM / TARGET IR
        ↓
L0  BINARY / MACHINE / MALKUTH
```

Regra:

> **quanto mais alto, mais próximo da intenção humana; quanto mais baixo, mais próximo da manifestação física computacional.**

## 4. L8 — ALEF / Intent Layer

É o nível mais alto. O Criador pode expressar uma intenção sem escrever código convencional.

```kode
intenção "Criar Academia HNK" {
    público = iniciante
    experiência = interativa

    plataformas {
        web
        mobile
    }

    produzir {
        aplicação
        documentação
        mockup
        curso
        vídeo
    }
}
```

Entradas possíveis: linguagem natural, IA, voz, formulário, prompt, diálogo, wizard ou HNK-KODE Studio.

Saída: **Intent Graph**.

## 5. L7 — Narrative / Experience Layer

Narrativa é tratada como estrutura computacional.

```kode
experiência Despertar {
    cenário Caverna
    personagem Alakazam

    sequência {
        despertar
        observar
        explorar
        encontrar Shimokode
    }
}
```

Primitivas narrativas previstas:

```text
SCENE
EVENT
ACTOR
STATE
OBJECTIVE
CHOICE
CONSEQUENCE
TRANSITION
```

## 6. L6 — Visual / Block / Glyph

Camada inspirada funcionalmente por Scratch, App Inventor, RPG Maker e Mandala-HNK.

O mesmo evento textual:

```kode
quando jogador entra Caverna {
    despertar Alakazam
}
```

poderá ser representado por blocos, nós ou glifos, convergindo para a mesma AST/HNK-IR.

```text
MANDALA
   ↓
PATH
   ↓
GLYPH
   ↓
OPERATION
```

Texto, blocos e glifos são **representações de um mesmo programa**, não linguagens separadas.

## 7. L5 — HNK-KODE High Level

Superfície textual principal. Prioriza legibilidade e intenção.

PT-BR:

```kode
mundo AbraIsland {
    área Caverna {
        personagem Alakazam

        quando Alakazam.entra {
            despertar()
        }
    }
}
```

EN:

```kode
world AbraIsland {
    area Cave {
        character Alakazam

        when Alakazam.enters {
            awaken()
        }
    }
}
```

HNK utilizará exclusivamente lexemas canônicos já aprovados.

As três formas geram:

```text
SAME AST
SAME HNK-IR
SAME PROGRAM
```

Perfis:

```kode
@lingua HNK
@lingua PT-BR
@lingua EN
```

Padrão do ecossistema HNK:

```text
@lingua HNK
```

Quando a superfície humana não estiver em HNK:

> **PT-BR > EN**

## 8. L4 — Object / Component / Type

O framework combina POO e componentização.

Influência estrutural: elegância de tipos e contratos de C#, component model de Unity e composição de React.

```kode
classe Personagem : Entidade {
    vida: Vida
    posição: Vetor3
}
```

Composição:

```kode
Alakazam
    + Transformação
    + Movimento
    + Combate
    + Inventário
    + Diálogo
    + IA
    + Narrativa
```

Regra:

- **POO para identidade e contratos.**
- **Componentes para capacidades.**
- **Sistemas para comportamento coletivo.**

## 9. L3 — System / Logic Layer

Objetos não carregam toda a inteligência do sistema.

```kode
sistema Combate {
    observa [Atacante, Alvo]

    quando ataque {
        calcularDano()
        aplicarDano()
        emitir EventoDano
    }
}
```

Domínios previstos:

```text
UI
WORLD
PHYSICS
GAMEPLAY
DATA
NETWORK
AUTH
AI
AUDIO
ANIMATION
ECONOMY
SOCIAL
WORKFLOW
AUTOMATION
```

## 10. L2 — HNK-IR

O **HNK-IR** é a representação intermediária semântica canônica.

Ele não representa apenas instruções de execução. Representa **o que existe**, suas relações, comportamentos e origem.

```yaml
Entity:
  id: hnk://character/alakazam

Components:
  - Transform
  - Character
  - NarrativeActor

Relations:
  - locatedIn: Cave

Event:
  trigger: PlayerEnter

Action:
  awaken: Alakazam
```

Neste nível, a origem pode ter sido HNK, PT-BR, EN, Visual Blocks, Mandala ou IA.

A autoridade passa a ser o **HNK-IR**.

## 11. L1 — Bytecode / Target IR

```text
                 HNK-IR
                    │
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
 JavaScript       WASM          HNK VM
      ↓             ↓             ↓
 Browser         Native        Runtime
```

Targets/adapters previstos:

```text
TypeScript
JavaScript
C#
PHP
HTML/CSS
Canvas
WebGL
Phaser
Three.js
Unity
Godot
Node
WASM
Native
```

O target **não define a linguagem**. É uma manifestação dela.

## 12. L0 — Binary / Malkuth

```text
HNK-KODE
↓
HNK-IR
↓
Lowered IR
↓
Bytecode / WASM / Native IR
↓
Machine Code
↓
Binary
```

Conceito:

```text
ALEF
Intenção
   ↓
...
   ↓
MALKUTH
Manifestação
   ↓
0 / 1
```

O framework deve cobrir formalmente:

> **INTENÇÃO HUMANA ↔ BINÁRIO**

## 13. Compilação e genealogia reversível

Meta: preservar o máximo possível de identidade entre camadas.

```text
INTENT
 ↕
NARRATIVE
 ↕
VISUAL
 ↕
HNK-KODE
 ↕
AST
 ↕
HNK-IR
 ↕
MANDALA
 ↕
BYTECODE
```

Nem toda transformação será perfeitamente reversível até código de máquina, mas dentro do ecossistema HNK haverá **provenance + source maps + lineage**.

Um objeto executável deverá poder responder:

- Quem me criou?
- De qual intenção vim?
- Qual fonte KODE me declarou?
- Qual nó AST me representa?
- Qual entidade HNK-IR sou?
- Qual glifo/PATH me codifica?
- Qual build me gerou?

## 14. Sintaxe multilíngue sem fragmentação

Existe uma única **Canonical Grammar** e múltiplos **Language Profiles**.

```text
                CANONICAL GRAMMAR
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        HNK          PT-BR          EN
```

Exemplo:

```kode
mundo MeuMundo {}
```

```kode
world MyWorld {}
```

Ambos lexicalizam:

```text
NODE_KIND = WORLD_DECLARATION
```

## 15. HNK acima das traduções

Lexemas canônicos já existentes, como:

```text
AHNUVA
EMANU
HAYA
HODERU
KODAN
```

preservam identidade HNK. PT-BR e EN fornecem equivalências contextuais, não autoridade sobre o conceito.

```text
HNK concept
      ↓
semantic ID
   ↙       ↘
PT-BR      EN
```

Jamais:

```text
English
  ↓
translation
  ↓
HNK
```

## 16. Três experiências de programação

```text
HNK-KODE VISUAL
        ↓
Blocos / Nodes / Mandala / RPG Maker-like

HNK-KODE STANDARD
        ↓
Sintaxe declarativa/narrativa

HNK-KODE PRO
        ↓
Tipos / POO / Components / Systems / Generics / Async
```

Todas convergem para o mesmo HNK-IR.

Um iniciante pode trabalhar visualmente e um engenheiro pode abrir o mesmo projeto em nível profissional, sem converter para outra linguagem.

## 17. Equação canônica do Framework

```text
ALEF / INTENÇÃO
      ↓
HNK-KODE
      ↓
HNK OBJECT MODEL
      ↓
AST
      ↓
HNK-IR
      ↕
MANDALA-HNK
      ↓
LOWERED IR
      ↓
BYTECODE / WASM / TARGET
      ↓
BINÁRIO
      ↓
MALKUTH / MANIFESTAÇÃO
```

Manifestações laterais:

```text
HNK-IR
 │
 ├── CODE
 ├── WEB
 ├── APP
 ├── GAME
 ├── WORLD
 ├── UI
 ├── MOCKUP
 ├── WIREFRAME
 ├── DOC
 ├── GDD
 ├── PDD
 ├── IMAGE
 ├── VIDEO
 ├── AUDIO
 ├── PROMPT
 ├── AGENT
 └── WORKFLOW
```

## 18. Regra canônica congelada

> **HNK-KODE não é uma linguagem inglesa personalizada.**

> **HNK-KODE é uma linguagem HNK com interfaces HNK, PT-BR e EN.**

Prioridade oficial:

```text
1. HNK — CANÔNICO
2. PT-BR — NATIVO HUMANO PRINCIPAL
3. EN — INTERNACIONAL / INTEROPERABILIDADE
```

O idioma da superfície jamais altera a identidade computacional do programa.

- **HNK → PT-BR → EN** são interfaces linguísticas.
- **AST → HNK-IR → Binary** constituem a identidade computacional.

Essa regra governa parser, compilador, documentação, IDE, SDK, mensagens de erro, autocomplete, Language Server, copiloto de IA, bibliotecas e futuras especificações.

## 19. Escopo universal do HNK-KODE Framework

O HNK-KODE não deve gerar apenas software. Um mesmo núcleo semântico poderá gerar múltiplos artefatos:

```text
INTENÇÃO
   ↓
HNK-KODE
   ↓
HNK OBJECT MODEL
   ↓
HNK-IR
   ↓
MANIFESTAÇÕES
   ├── CODE
   ├── UI
   ├── WEB
   ├── GAME
   ├── DOC
   ├── GDD
   ├── PDD
   ├── MOCKUP
   ├── WIREFRAME
   ├── IMAGE
   ├── VIDEO
   ├── PROMPT
   ├── DATA
   └── AI AGENT
```

A mesma entidade semântica poderá possuir representações específicas por target, preservando origem e identidade.

## 20. Inspirações funcionais

O framework absorve ideias, não sintaxes inteiras:

| Referência | Princípio absorvido |
|---|---|
| React | componentização |
| Next.js | composição de aplicação e fronteiras client/server |
| C# | tipos, contratos, interfaces, generics e elegância POO |
| Unity | GameObject/componentes/sistemas/scenes |
| PHP | pragmatismo fullstack |
| HTML | estrutura semântica |
| CSS | apresentação declarativa |
| JavaScript | comportamento/eventos |
| Markdown | texto estruturado humano |
| Canvas | manifestação gráfica programável |
| Phaser | runtime 2D |
| RPG Maker | autoria de jogos, mapas e eventos |
| BYOND | linguagem ligada a mundos programáveis |
| App Inventor | composição visual |
| Scratch | blocos, eventos e aprendizado visual |
| HNK | intenção → manifestação |

## 21. Componentes oficiais do ecossistema HNK-KODE

```text
HNK-KODE
│
├── Language
├── HNK Object Model (HOM)
├── Parser / AST
├── Canonical Type System
├── HNK-IR
├── MHCM / Mandala-HNK Computational Model
├── Compiler / Lowering
├── Runtime
├── Manifestation Engine
├── Target Adapters
├── SDK
├── Language Server
└── HNK-KODE Studio
```

## 22. Relação com o ecossistema HNK

```text
HNK
├── CODEX-HNK    → autoridade integral / canon
├── HNK-KODE     → idioma + linguagem + framework
└── HNK-VERSE    → plataforma de mundos/experiências

Tehkné Solutions
└── TEHKNÉ-OS    → know-how tecnológico, arqueologia, evidência e proveniência
```

Fluxo:

```text
INTENÇÃO
   ↓
HNK-KODE
   ↓
COMPILAÇÃO / MANIFESTAÇÃO
   ↓
HNK-VERSE / OUTROS TARGETS
   ↓
EXPERIÊNCIA
   ↓
OBSERVAÇÃO
   ↓
EVIDÊNCIA
   ↓
CODEX-HNK / TEHKNÉ-OS
```

## 23. Próximo gate arquitetural

Antes de expandir o parser, congelar:

1. **HNK Semantic Token Registry v0.1**
2. Canonical Grammar
3. Language Profiles HNK / PT-BR / EN
4. HNK Object Model v0.1
5. AST Schema v0.1
6. HNK-IR Schema v0.1
7. primeiro lowering verificável até um target executável
8. primeira cadeia demonstrável **ALEF → … → BINARY → MALKUTH**

---

**Decisão de autoridade:** este documento substitui propostas anteriores apenas quando houver conflito explícito. Materiais antigos permanecem históricos e devem ser reinterpretados à luz deste Canon Universal.
