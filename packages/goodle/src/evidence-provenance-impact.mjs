function indexGraph(nodes = []) {
  const index = new Map();
  for (const node of nodes) {
    if (!node?.id || index.has(node.id)) return null;
    index.set(node.id, { id: node.id, parents: [...(node.parents ?? [])] });
  }
  return index;
}

function descendants(index, roots) {
  const result = new Set();
  const queue = [...roots];
  while (queue.length) {
    const source = queue.shift();
    for (const node of index.values()) {
      if (node.parents.includes(source) && !result.has(node.id)) { result.add(node.id); queue.push(node.id); }
    }
  }
  return [...result].sort();
}

export function analyzeProvenanceImpact(left = [], right = [], diff = {}) {
  const L = indexGraph(left); const R = indexGraph(right);
  if (!L || !R || !diff || !diff.direct || !diff.ancestors) return Object.freeze({ status:'REJECTED', reason:'INVALID_INPUT' });
  const changedRoots = [...(diff.direct.added ?? []), ...(diff.direct.removed ?? []), ...(diff.ancestors.added ?? []), ...(diff.ancestors.removed ?? [])];
  const direct = new Set();
  for (const id of changedRoots) {
    for (const node of R.values()) if (node.parents.includes(id)) direct.add(node.id);
    for (const node of L.values()) if (node.parents.includes(id)) direct.add(node.id);
  }
  const transitiveRight = descendants(R, changedRoots);
  const transitiveLeft = descendants(L, changedRoots);
  const transitive = [...new Set([...transitiveRight, ...transitiveLeft])].sort();
  return Object.freeze({ status:'ANALYZED', impact:Object.freeze({ changedSources:Object.freeze([...new Set(changedRoots)].sort()), directChildren:Object.freeze([...direct].sort()), transitiveDescendants:Object.freeze(transitive), orderingChanged:!!diff.direct.orderingChanged }) });
}