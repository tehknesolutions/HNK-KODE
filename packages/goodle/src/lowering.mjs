const SUPPORTED = new Map([
  ["ACTION.CREATE", "ACTION.CREATE"],
  ["ENTITY", "ENTITY.REFERENCE"],
  ["EVENT.TOUCH", "EVENT.TOUCH"],
  ["EVENT.WHEN", "EVENT.WHEN"]
]);

export function lowerGoodleNodeToHnk(node) {
  const target = SUPPORTED.get(node?.semantica);
  if (!target) {
    return {
      status: "UNMAPPED",
      sourceSemanticId: node?.semantica ?? null,
      diagnostics: ["GOODLE_SEMANTIC_NOT_YET_MAPPED"]
    };
  }

  return {
    status: "MAPPED",
    semanticId: target,
    inputs: structuredClone(node.parametros ?? {}),
    children: (node.filhos ?? []).map(lowerGoodleNodeToHnk),
    provenance: {
      source: "goodle-browser",
      layer: "GOODLE",
      status: "MIGRATED"
    }
  };
}

export function lowerGoodleProgram(program) {
  return {
    kind: "GoodleToHnkLowering",
    sourceVersion: program?.versao ?? null,
    nodes: (program?.nos ?? []).map(lowerGoodleNodeToHnk)
  };
}
