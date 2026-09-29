# haKodan / HNK-KODE — HNK-MATH Mass Glyph Candidate Batch v1.7.5

**STATUS:** STRUCTURAL CANDIDATES / NÃO CANÔNICO

## Produção

- Pool estrutural deduplicado: **30,000** identidades N=12 amostradas.
- Elegíveis após filtro de degeneração: **29,929**.
- Candidatos distribuídos: **1,000**.
- SVGs individuais renderizados: **120**.
- Contact sheets: **5 × 24 = 120 visualizações**.

## Regra de autoridade

Nenhum candidato deste lote é CANON. Os cinco lexemas já são canônicos; suas identidades glíficas ainda exigem Human Gate. O hash do lexema é usado apenas para alocação determinística entre candidatos estruturais de alta qualidade, nunca como prova de significado.

## Kernel aplicado

- N=12 simple paths.
- Grafo MF+CG (441 nós).
- Simetria D9 e equivalência por reversão.
- GlyphFeatureVector compatível com coarse/topological/radialAngular.
- benchmark HNK40 usado como distância estrutural/confusão.
- nenhuma semântica derivada da geometria.

## Resumo por lexema

| Lexema | Candidatos | SVG shortlist | Coarse | Topological | Radial-angular | Distância HNK40 min..max |
|---|---:|---:|---:|---:|---:|---:|
| AHNUVA | 200 | 24 | 34 | 191 | 142 | 9..56 |
| EMANU | 200 | 24 | 39 | 194 | 140 | 8..37 |
| HAYA | 200 | 24 | 36 | 199 | 148 | 9..45 |
| HODERU | 200 | 24 | 33 | 194 | 143 | 8..38 |
| KODAN | 200 | 24 | 37 | 192 | 140 | 9..55 |

## Política de alta intensidade

A produção deve operar em lotes grandes e determinísticos:
1. gerar pool estrutural válido;
2. deduplicar por D9 + reversão;
3. classificar coarse/topological/radialAngular;
4. medir distância/confusão contra HNK40;
5. distribuir candidatos sem inferir semântica da geometria;
6. renderizar shortlists;
7. aplicar testes de legibilidade/confusão;
8. reduzir por gates;
9. Human Gate;
10. somente depois CANON_BINDING + glyphId/sigil/codepoint.

## Próximo gate

- ampliar o pool estrutural;
- testar legibilidade 16/24/32/64 px;
- calcular matriz completa de confusão dos 120 shortlists;
- reduzir 24 → 7 candidatos por lexema;
- Human Gate de 35 candidatos;
- somente aprovados recebem CANON_BINDING.
