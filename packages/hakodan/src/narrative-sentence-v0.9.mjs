const ALIASES = new Map([
  ["create", "ACTION.CREATE"], ["criar", "ACTION.CREATE"],
  ["criacao", "ACTION.CREATE"],
  ["class", "RELATION.CLASS"], ["classe", "RELATION.CLASS"]
]);

function fold(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function semantic(value) {
  return ALIASES.get(fold(value)) ?? null;
}

function words(source) {
  return source.match(/[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ0-9_-]*|[{}:]/gu) ?? [];
}

export function parseNarrativeSentence(source) {
  const tokens = words(source);
  if (semantic(tokens[0]) !== "ACTION.CREATE") throw new Error("HAKODAN_V09_EXPECTED_INTENT");
  const entityName = tokens[1];
  if (!entityName) throw new Error("HAKODAN_V09_EXPECTED_ENTITY");
  const classIndex = tokens.findIndex(token => semantic(token) === "RELATION.CLASS");
  const className = classIndex >= 0 ? tokens[classIndex + (tokens[classIndex + 1] === ":" ? 2 : 1)] : null;

  return {
    kind: "NarrativeSentence",
    intent: { semanticId: "INTENT.CREATE" },
    agent: { semanticId: "AGENT.SYSTEM" },
    action: { semanticId: "ACTION.CREATE" },
    entity: { semanticId: "ENTITY.REFERENCE", name: entityName },
    context: { semanticId: "CONTEXT.CURRENT" },
    manifestation: null,
    relations: className ? [{ semanticId: "RELATION.CLASS", value: className }] : [],
    provenance: { origin: "SOURCE", surface: "NARRATIVE" }
  };
}

export function normalizeSemanticSentence(node) {
  return {
    kind: node.kind,
    intent: node.intent,
    agent: node.agent,
    action: node.action,
    entity: node.entity,
    context: node.context,
    manifestation: node.manifestation,
    relations: node.relations
  };
}
