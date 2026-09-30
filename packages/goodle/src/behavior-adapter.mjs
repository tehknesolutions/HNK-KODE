function clone(value) {
  return structuredClone(value);
}

function sourceProvenance() {
  return {
    sourceRepository: "tehknesolutions/goodle-browser",
    sourcePath: "src/nucleo/modelo/SintaxeGoodle.ts",
    sourceModel: "DefinicaoGoodle",
    authorityStatus: "SOURCE",
    adapter: "HNK-KODE:M2"
  };
}

function normalizeExpression(expression) {
  if (!expression) return null;
  return {
    type: expression.tipo,
    name: expression.nome,
    parameters: clone(expression.parametros ?? {}),
    children: (expression.filhos ?? []).map(normalizeExpression),
    else: (expression.senao ?? []).map(normalizeExpression)
  };
}

export function normalizeGoodleDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("GOODLE_DEFINITION_REQUIRED");
  return {
    kind: "GoodleBehaviorDefinitionNormalized",
    version: "1",
    components: clone(definition.componentes ?? []),
    flows: (definition.fluxos ?? []).map(flow => ({
      id: flow.id,
      name: flow.nome,
      when: normalizeExpression(flow.quando),
      execute: (flow.executar ?? []).map(normalizeExpression)
    })),
    data: (definition.dados ?? []).map(item => ({
      id: item.id,
      name: item.nome,
      type: item.tipo,
      persistent: item.persistente,
      initialValue: clone(item.valorInicial)
    })),
    rules: (definition.regras ?? []).map(rule => ({
      id: rule.id,
      name: rule.nome,
      when: normalizeExpression(rule.quando),
      allow: rule.permitir
    })),
    provenance: sourceProvenance()
  };
}

function scanUnresolved(expression, diagnostics, path) {
  if (!expression) return;
  if (expression.tipo === "condicao") {
    diagnostics.push({ code: "GOODLE_CONDITION_NOT_CANONICAL", path, sourceName: expression.nome });
  }
  if (expression.senao?.length) {
    diagnostics.push({ code: "GOODLE_ELSE_NOT_CANONICAL", path: `${path}.senao`, sourceName: expression.nome });
  }
  expression.filhos?.forEach((child, index) => scanUnresolved(child, diagnostics, `${path}.filhos[${index}]`));
  expression.senao?.forEach((child, index) => scanUnresolved(child, diagnostics, `${path}.senao[${index}]`));
}

export function lowerGoodleFlow(flow, { worldId } = {}) {
  if (!flow?.id || !flow?.nome) throw new Error("GOODLE_FLOW_IDENTITY_REQUIRED");
  if (!worldId) throw new Error("GOODLE_WORLD_ID_REQUIRED");

  const diagnostics = [];
  scanUnresolved(flow.quando, diagnostics, "quando");
  (flow.executar ?? []).forEach((expression, index) => scanUnresolved(expression, diagnostics, `executar[${index}]`));

  if (!flow.quando || flow.quando.tipo !== "evento") {
    if (!diagnostics.some(item => item.code === "GOODLE_CONDITION_NOT_CANONICAL")) {
      diagnostics.push({ code: "GOODLE_EVENT_TRIGGER_REQUIRED", path: "quando" });
    }
  }

  const actions = [];
  for (const [index, expression] of (flow.executar ?? []).entries()) {
    if (expression.tipo !== "acao") {
      diagnostics.push({ code: "GOODLE_EXECUTION_NODE_NOT_ACTION", path: `executar[${index}]`, sourceType: expression.tipo });
      continue;
    }
    actions.push({
      kind: "ActionDescriptorCandidate",
      id: `${worldId}/event/${flow.id}/action/${index}-${expression.nome}`,
      name: expression.nome,
      arguments: Object.entries(expression.parametros ?? {}).map(([name, value]) => ({ name, value })),
      provenance: { ...sourceProvenance(), sourceFlowId: flow.id, sourceExpressionType: expression.tipo }
    });
  }

  if (diagnostics.length) {
    return {
      kind: "GoodleBehaviorLowering",
      status: "UNRESOLVED",
      sourceFlow: clone(flow),
      diagnostics,
      provenance: { ...sourceProvenance(), sourceFlowId: flow.id }
    };
  }

  return {
    kind: "GoodleBehaviorLowering",
    status: "MAPPED",
    event: {
      kind: "EventDescriptorCandidate",
      id: `${worldId}/event/${flow.id}`,
      name: flow.quando.nome,
      payload: clone(flow.quando.parametros ?? {}),
      actions,
      provenance: { ...sourceProvenance(), sourceFlowId: flow.id, sourceExpressionType: "evento" }
    },
    diagnostics: [],
    provenance: { ...sourceProvenance(), sourceFlowId: flow.id }
  };
}
