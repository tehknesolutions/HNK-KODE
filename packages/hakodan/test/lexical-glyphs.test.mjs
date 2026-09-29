import test from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_HNK_LEXICAL_GLYPHS,
  resolveCanonicalHnkGlyph,
  canonicalGlyphCharacter,
  hasCanonicalHnkGlyph
} from "../src/lexical-glyphs.mjs";

test("canonical lexical glyph resolver exposes five creator-approved HNK lexemes", () => {
  assert.deepEqual(Object.keys(CANONICAL_HNK_LEXICAL_GLYPHS), ["AHNUVA","EMANU","HAYA","HODERU","KODAN"]);
});

test("resolver is case/space tolerant without inventing unknown bindings", () => {
  assert.equal(resolveCanonicalHnkGlyph("  ahnuva ").glyphId, "HNK-LG-0001");
  assert.equal(resolveCanonicalHnkGlyph("unknown"), null);
  assert.equal(hasCanonicalHnkGlyph("unknown"), false);
});

test("codepoint projection resolves to the frozen PUA character", () => {
  assert.equal(canonicalGlyphCharacter("KODAN").codePointAt(0), 0xE104);
  assert.equal(resolveCanonicalHnkGlyph("EMANU").codePoint, "U+E101");
});

test("mathematical identity remains available alongside render projection", () => {
  assert.equal(resolveCanonicalHnkGlyph("HAYA").mathId, "HMATH-N12-2887530BADEAC3A6374E");
});