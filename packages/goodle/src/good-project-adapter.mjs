/*
 * GoodProjeto → canonical haKodan adapter (M1)
 *
 * Source contract mirrors goodle-browser/src/nucleo/modelo/GoodProjeto.ts.
 * This adapter preserves creator-level fields and only lowers the subset
 * currently representable by the haKodan vertical slice.
 */

function assertProject(project) {
  if (!project || typeof project !== "object") throw new Error("GOODLE_PROJECT_REQUIRED");
  for (const key of ["id", "nome", "ambiente", "intencao", "componentes", "cenas", "regras"]) {
    if (!(key in project)) throw new Error("GOODLE_PROJECT_FIELD_REQUIRED:" + key);
  }
}

function provenance(project, sourcePath = "src/nucleo/modelo/GoodProjeto.ts") {
  return {
    sourceRepository: "tehknesolutions/goodle-browser",
    sourcePath,
    sourceProjectId: project.id,
    sourceProjectVersion: project.versao,
    sourceModel: "GoodProjeto",
    authorityStatus: "SOURCE",
    adapter: "HNK-KODE:M1"
  };
}

export function normalizeGoodProjeto(project) {
  assertProject(project);

  return {
    kind: "GoodProjetoNormalized",
    version: "1",
    creator: {
      id: project.id,
      name: project.nome,
      environment: project.ambiente,
      intent: structuredClone(project.intencao),
      metadata: structuredClone(project.metadados ?? {})
    },
    components: structuredClone(project.componentes ?? []),
    scenes: structuredClone(project.cenas ?? []),
    rules: structuredClone(project.regras ?? []),
    provenance: provenance(project)
  };
}

export function lowerGoodProjeto(project) {
  const normalized = normalizeGoodProjeto(project);
  const worldName = normalized.creator.name;
  const supportedEntityNames = new Set();
  const entities = [];

  for (const component of normalized.components) {
    if (component.tipo !== "jogo" && component.tipo !== "aplicacao" && component.tipo !== "sistema") {
      continue;
    }

    // Components are preserved as creator data. Only a stable named object can
    // enter the current haKodan EntityDeclaration vertical slice.
    const id = component.id;
    if (!id || supportedEntityNames.has(id)) continue;

    supportedEntityNames.add(id);
    entities.push({
      kind: "EntityDeclaration",
      name: id,
      properties: [
        { kind: "PropertyDeclaration", name: "nome", value: { kind: "StringLiteral", value: component.nome } },
        { kind: "PropertyDeclaration", name: "tipo", value: { kind: "StringLiteral", value: component.tipo } }
      ]
    });
  }

  const unresolved = [];

  if (normalized.scenes.length) {
    unresolved.push({
      concept: "cenas",
      reason: "HOM/AST vertical slice does not yet define scene declarations."
    });
  }

  if (normalized.rules.length) {
    unresolved.push({
      concept: "regras",
      reason: "Rule lowering requires the canonical event/condition model."
    });
  }

  for (const component of normalized.components) {
    if (component.configuracao && Object.keys(component.configuracao).length) {
      unresolved.push({
        concept: "componentes.configuracao",
        sourceId: component.id,
        reason: "Preserved in GoodProject; no lossless canonical target contract yet."
      });
    }
    if (component.componentesFilhos?.length) {
      unresolved.push({
        concept: "componentesFilhos",
        sourceId: component.id,
        reason: "Requires canonical HOM relation/component contract."
      });
    }
  }

  return {
    kind: "CanonicalAstCandidate",
    profile: "PT-BR",
    ast: {
      kind: "Program",
      body: [{
        kind: "WorldDeclaration",
        name: worldName,
        members: entities
      }]
    },
    preservedCreatorModel: normalized,
    diagnostics: {
      status: unresolved.length ? "PARTIAL" : "READY",
      unresolved
    }
  };
}
