# HNK-KODE Canon Extraction Implementation Plan

**Goal:** Extrair com segurança o cânone do Idioma HNK hoje hospedado no CODEX-HNK e estabelecer HNK-KODE como sua autoridade independente.

**Architecture:** Preservação primeiro. O conteúdo existente é copiado e verificado antes de qualquer consumidor ser alterado. CODEX-HNK só deixa de hospedar a implementação canônica após equivalência comprovada e migração dos consumidores.

**Tech Stack:** Node.js, ESM, TypeScript declarations e suites existentes dos packages HNK.

## Global Constraints

- HNK-KODE será o Source of Truth oficial do Idioma HNK.
- Não inventar léxico, gramática, fonemas ou glifos para preencher lacunas.
- Preservar proveniência e estados de autoridade.
- Migração obrigatória: `COPY -> VERIFY -> CONSUME -> DEPRECATE -> REMOVE`.
- Não fundir automaticamente glifo linguístico com sigilo de SIGILKODE-HNK.

## Task 1 — Baseline do legado

- [ ] Inventariar integralmente `codex-hnk/packages/hnk-linguas`.
- [ ] Inventariar integralmente `codex-hnk/packages/hnk-glyphs`.
- [ ] Registrar package names, exports, scripts e dependências.
- [ ] Executar e registrar baseline dos testes dos dois packages.
- [ ] Identificar referências internas no CODEX-HNK.

## Task 2 — Extração preservativa

- [ ] Copiar `hnk-linguas` sem alterações semânticas para `packages/hnk-linguas`.
- [ ] Copiar `hnk-glyphs` sem alterações semânticas para `packages/hnk-glyphs`.
- [ ] Preservar fixtures, reference, visual e testes associados.
- [ ] Adicionar workspace/root scripts mínimos necessários para executar os testes.

## Task 3 — Gate de equivalência

- [ ] Rodar suites no CODEX-HNK e HNK-KODE.
- [ ] Comparar exports públicos.
- [ ] Comparar corpus, lexemas e grammar output deterministicamente.
- [ ] Comparar glyph registry e metadados estruturais.
- [ ] Bloquear promoção se qualquer divergência não explicada existir.

## Task 4 — Fronteira SIGILKODE

- [ ] Auditar SIGILKODE-HNK.
- [ ] Classificar cada artefato relacionado como `LANGUAGE`, `GLYPH`, `SIGIL`, `SHARED` ou `UNRESOLVED`.
- [ ] Documentar relações sem fundir autoridades automaticamente.

## Task 5 — Consumer contracts

- [ ] Mapear consumo atual pelo CODEX-HNK.
- [ ] Mapear consumo atual pelo SimpleWay-HNK.
- [ ] Definir contrato de consumo futuro do HNK-VERSE.
- [ ] Migrar consumidores um por vez, mantendo gates verdes.

## Task 6 — Transferência de autoridade

- [ ] Marcar packages antigos no CODEX-HNK como deprecated após consumidores externos funcionarem.
- [ ] Atualizar documentação de Source of Truth em CODEX-HNK e SimpleWay-HNK.
- [ ] Remover implementação duplicada somente após gate final.
- [ ] Registrar versão inicial canônica do HNK-KODE.

## Definition of Done

HNK-KODE executa independentemente, reproduz o comportamento e corpus aprovado do legado, possui testes verdes, tem fronteira documentada com SIGILKODE-HNK e é consumido sem duplicação canônica pelos projetos dependentes.
