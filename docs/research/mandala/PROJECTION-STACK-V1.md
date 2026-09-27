# HNK Mandala Projection Stack V1

Provenance: imported from `tehknesolutions/codex-hnk`, branch `research/hnk-kode-e5-render-distinct`.

## Canonical PixelMap

The major field atlas has **463 active logical pixels**:

- MF: 72×6 = 432
- GRP: 9
- Rose Mothers: 3
- Rose Doubles: 7
- Rose Simples: 12

Total: **463**.

At width 72, a compact raster transport requires 72×7 = 504 slots: 463 active + 41 reserved. Logical planes carry identity; packed image layout is transport/render representation.

## IsoPixel

Reversible integer lattice transform:

```text
u = x - y
v = x + y
x = (u+v)/2
y = (v-u)/2
```

Plane identity is carried separately. Perspective/cylindrical projections are render layers, not identity.

## Voxel

Voxel identity retains typed source coordinates. MF naturally maps to six stacked 72-sector rings. Floating-point coordinates do not replace the typed address.

## Binary factor

Because `72 = 9×8`, each sector decomposes exactly into:

```text
group0 ∈ 0..8
slot0 ∈ 0..7
```

The 3-bit slot is compatible with a trigram-sized binary space. Traditional I-Ching names/meanings are not assumed without an explicit sourced permutation layer.

## Glyph packet

A HNK glyph is not fundamentally an image. It is a versioned ordered PATH over typed Mandala addresses. Pixel, IsoPixel, cylindrical Mandala art, Voxel and QR are projections/transports of the same path.
