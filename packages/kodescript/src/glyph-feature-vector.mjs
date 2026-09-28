// HNK-KODESCRIPT GlyphFeatureVector N12 extractor
// Structural analysis only: this module assigns no linguistic, sacred, or executable meaning.

const ADDRESS = {
  MF: /^MF:L(0[1-6]):S(0[1-9]|[1-6][0-9]|7[0-2])$/,
  CG: /^CG:(0[1-9])$/,
  CR_D: /^CR:D:(0[1-9]|1[0-2])$/,
};

export function parseAddress(id) {
  let m = ADDRESS.MF.exec(id);
  if (m) return { id, namespace: 'MF', layer: Number(m[1]), sector: Number(m[2]) };
  m = ADDRESS.CG.exec(id);
  if (m) return { id, namespace: 'CG', group: Number(m[1]) };
  m = ADDRESS.CR_D.exec(id);
  if (m) return { id, namespace: 'CR_D', index: Number(m[1]) };
  throw new Error(`GFV-N12 unsupported address: ${id}`);
}

function circularStep(a, b, modulo) {
  const forward = (b - a + modulo) % modulo;
  const backward = (a - b + modulo) % modulo;
  if (forward === 1) return +1;
  if (backward === 1) return -1;
  return null;
}

function choirForSector(sector) {
  return Math.floor((sector - 1) / 8) + 1;
}

export function classifyEdge(a0, b0) {
  const a = typeof a0 === 'string' ? parseAddress(a0) : a0;
  const b = typeof b0 === 'string' ? parseAddress(b0) : b0;

  if (a.namespace === 'MF' && b.namespace === 'MF') {
    if (a.layer === b.layer && circularStep(a.sector, b.sector, 72) !== null) return 'MF_ANGULAR';
    if (a.sector === b.sector && Math.abs(a.layer - b.layer) === 1) return 'MF_RADIAL';
  }

  if (a.namespace === 'MF' && b.namespace === 'CG') {
    if (a.layer === 6 && choirForSector(a.sector) === b.group) return 'MF_CG';
  }
  if (a.namespace === 'CG' && b.namespace === 'MF') return classifyEdge(b, a);

  if (a.namespace === 'CG' && b.namespace === 'CG' && circularStep(a.group, b.group, 9) !== null) return 'CG_CG';
  if (a.namespace === 'CR_D' && b.namespace === 'CR_D' && circularStep(a.index, b.index, 12) !== null) return 'CR_D_CYCLE';

  throw new Error(`GFV-N12 illegal frozen edge: ${a.id} -> ${b.id}`);
}

function countBy(values, keys) {
  const out = Object.fromEntries(keys.map(k => [k, 0]));
  for (const value of values) out[value] = (out[value] ?? 0) + 1;
  return out;
}

function circularSpan(sectors, modulo = 72) {
  const unique = [...new Set(sectors)].sort((a,b) => a-b);
  if (unique.length < 2) return unique.length ? 0 : null;
  let maxGap = 0;
  for (let i=0; i<unique.length; i++) {
    const a = unique[i];
    const b = i === unique.length - 1 ? unique[0] + modulo : unique[i+1];
    maxGap = Math.max(maxGap, b-a);
  }
  return modulo - maxGap;
}

function transitionCounts(edges) {
  const out = {};
  for (let i=0; i<edges.length-1; i++) {
    const key = `${edges[i]}->${edges[i+1]}`;
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

export function extractGlyphFeatureVector({ identityId, path, canonicalRepresentativeId = identityId }) {
  if (!Array.isArray(path) || path.length !== 12) throw new Error('GFV-N12 requires exactly 12 addresses');
  if (new Set(path).size !== 12) throw new Error('GFV-N12 corpus requires a simple path with 12 distinct addresses');

  const nodes = path.map(parseAddress);
  const components = new Set(nodes.map(n => n.namespace === 'CR_D' ? 'CR_D' : 'MF_CG'));
  if (components.size !== 1) throw new Error('GFV-N12 cannot cross frozen connected components');
  const component = [...components][0];

  const edges = [];
  for (let i=0; i<11; i++) edges.push(classifyEdge(nodes[i], nodes[i+1]));

  const namespaces = nodes.map(n => n.namespace);
  const mfNodes = nodes.filter(n => n.namespace === 'MF');
  const layers = mfNodes.map(n => n.layer);
  const sectors = mfNodes.map(n => n.sector);

  let outwardSteps = 0, inwardSteps = 0, clockwiseSteps = 0, counterclockwiseSteps = 0, sectorDeltaAbsSum = 0;
  for (let i=0; i<11; i++) {
    const a = nodes[i], b = nodes[i+1], edge = edges[i];
    if (edge === 'MF_RADIAL') {
      if (b.layer > a.layer) outwardSteps++; else inwardSteps++;
    }
    if (edge === 'MF_ANGULAR') {
      const step = circularStep(a.sector, b.sector, 72);
      if (step === 1) clockwiseSteps++; else counterclockwiseSteps++;
      sectorDeltaAbsSum += 1;
    }
  }

  let edgeClassSwitchCount = 0;
  for (let i=1; i<edges.length; i++) if (edges[i] !== edges[i-1]) edgeClassSwitchCount++;
  let namespaceSwitchCount = 0;
  for (let i=1; i<namespaces.length; i++) if (namespaces[i] !== namespaces[i-1]) namespaceSwitchCount++;

  const edgeCounts = countBy(edges, ['MF_ANGULAR','MF_RADIAL','MF_CG','CG_CG','CR_D_CYCLE']);
  const namespaceCounts = countBy(namespaces, ['MF','CG','CR_D']);
  const minLayer = layers.length ? Math.min(...layers) : null;
  const maxLayer = layers.length ? Math.max(...layers) : null;
  const span = layers.length ? maxLayer - minLayer : 0;
  const turnCount = edgeClassSwitchCount;
  const geometricGroup = component === 'CR_D' ? 'D12' : 'D9';

  const coarse = `${component}|N:${namespaceCounts.MF}-${namespaceCounts.CG}-${namespaceCounts.CR_D}|E:${edgeCounts.MF_ANGULAR}-${edgeCounts.MF_RADIAL}-${edgeCounts.MF_CG}-${edgeCounts.CG_CG}-${edgeCounts.CR_D_CYCLE}`;
  const topological = `${edges.join('.')}` + `|T:${turnCount}|S:${edgeClassSwitchCount}`;
  const radialAngular = `R:${span}-${edgeCounts.MF_RADIAL}|A:${edgeCounts.MF_ANGULAR}-${circularSpan(sectors) ?? 'NA'}`;

  return {
    version: 'GFV-N12-0.1', n: 12, identityId, component, path: [...path], edgeSequence: edges,
    features: {
      startNamespace: namespaces[0], endNamespace: namespaces[11], namespaceCounts,
      edgeClassCounts: edgeCounts, transitionCounts: transitionCounts(edges),
      radial: { minLayer, maxLayer, span, radialEdgeCount: edgeCounts.MF_RADIAL, outwardSteps, inwardSteps },
      angular: { angularEdgeCount: edgeCounts.MF_ANGULAR, clockwiseSteps, counterclockwiseSteps, sectorDeltaAbsSum, sectorSpanCircular: circularSpan(sectors) },
      topology: { turnCount, edgeClassSwitchCount, namespaceSwitchCount, revisitsAddress: false, isSimplePath: true },
      symmetry: { baseEquivalence: 'REVERSAL_PLUS_APPROVED_AUTOMORPHISM', geometricGroup, canonicalRepresentativeId }
    },
    familyKeys: { coarse, topological, radialAngular, confusionNeighborhood: 'UNCOMPUTED' },
    authority: 'STRUCTURAL_ONLY'
  };
}
