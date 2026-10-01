# HNK40 Geometry Comparison Protocol V1

Status: `PROTOCOL_READY`
Parent: Issue #52 / Visual Canon V1
Depends on: `hnk40-source-lock-matrix-v1.md`

## Purpose

Define the deterministic gate for comparing recovered HNK40 structural paths against supplied visual-board glyphs without treating artwork as missing source evidence.

## Normative structural input

For every G01–G40, structural evidence MUST come from:

- `data/benchmarks/hnk40-e5-hybrid-projection.v1.json`
- `data/acquisition/hnk40-e5-acquisition.v1.json`
- referenced E4 source fingerprints and paths

The E5 derivation rule is `HNK40-E5-V4-DIRECTION-DISTANCE@1`.

## Comparison unit

A comparison record is:

```text
Gxx
+ legacy sourceFingerprint
+ legacyPath
+ E5 resolutionStatus
+ candidate projection path(s)
+ visual-board specimen reference
+ normalization transform
+ comparison result
```

No phoneme, meaning, sephirah, world, color or word mapping participates in geometric matching unless independently source-locked.

## Normalization

A visual specimen may be normalized only by transformations that preserve topology:

1. translation;
2. uniform scale;
3. rotation in explicitly declared increments;
4. reflection only when explicitly tested and recorded;
5. stroke-width removal;
6. ornament removal for CODEX/MAGNUM variants when the underlying skeleton is preserved.

Normalization MUST NOT add/delete vertices or change connectivity merely to force a match.

## Result classes

### MATCH
The visual skeleton is topologically equivalent to a recovered structural path under allowed normalization.

### TRANSFORM
The specimen is equivalent only after a declared identity-preserving transform (for example rotation/reflection/style projection). The transform must be stored.

### CONFLICT
The board claims the same Gxx identity, but its skeleton is structurally incompatible with recovered evidence.

### UNMAPPABLE
The specimen lacks enough geometric information, contains decorative ambiguity, or cannot be represented safely in the recovered path model.

### AMBIGUOUS_E5
Reserved for G17/G20 while multiple E5 candidate paths remain. A board specimen cannot select a preferred E5 candidate by itself.

## Identity invariants

```text
DIRECT = {G01, G11, G21, G31}
DERIVED_AMBIGUOUS = {G17, G20}
DERIVED_UNIQUE = remaining 34
```

For DIRECT/DERIVED_UNIQUE rows, compare against the recovered target/preferred E5 projection.

For G17/G20, compare against every preserved candidate and report the complete result vector. Never collapse ambiguity from visual similarity alone.

## Style invariant

For any glyph identity accepted later into the visual canon:

```text
identity(SIMPLE) == identity(CODEX) == identity(MAGNUM)
```

The three styles may differ in ornamentation and rendering complexity but must reduce to the same structural skeleton or to a versioned, explicitly approved identity-preserving transform.

## Machine-readable output target

Future comparison tooling should emit one record per specimen:

```json
{
  "glyphId": "G01",
  "sourceFingerprint": "sha256:...",
  "e5Resolution": "DIRECT",
  "projectionIds": ["G01-E5-..."],
  "specimenId": "board-...",
  "style": "SIMPLE|CODEX|MAGNUM|UNKNOWN",
  "normalization": [],
  "result": "MATCH|TRANSFORM|CONFLICT|UNMAPPABLE|AMBIGUOUS_E5",
  "confidence": "DETERMINISTIC|REVIEW_REQUIRED",
  "notes": []
}
```

## Promotion gate

A visual geometry can be promoted only when:

- its Gxx structural source is recovered;
- specimen provenance is recorded;
- normalization is explicit;
- result is MATCH or an explicitly approved TRANSFORM;
- G17/G20 ambiguity is not silently resolved;
- semantic/phonological claims remain independently gated.

## Execution sequence

```text
1. export E5 path coordinates
2. render normalized structural skeletons
3. register visual-board specimens
4. reduce specimens to comparable skeletons
5. compare topology + ordered path
6. emit result records
7. human/canonical review only for TRANSFORM, CONFLICT, UNMAPPABLE and G17/G20
8. promote accepted geometry into Visual Canon registry
```
