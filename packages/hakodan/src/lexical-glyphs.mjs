const REGISTRY = Object.freeze({
  AHNUVA: Object.freeze({ glyphId:"HNK-LG-0001", sigilId:"HNK-LS-0001", codePoint:"U+E100", scalar:0xE100, mathId:"HMATH-N12-E533006473117A1B6F91" }),
  EMANU: Object.freeze({ glyphId:"HNK-LG-0002", sigilId:"HNK-LS-0002", codePoint:"U+E101", scalar:0xE101, mathId:"HMATH-N12-45E7FA30BFB516CB279F" }),
  HAYA: Object.freeze({ glyphId:"HNK-LG-0003", sigilId:"HNK-LS-0003", codePoint:"U+E102", scalar:0xE102, mathId:"HMATH-N12-2887530BADEAC3A6374E" }),
  HODERU: Object.freeze({ glyphId:"HNK-LG-0004", sigilId:"HNK-LS-0004", codePoint:"U+E103", scalar:0xE103, mathId:"HMATH-N12-0431D17150B7E78A525F" }),
  KODAN: Object.freeze({ glyphId:"HNK-LG-0005", sigilId:"HNK-LS-0005", codePoint:"U+E104", scalar:0xE104, mathId:"HMATH-N12-83FAB36561ABF9BAB67A" })
});

export const CANONICAL_HNK_LEXICAL_GLYPHS = REGISTRY;

export function resolveCanonicalHnkGlyph(lexeme) {
  const key = String(lexeme ?? "").trim().toUpperCase();
  return REGISTRY[key] ?? null;
}

export function canonicalGlyphCharacter(lexeme) {
  const hit = resolveCanonicalHnkGlyph(lexeme);
  return hit ? String.fromCodePoint(hit.scalar) : null;
}

export function hasCanonicalHnkGlyph(lexeme) {
  return resolveCanonicalHnkGlyph(lexeme) !== null;
}
