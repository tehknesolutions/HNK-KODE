const FAMILIES = new Set([
  "goodle", "phaser", "godot", "byond", "rpg-maker",
  "typescript", "react", "backend"
]);

const EQUIVALENCE = new Set([
  "direta", "aproximada", "contextual", "com_perda"
]);

const aliases = new Map([
  ["se", { id: "LOGIC.IF", term: "se", family: "goodle", equivalence: "direta" }],
  ["if", { id: "LOGIC.IF", term: "se", family: "goodle", equivalence: "direta" }],
  ["senão", { id: "LOGIC.ELSE", term: "senão", family: "goodle", equivalence: "direta" }],
  ["senao", { id: "LOGIC.ELSE", term: "senão", family: "goodle", equivalence: "direta" }],
  ["else", { id: "LOGIC.ELSE", term: "senão", family: "goodle", equivalence: "direta" }],
  ["repetir", { id: "LOGIC.LOOP", term: "repetir", family: "goodle", equivalence: "direta" }],
  ["loop", { id: "LOGIC.LOOP", term: "repetir", family: "goodle", equivalence: "direta" }],
  ["criar", { id: "ACTION.CREATE", term: "criar", family: "goodle", equivalence: "direta" }],
  ["create", { id: "ACTION.CREATE", term: "criar", family: "goodle", equivalence: "direta" }],
  ["entidade", { id: "ENTITY", term: "entidade", family: "goodle", equivalence: "direta" }],
  ["entity", { id: "ENTITY", term: "entidade", family: "goodle", equivalence: "direta" }],
  ["posição", { id: "SPACE.POSITION", term: "posição", family: "goodle", equivalence: "direta" }],
  ["posicao", { id: "SPACE.POSITION", term: "posição", family: "goodle", equivalence: "direta" }],
  ["position", { id: "SPACE.POSITION", term: "posição", family: "goodle", equivalence: "direta" }],
  ["movimento", { id: "SPACE.MOVE", term: "movimento", family: "goodle", equivalence: "direta" }],
  ["mover", { id: "SPACE.MOVE", term: "movimento", family: "goodle", equivalence: "direta" }],
  ["move", { id: "SPACE.MOVE", term: "movimento", family: "goodle", equivalence: "direta" }],
  ["definir", { id: "DATA.SET", term: "definir", family: "goodle", equivalence: "direta" }],
  ["set", { id: "DATA.SET", term: "definir", family: "goodle", equivalence: "direta" }],
  ["diminuir", { id: "DATA.DECREASE", term: "diminuir", family: "goodle", equivalence: "direta" }],
  ["decrease", { id: "DATA.DECREASE", term: "diminuir", family: "goodle", equivalence: "direta" }],
  ["quando", { id: "EVENT.WHEN", term: "quando", family: "goodle", equivalence: "direta" }],
  ["when", { id: "EVENT.WHEN", term: "quando", family: "goodle", equivalence: "direta" }],
  ["tocar", { id: "EVENT.TOUCH", term: "tocar", family: "goodle", equivalence: "direta" }],
  ["toque", { id: "EVENT.TOUCH", term: "tocar", family: "goodle", equivalence: "direta" }],
  ["touch", { id: "EVENT.TOUCH", term: "tocar", family: "goodle", equivalence: "direta" }],
  ["evento", { id: "EVENT", term: "evento", family: "goodle", equivalence: "direta" }],
  ["ação", { id: "ACTION", term: "ação", family: "goodle", equivalence: "direta" }],
  ["acao", { id: "ACTION", term: "ação", family: "goodle", equivalence: "direta" }],
  ["emitir", { id: "EVENT.EMIT", term: "emitir", family: "goodle", equivalence: "direta" }],
  ["emit", { id: "EVENT.EMIT", term: "emitir", family: "goodle", equivalence: "direta" }]
]);

function fold(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export function resolveGoodleSemantic(term, { family } = {}) {
  const found = aliases.get(fold(term));
  if (!found) return undefined;
  if (family && !FAMILIES.has(family)) throw new Error("GOODLE_UNKNOWN_SOURCE_FAMILY");
  return {
    semanticId: found.id,
    surface: String(term),
    canonicalTerm: found.term,
    sourceFamily: family ?? found.family,
    equivalence: found.equivalence,
    provenance: { source: "goodle-browser", status: "MIGRATED", surface: "GOODLE" }
  };
}

export function registerGoodleAlias(term, semanticId, metadata = {}) {
  if (!term || !semanticId) throw new Error("GOODLE_ALIAS_REQUIRED");
  const equivalence = metadata.equivalence ?? "contextual";
  if (!EQUIVALENCE.has(equivalence)) throw new Error("GOODLE_EQUIVALENCE_INVALID");
  const family = metadata.family ?? "goodle";
  if (!FAMILIES.has(family)) throw new Error("GOODLE_UNKNOWN_SOURCE_FAMILY");
  aliases.set(fold(term), {
    id: semanticId,
    term,
    family,
    equivalence
  });
}
