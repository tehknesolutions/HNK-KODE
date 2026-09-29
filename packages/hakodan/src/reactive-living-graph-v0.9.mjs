export function createReactiveGraph() {
  return { edges: [] };
}

export function registerDependency(graph, from, to, metadata = {}) {
  return { ...graph, edges: [...graph.edges, { from, to, ...metadata }] };
}

function outgoing(graph, node) {
  return graph.edges.filter(edge => edge.from === node);
}

export function planImpact(graph, source, options = {}) {
  const approved = new Set(options.approvedPolicies ?? []);
  const nodes = [], pending = [], diagnostics = [];
  const active = new Set();

  function visit(node) {
    if (active.has(node)) {
      diagnostics.push(`HAKODAN_V09_REACTIVE_CYCLE: ${[...active, node].join(" -> ")}`);
      return;
    }
    active.add(node);
    for (const edge of outgoing(graph, node)) {
      if (edge.policy && !approved.has(edge.policy)) { pending.push(edge.to); continue; }
      if (!nodes.includes(edge.to) && edge.to !== source) nodes.push(edge.to);
      visit(edge.to);
    }
    active.delete(node);
  }
  visit(source);
  return { valid: diagnostics.length === 0, nodes, pending, diagnostics };
}

export function traceCause(graph, source, target) {
  const queue = [[source]];
  const visited = new Set();
  while (queue.length) {
    const path = queue.shift();
    const node = path.at(-1);
    if (node === target) return path;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const edge of outgoing(graph, node)) queue.push([...path, edge.to]);
  }
  return [];
}
