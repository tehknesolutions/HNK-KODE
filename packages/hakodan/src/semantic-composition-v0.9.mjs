const CONTAINERS = new Set([
  "WORLD", "ENTITY", "AGENT", "COMPONENT", "SYSTEM", "SCENE",
  "FLOW", "DOCUMENT", "GAME", "APP", "IMAGE", "VIDEO", "PROMPT", "GDD", "PDD"
]);

export function composeSemanticNode(descriptor, children = []) {
  if (!descriptor?.kind || !descriptor?.name) throw new Error("HAKODAN_V09_INVALID_SCOPE_DESCRIPTOR");
  return {
    kind: descriptor.kind,
    name: descriptor.name,
    semanticId: `${descriptor.kind}.${descriptor.name}`,
    children: [...children]
  };
}

export function validateScopeTree(root) {
  const diagnostics = [];
  const seen = new Set();
  function visit(node) {
    if (seen.has(node)) {
      diagnostics.push(`HAKODAN_V09_SCOPE_CYCLE: ${node.semanticId}`);
      return;
    }
    seen.add(node);
    if (node.children.length && !CONTAINERS.has(node.kind)) {
      for (const child of node.children) diagnostics.push(`HAKODAN_V09_INVALID_PARENT: ${node.kind} cannot contain ${child.kind}`);
      return;
    }
    for (const child of node.children) visit(child);
  }
  visit(root);
  return { valid: diagnostics.length === 0, diagnostics };
}
