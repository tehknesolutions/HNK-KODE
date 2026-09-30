const REGISTRY = Object.freeze({
  mundo: "WORLD",
  world: "WORLD",
  entidade: "ENTITY",
  entity: "ENTITY",
  propriedade: "PROPERTY",
  property: "PROPERTY",
  evento: "EVENT",
  event: "EVENT",
  ação: "ACTION",
  acao: "ACTION",
  action: "ACTION",
  quando: "WHEN",
  when: "WHEN",
  se: "IF",
  if: "IF",
  senão: "ELSE",
  senao: "ELSE",
  else: "ELSE",
  retornar: "RETURN",
  return: "RETURN",
  emitir: "EMIT",
  emit: "EMIT",
  observar: "OBSERVE",
  observe: "OBSERVE",
  cenário: "SCENE",
  cenario: "SCENE",
  scene: "SCENE",
  intenção: "INTENT",
  intencao: "INTENT",
  intent: "INTENT",
  manifestar: "MANIFEST",
  manifest: "MANIFEST"
});

function fold(value) {
  return String(value).trim().toLocaleLowerCase("pt-BR");
}

export function classifyGoodleSemantic(term) {
  const sourceTerm = String(term);
  const semanticId = REGISTRY[fold(sourceTerm)] ?? null;
  return semanticId
    ? { status: "MAPPED", semanticId, sourceTerm }
    : { status: "UNMAPPED", semanticId: null, sourceTerm };
}

export function normalizeGoodleData(data) {
  if (!data?.id || !data?.nome || !data?.tipo) throw new Error("GOODLE_DATA_IDENTITY_REQUIRED");
  return {
    kind: "GoodleDataNormalized",
    id: data.id,
    name: data.nome,
    sourceType: data.tipo,
    persistent: Boolean(data.persistente),
    initialValue: structuredClone(data.valorInicial),
    storage: {
      status: "UNRESOLVED",
      reason: "haKodan canonical storage/persistence contract not yet reconciled"
    },
    provenance: {
      sourceRepository: "tehknesolutions/goodle-browser",
      sourcePath: "src/nucleo/modelo/SintaxeGoodle.ts",
      sourceModel: "DadoGoodle",
      adapter: "HNK-KODE:M3"
    }
  };
}

export function lowerGoodleCondition(expression) {
  if (!expression || expression.tipo !== "condicao") throw new Error("GOODLE_CONDITION_REQUIRED");
  const classification = classifyGoodleSemantic(expression.nome);
  return {
    kind: "GoodleConditionLowering",
    status: "UNRESOLVED",
    sourceCondition: expression.nome,
    semanticId: classification.status === "MAPPED" ? classification.semanticId : null,
    parameters: structuredClone(expression.parametros ?? {}),
    diagnostics: [{
      code: "GOODLE_CONDITION_OPERATOR_NOT_CANONICAL",
      message: "IF/ELSE are registry concepts, but the source condition operator requires an explicit canonical operator contract."
    }],
    provenance: {
      sourceRepository: "tehknesolutions/goodle-browser",
      sourcePath: "src/nucleo/modelo/SintaxeGoodle.ts",
      sourceModel: "ExpressaoGoodle",
      adapter: "HNK-KODE:M3"
    }
  };
}
