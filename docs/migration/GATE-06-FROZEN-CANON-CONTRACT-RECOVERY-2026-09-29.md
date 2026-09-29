# Gate 06 — Frozen Canon Contract Recovery

Date: 2026-09-29
Status: RECOVERED / SOURCE-LOCKED

## Frozen source

Repository: `tehknesolutions/codex-hnk`
Frozen commit:

`3027151d18176fd5ae46a04b2ac8ed8424bf68db`

## Result

The previously missing artifacts **do exist** in the frozen Gate 02 source. The prior Gate 05 conclusion that they could not be located is superseded by this direct frozen-tree audit.

Recovered exact artifacts:

| Artifact | Frozen blob SHA |
|---|---|
| `packages/canon-contract/package.json` | `e8e10a9c5dfa412d79dada90d6a84ebf16ef3743` |
| `packages/canon-contract/src/index.mjs` | `0ddc340df3c64e2a787dd95908adf956b5cc412a` |
| `packages/canon-contract/src/index.d.ts` | `60331d0d9660cea7dbf2562a9d412b10c264aa86` |
| `packages/canon-contract/tsconfig.json` | `b22baee063acc606c7f5186b0860f0ba52eb52e1` |
| `canon/core/research-001-symbolic-architecture-v1.json` | `a2f14cfe884076a5c242da59c966342e8de2c150` |
| `canon/governance/human-gates/research-001.json` | `bc264f64c86fccbf3b66fc8085e77bce245de72d` |
| `canon/governance/human-gates/research-001-batch-001-approval.json` | `3b3b7082dca607c23bcdaf725e06350da8658a28` |
| `packages/hnk-glyphs/src/canon.mjs` | `27e88a131f247e9649982e9183866b44797972bf` |
| `packages/hnk-glyphs/src/canon.d.ts` | `da89f861ce75cb7d13c0fa675dd0bff32ea63ec4` |
| `packages/hnk-glyphs/reference/HNK40_REFERENCE_MATRIX_V1.json` | `55e6b05f1f1c5e6df97cbc64f391dfd156bffac7` |
| `packages/hnk-glyphs/reference/README.md` | `0ed6afbe7f02c664d9d9ae94bba01d6784c7b5f8` |
| `packages/hnk-glyphs/test/reference-matrix.test.mjs` | `3855f64fcb1e4fc0f1fda2534820c7fc527eed75` |
| `packages/hnk-glyphs/package.json` | `76c5555b8b1ab3f2d77a811e41b0fb7eccb36bed` |

## Important finding

The recovery is not an inference and not a reconstruction.

The frozen source itself contains:
- `@hnk/canon-contract`;
- HNK canon manifest + Human Gate registry + batch approval;
- `@hnk/glyphs` canon adapter;
- HNK40 comparative reference matrix;
- matrix regression tests.

Therefore these artifacts are now classified as **SOURCE-LOCKED MIGRATION EVIDENCE**.

## Boundary preserved

The recovered canon contract explicitly validates:
- `HNK_CANON` status;
- `HNK_AUTHORED` authority;
- preserved source records;
- no historical-authority inheritance;
- no machine autopromotion;
- human approval;
- 22 promoted canon records.

The HNK40 matrix remains a comparative scaffold. Its reference-language cells remain `PENDING_RESEARCH`, and its symbolic/initiatic layer remains `PENDING_SEPARATE_GOVERNANCE`.

It explicitly states that phonetic similarity is not semantic equivalence and that ASCII/binary/hex are encoding layers rather than natural-language equivalents.

## Migration commits

The recovered files were restored to the HNK-KODE consolidation branch without semantic rewriting.

Target commits:
- canon-contract package/runtime/type/tsconfig: `906e95d1`, `8ca9073d`, `e7a0841`, `a244590`
- canon source records: `ead8d38`, `5b50794`, `30e1274`
- glyph canon adapter/type/reference/test: `77fb8ee`, `37978ab`, `d35ef71`, `e4630f7`, `50e50b7`
- glyph package contract: `03ff617`

## Next verification gate

Run/import the recovered contract in HNK-KODE and verify:
1. canon contract validation;
2. glyph canon snapshot;
3. HNK40 reference matrix parity;
4. matrix regression tests;
5. no semantic drift from frozen artifacts;
6. no reverse CODEX runtime dependency;
7. public package boundary.

Only after these pass should Gate 03 authority-independence status be reconsidered.
