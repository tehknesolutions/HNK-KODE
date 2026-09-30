export function lowerGoodleNodeToHnk(node) {
  const hnkSemanticId = node?.hnkSemanticId ?? null;

  if (!hnkSemanticId) {
    return {
      status: "UNMAPPED",
      sourceSemanticId: node?.semantica ?? null,
      diagnostics: ["GOODLE_SEMANTIC_NOT_IN_HNK_REGISTRY"]
    };
  }

  return {
    status: "MAPPED",
    semanticId: hnkSemanticId,
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
