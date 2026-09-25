# HNK-KODE

Repositório oficial e independente do cânone do Idioma HNK.

## Autoridade

**HNK-KODE é o Source of Truth do domínio linguístico HNK.**

CODEX-HNK, SimpleWay-HNK, HNK-VERSE e demais produtos consumidores não devem manter cânones linguísticos divergentes.

## Migração inicial

A extração do legado atualmente residente em `codex-hnk/packages/hnk-linguas` e `codex-hnk/packages/hnk-glyphs` seguirá obrigatoriamente:

`COPY -> VERIFY -> CONSUME -> DEPRECATE -> REMOVE`

Nenhuma forma linguística nova deve ser inventada durante a migração. Conteúdo existente deve preservar proveniência, comportamento, testes e estado de autoridade.

## Domínios previstos

- `packages/hnk-linguas` — corpus, léxico, gramática e runtime linguístico.
- `packages/hnk-glyphs` — glifos linguísticos, fonemas e runtime associado.
- `canon` — registros canônicos versionados.
- `governance` — regras de promoção e autoridade.
- `references` — fontes e proveniência.
- `docs` — documentação.
- `tests` — validação de integração e equivalência.

## Fronteiras

A relação entre glifos linguísticos do HNK-KODE e sigilos do SIGILKODE-HNK deve ser auditada e documentada antes de qualquer fusão estrutural.

## Consumidores

- CODEX-HNK — consumidor do cânone linguístico.
- SimpleWay-HNK — curso oficial/experiência pedagógica do Idioma HNK.
- HNK-VERSE — consumidor futuro do idioma em runtime/gameplay.
