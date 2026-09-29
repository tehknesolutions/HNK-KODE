# HNK Repository Synchronization Manifest — 2026-09-29

**Purpose:** prove that the haKodan/HNK-KODE project snapshot defined in the HNK CODEX project/chat is persisted across every active repository in the Tehkne Solutions organization whose name contains HNK.

## Source-of-truth snapshot

| Repository | Commit | Role |
|---|---|---|
| `tehknesolutions/HNK-KODE` | `981736063e8beda43dd079cd63953ec02db6f59b` | full language/framework snapshot + datasets |
| `tehknesolutions/codex-hnk` | `fcf20242b270d871f1222d91d91eab0530ad6b2e` | structural/canonical pin |
| `tehknesolutions/SIGILKODE-HNK` | `fb67be425c860bc6ecf5f4fff614c9a7e9ec0a9c` | renderer/manifestation consumer pin |
| `tehknesolutions/HNK-VERSE` | `2ea6dcce9c66356f99d06d56a7bf1b1b0b3ce82b` | world/experience consumer pin |
| `tehknesolutions/simpleway-hnk` | `17dc24218ed5406ca93fd7232884e885b496d015` | SimpleWay consumer pin |
| `tehknesolutions/cubo-hnk` | `ab0e45dad4bb9b7fb13b7a002b88160d70c67e42` | protocol/QA consumer pin |

## Persistent source rule

`HNK-KODE` is the complete source of truth for language + haKodan definitions. Other HNK repositories pin an exact source commit and keep only the contracts required by their authority boundary.

The source snapshot persists:
- project architecture and authority map;
- HNK/PT-BR/EN surface rules and mixed VHK source;
- PT-BR with/without diacritics;
- Visual ↔ Textual VHK contract;
- 127-Kodin working registry;
- triple lexical discovery dataset;
- lexical shortlist dataset;
- Mora-Kodin discovery direction;
- HNK-MATH/Mandala lexeme↔glyph policy;
- first five canonical HNK lexical glyphs;
- high-intensity glyph production gates;
- universal target ladder through IR/bytecode/native machine targets;
- v1.7.x history and experimental-prototype caveats.

## Future rule

An approved project decision must not remain chat-only. It should be committed to the authoritative HNK repository during the same execution cycle, followed by consumer pins when cross-repository behavior is affected.
