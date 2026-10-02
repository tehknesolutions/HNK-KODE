function normalizeNode(node = {}) {
  return { id: node.id ?? null, parents: Array.isArray(node.parents) ? [...node.parents].sort() : [] };
}

function indexGraph(nodes = []) {
  const index = new Map();
  for (const raw of nodes) {
    const node = normalizeNode(raw);
    if (!node.id || index.has(node.id)) return { status:'REJECTED', reason:'AMBIGUOUS_GRAPH' };
    index.set(node.id, node);
  }
  return { status:'READY', index };
}

export function traverseProvenance(graph = [], rootId = '') {
  const indexed = indexGraph(graph);
  if (indexed.status !== 'READY') return Object.freeze({ status:'REJECTED', directParents:[], ancestors:[], reason:indexed.reason });
  if (!indexed.index.has(rootId)) return Object.freeze({ status:'REJECTED', directParents:[], ancestors:[], reason:'ROOT_NOT_FOUND' });
  const root = indexed.index.get(rootId);
  const directParents = [...root.parents].sort();
  for (const parent of directParents) if (!indexed.index.has(parent)) return Object.freeze({ status:'REJECTED', directParents:[], ancestors:[], reason:'MISSING_REFERENCE' });
  const ancestors = []; const visited = new Set([rootId]); const active = new Set([rootId]);
  function visit(id) {
    if (active.has(id) && id !== rootId) throw new Error('CYCLE');
    if (visited.has(id) && id !== rootId) return;
    const node = indexed.index.get(id);
    if (!node) throw new Error('MISSING');
    visited.add(id); active.add(id);
    for (const parent of node.parents) {
      if (active.has(parent)) throw new Error('CYCLE');
      if (!indexed.index.has(parent)) throw new Error('MISSING');
      if (!ancestors.includes(parent)) ancestors.push(parent);
      visit(parent);
    }
    active.delete(id);
  }
  try { for (const parent of directParents) visit(parent); } catch (error) { return Object.freeze({ status:'REJECTED', directParents:[], ancestors:[], reason:error.message === 'CYCLE' ? 'CYCLE_DETECTED' : 'MISSING_REFERENCE' }); }
  return Object.freeze({ status:'TRAVERSED', directParents:Object.freeze(directParents), ancestors:Object.freeze(ancestors) });
}