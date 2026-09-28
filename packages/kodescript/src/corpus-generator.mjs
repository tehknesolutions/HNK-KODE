import { extractGlyphFeatureVector, classifyEdge } from './glyph-feature-vector.mjs';

function mf(layer, sector) { return `MF:L${String(layer).padStart(2,'0')}:S${String(sector).padStart(2,'0')}`; }
function cg(group) { return `CG:${String(group).padStart(2,'0')}`; }
function crd(index) { return `CR:D:${String(index).padStart(2,'0')}`; }

export function buildFrozenGraph() {
  const nodes = [];
  for (let l=1;l<=6;l++) for (let s=1;s<=72;s++) nodes.push(mf(l,s));
  for (let g=1;g<=9;g++) nodes.push(cg(g));
  for (let i=1;i<=12;i++) nodes.push(crd(i));
  const graph = new Map(nodes.map(n => [n, []]));
  for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
    try { classifyEdge(nodes[i], nodes[j]); graph.get(nodes[i]).push(nodes[j]); graph.get(nodes[j]).push(nodes[i]); } catch {}
  }
  for (const list of graph.values()) list.sort();
  return graph;
}

function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

function canonicalReversal(path) {
  const a = path.join('>'), b = [...path].reverse().join('>');
  return a <= b ? a : b;
}

export function enumerateSimplePaths({ graph = buildFrozenGraph(), n = 12, starts = null, maxPaths = 10000 } = {}) {
  const roots = (starts ?? [...graph.keys()]).slice().sort();
  const seen = new Set();
  const out = [];
  function dfs(path, used) {
    if (out.length >= maxPaths) return;
    if (path.length === n) {
      const key = canonicalReversal(path);
      if (!seen.has(key)) { seen.add(key); out.push([...path]); }
      return;
    }
    for (const next of graph.get(path.at(-1)) ?? []) {
      if (used.has(next)) continue;
      used.add(next); path.push(next); dfs(path, used); path.pop(); used.delete(next);
      if (out.length >= maxPaths) return;
    }
  }
  for (const root of roots) {
    dfs([root], new Set([root]));
    if (out.length >= maxPaths) break;
  }
  return out;
}

function structuralDistance(a,b) {
  const ea=a.features.edgeClassCounts, eb=b.features.edgeClassCounts;
  const keys=Object.keys(ea);
  let d=keys.reduce((sum,k)=>sum+Math.abs(ea[k]-eb[k]),0);
  d += Math.abs(a.features.radial.span-b.features.radial.span);
  d += Math.abs(a.features.angular.angularEdgeCount-b.features.angular.angularEdgeCount);
  d += Math.abs(a.features.topology.edgeClassSwitchCount-b.features.topology.edgeClassSwitchCount);
  if (a.component !== b.component) d += 100;
  return d;
}

export function generateAcquisitionCorpus({ paths, benchmarkIdentityIds = [], seed = 'HNK-KODESCRIPT-V0.1', heldOutRatio = 0.2 } = {}) {
  if (!Array.isArray(paths) || !paths.length) throw new Error('paths required');
  const gfvs = paths.map((path,i)=>extractGlyphFeatureVector({identityId:`GFV:${String(i+1).padStart(6,'0')}`,path}));
  const families = new Map();
  for (const g of gfvs) { const k=g.familyKeys.coarse; if(!families.has(k)) families.set(k,[]); families.get(k).push(g); }
  const selected=[];
  for (const [family,members] of [...families.entries()].sort(([a],[b])=>a.localeCompare(b))) {
    const ranked=[...members].sort((a,b)=>fnv1a(`${seed}|${family}|${a.identityId}`)-fnv1a(`${seed}|${family}|${b.identityId}`));
    selected.push(ranked[0]);
  }
  const heldOut=[], training=[];
  for (const g of selected) ((fnv1a(`${seed}|HOLDOUT|${g.familyKeys.coarse}`)%10000)/10000 < heldOutRatio ? heldOut : training).push(g);
  if (!heldOut.length && training.length>1) heldOut.push(training.pop());
  const confusionPairs=[];
  for (const g of training) {
    let best=null, dist=Infinity;
    for (const h of gfvs) { if(h.identityId===g.identityId) continue; const d=structuralDistance(g,h); if(d<dist){dist=d;best=h;} }
    if(best) confusionPairs.push({target:g.identityId,distractor:best.identityId,distance:dist});
  }
  return {
    schema:'hnk-kodescript-acquisition-corpus/v0.1', seed,
    counts:{inputPaths:paths.length,structuralFamilies:families.size,representatives:selected.length,training:training.length,heldOut:heldOut.length,confusionPairs:confusionPairs.length},
    benchmark:{requestedIdentityIds:[...benchmarkIdentityIds],note:'HNK40 IDs are attached only when supplied by a verified benchmark mapping; never fabricated.'},
    training:training.map(g=>g.identityId), heldOut:heldOut.map(g=>g.identityId), confusionPairs,
    featureVectors:gfvs,
    authority:'STRUCTURAL_ONLY'
  };
}
