const TYPES = new Set(["BOOL","NUMBER","STRING","SYMBOL","ENTITY","TYPE","LIST","MAP","RECORD","FUNCTION","EVENT","FLOW","TARGET","ARTIFACT","ANY"]);
const CATEGORIES = new Set(["ACTION","DATA","LOGIC","FLOW","FUNCTION","EVENT","ENTITY","IO","SECURITY","AI","DESIGN","MANIFEST","HNK"]);

function validateSocket(socket) {
  return Boolean(socket?.id && TYPES.has(socket.type));
}

export function validateBlock(block) {
  const diagnostics = [];
  if (block?.kind !== "HNKBlockV1") diagnostics.push("BLOCK_V1_KIND_INVALID");
  if (!block?.semanticId) diagnostics.push("BLOCK_V1_SEMANTIC_ID_REQUIRED");
  if (!CATEGORIES.has(block?.category)) diagnostics.push("BLOCK_V1_CATEGORY_INVALID");
  for (const socket of [...(block?.inputs ?? []), ...(block?.outputs ?? [])]) {
    if (!validateSocket(socket)) diagnostics.push(`BLOCK_V1_SOCKET_INVALID:${socket?.id ?? "?"}`);
  }
  return { valid: diagnostics.length === 0, diagnostics };
}

export function createBlock({ semanticId, category, inputs = [], outputs = [], children = [], scope = null, provenance = {} }) {
  const block = {
    kind: "HNKBlockV1",
    semanticId,
    category,
    inputs: structuredClone(inputs),
    outputs: structuredClone(outputs),
    children: structuredClone(children),
    connections: [],
    scope,
    provenance: { status: "PROJECTION", ...structuredClone(provenance) }
  };
  const check = validateBlock(block);
  if (!check.valid) throw new Error(check.diagnostics.join("|"));
  return block;
}

export function connectBlock(target, inputId, source, outputId) {
  const input = target.inputs.find(x => x.id === inputId);
  const output = source.outputs.find(x => x.id === outputId);
  if (!input || !output) throw new Error("BLOCK_V1_SOCKET_NOT_FOUND");
  if (input.type !== "ANY" && output.type !== "ANY" && input.type !== output.type) {
    throw new Error(`BLOCK_V1_TYPE_MISMATCH:${output.type}:${input.type}`);
  }
  return { ...target, connections: [...target.connections, { inputId, outputId, source: { semanticId: source.semanticId } }] };
}

export function blockToSemanticNode(block) {
  const check = validateBlock(block);
  if (!check.valid) throw new Error(check.diagnostics.join("|"));
  return {
    kind: "SemanticNode",
    semanticId: block.semanticId,
    category: block.category,
    inputs: structuredClone(block.inputs),
    outputs: structuredClone(block.outputs),
    children: structuredClone(block.children),
    connections: structuredClone(block.connections),
    scope: block.scope
  };
}

export function semanticNodeToBlock(node) {
  return createBlock({
    semanticId: node.semanticId,
    category: node.category,
    inputs: node.inputs,
    outputs: node.outputs,
    children: node.children,
    scope: node.scope
  });
}
