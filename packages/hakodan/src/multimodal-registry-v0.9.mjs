function fold(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function registerProjection(registry, entry) {
  if (!entry?.semanticId) throw new Error("HAKODAN_V09_SEMANTIC_ID_REQUIRED");
  return { ...registry, [entry.semanticId]: structuredClone(entry) };
}

export function resolveProjection(registry, query) {
  const entries = Object.values(registry);
  if (query.surface === "text") {
    const needle = fold(query.value);
    return entries.find(entry => Object.values(entry.text ?? {}).flat().some(alias => fold(alias) === needle)) ?? null;
  }
  if (query.surface === "block") {
    return registry[query.value] ?? null;
  }
  if (query.surface === "glyph") {
    return entries.find(entry => entry.glyph?.glyphId === query.value) ?? null;
  }
  return null;
}

export function roundTripProjection(registry, input, targetSurface) {
  const entry = resolveProjection(registry, input);
  if (!entry) return null;
  const projection = targetSurface === "block"
    ? entry.block
    : targetSurface === "glyph"
      ? entry.glyph
      : targetSurface === "text"
        ? entry.text
        : null;
  if (!projection) throw new Error(`HAKODAN_V09_UNKNOWN_PROJECTION_SURFACE: ${targetSurface}`);
  return { semanticId: entry.semanticId, projection: structuredClone(projection) };
}
