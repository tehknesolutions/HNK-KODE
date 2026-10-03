# HNK-KODE

## haKodan — framework, runtime, SDK e Manifestation Engine

**O foco de produto deste repositório é o haKodan.**

- **HNK-KODE** = idioma + linguagem computacional e autoridade semântica do domínio.
- **haKodan** = framework multicamada, runtime, SDK e Manifestation Engine que implementa o HNK-KODE.
- **HNK-KODE Studio** = ambiente de autoria sobre haKodan.
- **Goodle** = superfície/ponte de criação e fonte de know-how em migração; não é autoridade semântica concorrente.

North Star:

```text
ALEF / INTENT
  ↓
HNK-KODE Surface / Semantic IDs
  ↓
Canonical AST
  ↓
HOM — HNK Object Model
  ↓
HNK-IR
  ↓
Target Capability + Adapter
  ↓
Artifact
  ↓
Runtime / Renderer / Exporter
  ↓
MALKUTH / REAL MANIFESTATION
  ↓
Execution Evidence + Provenance
```

A arquitetura preserva **HNK → PT-BR → EN** como prioridade de perfis, convergindo para a mesma semântica/AST/HNK-IR, com camadas de **L8 ALEF/Intent até L0 Binary/Malkuth**.

## Estado atual — Acceleration V1

O projeto entrou em uma fase de aceleração centrada em converter a infraestrutura existente em produto executável e visível.

Baseline do **Product Completion Index (PCI): 55.05%** em 2026-10-02. O número de milestone (`M62`) não é usado como porcentagem de conclusão.

Prioridade de engenharia:

```text
WORLD → ENTITY → PROPERTY → EVENT → ACTION
  ↓
Canonical semantics / HOM / HNK-IR
  ↓
real supported target
  ↓
artifact
  ↓
VISIBLE EXECUTION
```

A expansão automática de novos milestones de provenance está congelada quando não serve esse Golden Path ou não corrige um defeito de integridade comprovado.

Documentos atuais:

- `docs/spec/HAKODAN-ACCELERATION-MASTER-SPEC-v1.0.md`
- `docs/product/HAKODAN-PDD.md`
- `docs/product/HAKODAN-GDD.md`
- `docs/architecture/HAKODAN-ARCHITECTURE.md`
- `docs/roadmap/HAKODAN-ROADMAP.md`
- `docs/roadmap/HAKODAN-PRODUCT-COMPLETION-INDEX.md`
- `docs/audit/HAKODAN-REPOSITORY-AUDIT-v1.md`

## Núcleo implementado

`packages/hakodan` é o núcleo de implementação. O histórico do projeto registra, entre outros, Semantic Token Registry/Canonical Grammar, AST/HNK-IR, HOM, Type/Component/Event models, VM tables, addressing/dispatch, Hybrid VM execution model, instruction IR/encoding/program, bytecode, trap/runtime foundations, PT-BR/EN equivalence tests e workflow do kernel.

A existência de código/testes não é automaticamente tratada como execução fresca. O projeto distingue explicitamente:

```text
INTENT ≠ PLAN ≠ ARTIFACT ≠ PROTOCOL_CONFORMANCE ≠ EXECUTION_EVIDENCE
```

## Autoria

haKodan prevê três superfícies convergentes:

- **Visual** — blocos, nós, Mandala, glifos e composição gráfica.
- **Standard** — autoria declarativa/narrativa de alta legibilidade.
- **Pro** — tipos, componentes, sistemas, APIs e recursos avançados.

Todas devem resolver para os mesmos Semantic IDs e para a mesma AST/HOM/HNK-IR.

## Manifestation Engine

Famílias arquiteturais previstas incluem:

- **Code:** JavaScript/TypeScript e targets interoperáveis futuros.
- **Experience:** Web, App, Game, World, UI.
- **Design:** wireframe, mockup e specifications.
- **Documentation:** Markdown, GDD, PDD, architecture/runbooks e exporters.
- **Media/AI:** image/video/audio specifications, prompts, agents e workflows.

Uma família prevista não significa backend suportado. Capability Registry/Inventory deve permanecer fail-closed até existir implementação/evidência operacional.

## Goodle → haKodan

Goodle é subordinado à arquitetura haKodan:

```text
Goodle / authoring surface
        ↓
Semantic Bridge
        ↓
haKodan Semantic IDs
        ↓
Canonical AST / HOM
        ↓
HNK-IR
        ↓
Target / Runtime / Manifestation
```

Goodle não pode criar um segundo HNK-IR, HOM, type system, VM ou semantic canon. O histórico de migração permanece em `docs/migration/` e `packages/goodle`.

## Autoridade

**CODEX-HNK é o ROOT CANON do ecossistema HNK.** Ele possui autoridade sobre fundamentos ontológicos e matemáticos do HNK, incluindo HNK-MATH, Atomic-Kode (AK), geometria da Mandala HNK, identidades matemáticas, correspondências canônicas e contratos fundamentais exportados aos consumidores.

**HNK-KODE é o DOMAIN CANON operacional do domínio linguístico/computacional HNK**, subordinado aos contratos fundamentais publicados pelo CODEX-HNK.

HNK-KODE possui autoridade sobre fonologia/fonotática, corpus/léxico, gramática, sistema de escrita/composição linguística, transliteração, manifestações de glifos linguísticos e superfícies linguísticas de encoding/decoding. Ele não pode redefinir independentemente uma fundação cuja autoridade pertença ao ROOT CANON.

Quando houver conflito ROOT/DOMAIN, o conflito permanece explícito e `UNRESOLVED` até reconciliação; não é corrigido por invenção silenciosa.

## Estados de governança

A pesquisa Genesis adota, no mínimo:

`OBSERVED → DERIVED → HYPOTHESIS → CANDIDATE → VALIDATED → CANONICAL`

`UNRESOLVED` representa evidência insuficiente ou conflitante e não pode ser promovido automaticamente. Coincidência numérica, semelhança visual ou analogia simbólica não constitui promoção canônica.

## Contrato CODEX-HNK → HNK-KODE

Fundamentos ROOT devem ser consumidos por identificadores/contratos versionados, preservando:

1. identidade canônica de origem;
2. versão do contrato;
3. proveniência;
4. estado de autoridade;
5. capacidade de detectar divergência.

Alterações incompatíveis no ROOT CANON exigem reconciliação explícita antes de promoção dependente.

## Migração e preservação histórica

Migrações de legado seguem:

`COPY → VERIFY → CONSUME → DEPRECATE → REMOVE`

Nenhuma forma linguística nova é inventada apenas para completar uma migração. Conteúdo preserva proveniência, comportamento, testes e estado de autoridade.

Documentos antigos não são apagados só porque a arquitetura evoluiu. Novos documentos devem declarar o que foi promovido, substituído, rejeitado ou mantido.

## Domínios principais do repositório

- `packages/hakodan` — **núcleo haKodan**.
- `packages/hnk-linguas` — corpus, léxico, gramática e runtime linguístico.
- `packages/hnk-glyphs` — glifos linguísticos, fonemas e runtime associado.
- `packages/goodle` — creator/migration/bridge/provenance support.
- `canon` — registros do Domain Canon versionados.
- `governance` — promoção, autoridade e contratos ROOT/DOMAIN.
- `assets` — ativos canônicos e, após auditoria, ativos de produto aprovados.
- `docs` — produto, arquitetura, design, pesquisa, migração e histórico.
- `tests` — validação transversal.

## Consumidores e dependências

- **CODEX-HNK** — ROOT CANON e publicador de fundamentos.
- **HNK-VERSE** — consumidor/runtime futuro de mundos e experiências.
- **SimpleWay-HNK** — experiência pedagógica consumidora.
- **SimpleWay Math** — laboratório/consumidor de pesquisa matemática.
- **TEHKNÉ-OS** — know-how/evidence/provenance tecnológica conforme contratos entre repositórios.
- **Goodle Browser** — fonte histórica/authoring bridge durante migração.

Consumidores não transferem para si a autoridade semântica do HNK-KODE/haKodan.

## Identidade e assets

Assets linguísticos/canônicos existentes, incluindo glifos, não são automaticamente tratados como identidade UI completa do haKodan. A Acceleration V1 exige inventário de proveniência e somente decisões visuais aprovadas serão promovidas ao design system e a `assets/hakodan/`.

## Próximo gate

O próximo salto de produto é provar:

> **Uma intenção entra no haKodan e uma manifestação real, visível e verificável sai.**

O roadmap oficial desta fase está em `docs/roadmap/HAKODAN-ROADMAP.md`.


## Web Manifestation V1

The first real Web vertical slice is now evidenced: canonical PT-BR/EN Golden Path → HNK-IR → fail-closed Web target → deterministic HTML/JS → Chrome execution → observable DOM. Acceptance fixture: packages/hakodan/examples/golden-path-web/. Fresh local regression: **169/169 PASS**. Current evidence-backed PCI: **74.45%**; next major gaps are haKodan Studio/authoring and approved identity/assets integration.
