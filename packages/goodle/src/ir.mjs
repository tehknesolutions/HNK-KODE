export function createGoodleIRNode({ id, semanticId, family, parameters = {}, children = [], origin = null, metadata = {} }) {
  if (!id || !semanticId || !family) throw new Error("GOODLE_IR_REQUIRED");
  return {
    id,
    semantica: semanticId,
    familia: family,
    parametros: structuredClone(parameters),
    filhos: structuredClone(children),
    origem: origin ? structuredClone(origin) : undefined,
    metadados: structuredClone(metadata)
  };
}

export function createGoodleProgram(nodes = []) {
  return { versao: "1", nos: structuredClone(nodes) };
}
