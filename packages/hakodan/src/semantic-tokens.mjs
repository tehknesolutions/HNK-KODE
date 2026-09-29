export const SEMANTIC_TOKENS = Object.freeze({
  WORLD: { "PT-BR": "mundo", EN: "world", HNK: null },
  ENTITY: { "PT-BR": "entidade", EN: "entity", HNK: null },
  PROPERTY: { "PT-BR": "propriedade", EN: "property", HNK: null },
  EVENT: { "PT-BR": "evento", EN: "event", HNK: null },
  ACTION: { "PT-BR": "ação", EN: "action", HNK: null },
  WHEN: { "PT-BR": "quando", EN: "when", HNK: null }
});

export const SUPPORTED_PROFILES = Object.freeze(["PT-BR", "EN"]);

export function keywordMap(profile) {
  if (profile === "HNK") {
    throw new Error("HAKODAN_HNK_PROFILE_LOCKED: programação HNK aguarda lexemas canônicos confirmados.");
  }
  if (!SUPPORTED_PROFILES.includes(profile)) {
    throw new Error(`HAKODAN_UNKNOWN_PROFILE: ${profile}`);
  }
  return new Map(Object.entries(SEMANTIC_TOKENS).map(([id, forms]) => [forms[profile], id]));
}
