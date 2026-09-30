const TYPES = new Set(["BOOL","NUMBER","STRING","ENTITY","TYPE","LIST","MAP","RECORD","FUNCTION","EVENT","FLOW","TARGET","ARTIFACT","ANY"]);
const OPS = new Set(["EQ","NEQ","LT","GT","LTE","GTE"]);
const BOOL_OPS = new Set(["AND","OR","NOT"]);
const FLOW = new Set(["IF","FOR","EACH","WHILE","THEN","ELSE","RETURN"]);
function typeOf(value) { return value?.type ?? "ANY"; }
function assertType(type) { if (!TYPES.has(type)) throw new Error(`LOGIC_V1_TYPE_INVALID:${type}`); }

export function createLogicBlock(kind, options = {}) {
  if (!FLOW.has(kind) && kind !== "COMPARE" && !BOOL_OPS.has(kind)) throw new Error(`LOGIC_V1_KIND_INVALID:${kind}`);
  if (kind === "IF") {
    if (!options.condition) throw new Error("LOGIC_V1_CONDITION_REQUIRED");
    assertType(typeOf(options.condition));
    if (!["BOOL", "ANY"].includes(typeOf(options.condition))) throw new Error("LOGIC_V1_CONDITION_BOOL_REQUIRED");
    return { kind: "HNKLogicBlockV1", semanticId: "LOGIC.IF", category: "LOGIC", inputs: { condition: structuredClone(options.condition) }, branches: { then: [], else: [] } };
  }
  if (kind === "COMPARE") {
    if (!OPS.has(options.operator)) throw new Error(`LOGIC_V1_OPERATOR_INVALID:${options.operator}`);
    assertType(typeOf(options.left)); assertType(typeOf(options.right));
    if (typeOf(options.left) !== typeOf(options.right) && typeOf(options.left) !== "ANY" && typeOf(options.right) !== "ANY") throw new Error("LOGIC_V1_COMPARE_TYPE_MISMATCH");
    return { kind: "HNKLogicBlockV1", semanticId: `LOGIC.COMPARE.${options.operator}`, category: "LOGIC", inputs: { left: structuredClone(options.left), right: structuredClone(options.right) }, operator: options.operator, outputs: { result: { type: "BOOL" } } };
  }
  if (BOOL_OPS.has(kind)) {
    const arity = kind === "NOT" ? 1 : 2, operands = options.operands ?? [];
    if (operands.length !== arity) throw new Error(`LOGIC_V1_ARITY:${kind}`);
    operands.forEach(x => { assertType(typeOf(x)); if (!["BOOL","ANY"].includes(typeOf(x))) throw new Error("LOGIC_V1_BOOL_REQUIRED"); });
    return { kind: "HNKLogicBlockV1", semanticId: `LOGIC.${kind}`, category: "LOGIC", inputs: { operands: structuredClone(operands) }, outputs: { result: { type: "BOOL" } } };
  }
  return { kind: "HNKFlowBlockV1", semanticId: `FLOW.${kind}`, category: "FLOW", inputs: {}, body: [] };
}

export function createFunctionBlock({ name, parameters = [], returnType = "ANY" }) {
  if (!name) throw new Error("FUNCTION_V1_NAME_REQUIRED");
  assertType(returnType);
  for (const p of parameters) { if (!p?.name) throw new Error("FUNCTION_V1_PARAMETER_NAME_REQUIRED"); assertType(p.type); }
  return { kind: "HNKFunctionBlockV1", semanticId: `FUNCTION.${name}`, category: "FUNCTION", inputs: { parameters: structuredClone(parameters) }, outputs: { return: { type: returnType } }, body: [] };
}

export function appendFlowBlock(parent, child) {
  if (!parent?.body || !child?.kind) throw new Error("LOGIC_V1_FLOW_APPEND_INVALID");
  const normalized = child.kind === "RETURN"
    ? { kind: "HNKFlowBlockV1", semanticId: "FLOW.RETURN", category: "FLOW", inputs: { value: structuredClone(child.value ?? { type: "ANY" }) }, body: [] }
    : structuredClone(child);
  return { ...parent, body: [...parent.body, normalized] };
}

export function validateLogicFunctionGraph(root) {
  const diagnostics = [], active = new Set();
  function visit(node, returnType = null) {
    if (!node || typeof node !== "object") return;
    if (active.has(node)) { diagnostics.push("LOGIC_V1_CYCLE"); return; }
    active.add(node);
    if (node.kind === "HNKFunctionBlockV1") returnType = node.outputs?.return?.type ?? "ANY";
    if (node.kind === "HNKFlowBlockV1" && node.semanticId === "FLOW.RETURN" && node.inputs?.value) {
      const actual = node.inputs.value.type ?? "ANY";
      if (returnType && returnType !== "ANY" && actual !== "ANY" && actual !== returnType) diagnostics.push(`LOGIC_V1_RETURN_TYPE_MISMATCH:${actual}:${returnType}`);
    }
    for (const child of [...(node.body ?? []), ...(node.branches?.then ?? []), ...(node.branches?.else ?? [])]) visit(child, returnType);
    active.delete(node);
  }
  visit(root);
  return { valid: diagnostics.length === 0, diagnostics };
}
