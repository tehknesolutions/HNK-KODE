# haKodan Mora-Kodin Mass Discovery v0.4

**Status:** DISCOVERY_NON_CANONICAL  
**Source:** `VHK_HNK_lexical_shortlist_v0.2.json`

## Batch result

- provisional concepts processed: **122**
- candidates generated: **366**
- candidates with full moraic-pattern score: **366**
- duplicate generated forms: **0**
- new canon promotions: **0**

This batch changes the production method, not the lexical canon.

## Method

For every provisional concept the generator:
1. extracts/derives a reusable consonantal root skeleton;
2. classifies the concept into a semantic/morphological family;
3. generates three deterministic mora-oriented candidates;
4. preserves an already mora-friendly provisional form as one candidate where possible;
5. scores mora regularity, root retention, family ending, compactness, corpus distinctness and HNK phonetic texture;
6. chooses a **shortlist candidate**, still marked `DISCOVERY_CANDIDATE`.

Reference-language influence is structural only. Japanese, Semitic languages, Greek, Esperanto and Enochian do not assign HNK semantics.

## First 25 shortlist results

| Semantic ID | PT-BR | Previous | Root | A/B/C winner | Score |
|---|---|---|---|---|---:|
| `CREATE` | CRIAR | `KADENA` | `K-D-N` | **KADENA** (A) | 83 |
| `DEFINE` | DEFINIR | `DENURA` | `D-N-R` | **DENURA** (A) | 81 |
| `ALTER` | ALTERAR | `NALOL` | `N-L-D` | **NULODA** (B) | 88 |
| `REMOVE` | REMOVER | `SARA` | `S-R-H` | **SARAHA** (B) | 87 |
| `CONNECT` | CONECTAR | `VAMA` | `V-M-D` | **VIMODA** (B) | 87 |
| `ASSOCIATE` | ASSOCIAR | `SEYA` | `S-Y-N` | **SAYONA** (B) | 90 |
| `ACTIVATE` | ATIVAR | `SEKI` | `S-K-T` | **SOKUTA** (B) | 90 |
| `DEACTIVATE` | DESATIVAR | `KIDI` | `K-D-L` | **KUDILA** (B) | 87 |
| `EXECUTE` | EXECUTAR | `LUVIH` | `L-V-H` | **LAVUHA** (B) | 87 |
| `MANIFEST` | MANIFESTAR | `MANEV` | `M-N-V` | **MINOVA** (B) | 87 |
| `TRANSFORM` | TRANSFORMAR | `LIKI` | `L-K-R` | **LAKURA** (B) | 87 |
| `VALIDATE` | VALIDAR | `KEVO` | `K-V-M` | **KEVIMA** (B) | 87 |
| `IMPORT` | IMPORTAR | `SELI` | `S-L-G` | **SOLEGA** (B) | 88 |
| `EXPORT` | EXPORTAR | `ZIHA` | `Z-H-M` | **ZOHAMA** (B) | 90 |
| `LOAD` | CARREGAR | `RINIV` | `R-N-V` | **RONOVA** (B) | 87 |
| `SAVE` | SALVAR | `KIVE` | `K-V-G` | **KOVUGA** (B) | 90 |
| `REGISTER` | REGISTRAR | `MADA` | `M-D-T` | **MADETA** (B) | 85 |
| `OBSERVE` | OBSERVAR | `LAPAN` | `L-P-N` | **LEPANA** (B) | 85 |
| `EMIT` | EMITIR | `SIYU` | `S-Y-K` | **SUYUKA** (B) | 90 |
| `RETURN` | RETORNAR | `KIPE` | `K-P-T` | **KOPATA** (B) | 87 |
| `WORLD` | MUNDO | `MAVORA` | `M-V-R` | **MEVORU** (B) | 87 |
| `OBJECT` | OBJETO | `OKVAR` | `K-V-R` | **KIVIRU** (B) | 86 |
| `ENTITY` | ENTIDADE | `ENTAV` | `N-T-V` | **NITEVU** (B) | 87 |
| `CLASS` | CLASSE | `KELAN` | `K-L-N` | **KALONU** (B) | 87 |
| `TYPE` | TIPO | `NIZONI` | `N-Z-V` | **NOZEVU** (B) | 87 |

## Canon boundary

`AHNUVA / EMANU / HAYA / HODERU / KODAN` are excluded from regeneration.

```text
MORA-KODIN CANDIDATE
  != HNK WORD CANON
  != GLYPH CANON
```

Promotion requires lexical review, collision review, HNK-MATH/glifos gate and explicit Creator approval.

## Next production gate

Run family coherence + cross-candidate phonological confusion + semantic-family review over all 122 winners, then reduce to a Creator-review set without automatic canonization.
