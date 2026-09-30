const FAMILIES = new Set([
  "goodle", "phaser", "godot", "byond", "rpg-maker",
  "typescript", "react", "backend"
]);

const EQUIVALENCE = new Set(["direta", "aproximada", "contextual", "com_perda"]);

/*
 * Goodle keeps its historical/source semantic ID here.
 * hnkSemanticId is populated ONLY when an exact HNK-KODE registry ID exists.
 * This prevents migration from silently inventing canonical HNK semantics.
 */
const aliases = new Map([
  ["se", { id: "logica.condicao.se", hnkSemanticId: "IF", term: "se", equivalence: "direta" }],
  ["if", { id: "logica.condicao.se", hnkSemanticId: "IF", term: "se", equivalence: "direta" }],
  ["senão", { id: "logica.condicao.senao", hnkSemanticId: "ELSE", term: "senão", equivalence: "direta" }],
  ["senao", { id: "logica.condicao.senao", hnkSemanticId: "ELSE", term: "senão", equivalence: "direta" }],
  ["else", { id: "logica.condicao.senao", hnkSemanticId: "ELSE", term: "senão", equivalence: "direta" }],
  ["criar", { id: "entidade.criar", hnkSemanticId: null, term: "criar", equivalence: "direta" }],
  ["create", { id: "entidade.criar", hnkSemanticId: null, term: "criar", equivalence: "direta" }],
  ["entidade", { id: "estrutura.entidade", hnkSemanticId: "ENTITY", term: "entidade", equivalence: "direta" }],
  ["entity", { id: "estrutura.entidade", hnkSemanticId: "ENTITY", term: "entidade", equivalence: "direta" }],
  ["posição", { id: "espaco.posicao", hnkSemanticId: null, term: "posição", equivalence: "direta" }],
  ["posicao", { id: "espaco.posicao", hnkSemanticId: null, term: "posição", equivalence: "direta" }],
  ["position", { id: "espaco.posicao", hnkSemanticId: null, term: "posição", equivalence: "direta" }],
  ["movimento", { id: "espaco.movimento", hnkSemanticId: null, term: "movimento", equivalence: "direta" }],
  ["mover", { id: "espaco.movimento", hnkSemanticId: null, term: "movimento", equivalence: "direta" }],
  ["move", { id: "espaco.movimento", hnkSemanticId: null, term: "movimento", equivalence: "direta" }],
  ["definir", { id: "dados.valor.definir", hnkSemanticId: null, term: "definir", equivalence: "direta" }],
  ["set", { id: "dados.valor.definir", hnkSemanticId: null, term: "definir", equivalence: "direta" }],
  ["diminuir", { id: "dados.valor.diminuir", hnkSemanticId: null, term: "diminuir", equivalence: "direta" }],
  ["decrease", { id: "dados.valor.diminuir", hnkSemanticId: null, term: "diminuir", equivalence: "direta" }],
  ["quando", { id: "comportamento.reacao.quando", hnkSemanticId: "WHEN", term: "quando", equivalence: "direta" }],
  ["when", { id: "comportamento.reacao.quando", hnkSemanticId: "WHEN", term: "quando", equivalence: "direta" }],
  ["tocar", { id: "evento.toque", hnkSemanticId: null, term: "tocar", equivalence: "direta" }],
  ["toque", { id: "evento.toque", hnkSemanticId: null, term: "tocar", equivalence: "direta" }],
  ["touch", { id: "evento.toque", hnkSemanticId: null, term: "tocar", equivalence: "direta" }],
  ["evento", { id: "comportamento.evento", hnkSemanticId: "EVENT", term: "evento", equivalence: "direta" }],
  ["ação", { id: "comportamento.acao", hnkSemanticId: "ACTION", term: "ação", equivalence: "direta" }],
  ["acao", { id: "comportamento.acao", hnkSemanticId: "ACTION", term: "ação", equivalence: "direta" }],
  ["emitir", { id: "comportamento.emissao", hnkSemanticId: "EMIT", term: "emitir", equivalence: "direta" }],
  ["emit", { id: "comportamento.emissao", hnkSemanticId: "EMIT", term: "emitir", equivalence: "direta" }]
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
    hnkSemanticId: found.hnkSemanticId,
    surface: String(term),
    canonicalTerm: found.term,
    sourceFamily: family ?? "goodle",
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
    hnkSemanticId: metadata.hnkSemanticId ?? null,
    term,
    family,
    equivalence
  });
}
