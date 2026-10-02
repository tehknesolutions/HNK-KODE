import { traverseProvenance } from './evidence-provenance-traversal.mjs';

function index(nodes = []) { const m=new Map(); for(const n of nodes){ if(!n?.id || m.has(n.id)) return null; m.set(n.id,{id:n.id,parents:[...(n.parents??[])]}); } return m; }
function sortedDiff(a,b){const A=new Set(a),B=new Set(b);return {added:[...B].filter(x=>!A.has(x)).sort(),removed:[...A].filter(x=>!B.has(x)).sort()};}

export function compareProvenanceSnapshots(left=[], right=[], rootId='') {
  const L=index(left), R=index(right);
  if(!L||!R) return Object.freeze({status:'REJECTED',reason:'AMBIGUOUS_GRAPH'});
  if(!L.has(rootId)||!R.has(rootId)) return Object.freeze({status:'REJECTED',reason:'ROOT_NOT_FOUND'});
  const direct=sortedDiff(L.get(rootId).parents,R.get(rootId).parents);
  const lt=traverseProvenance(left,rootId), rt=traverseProvenance(right,rootId);
  if(lt.status!=='TRAVERSED'||rt.status!=='TRAVERSED') return Object.freeze({status:'REJECTED',reason:'INVALID_PROVENANCE'});
  const ancestors=sortedDiff(lt.ancestors,rt.ancestors);
  const orderingChanged=JSON.stringify(L.get(rootId).parents)!==JSON.stringify(R.get(rootId).parents);
  return Object.freeze({status:'COMPARED',rootId,direct:Object.freeze({added:Object.freeze(direct.added),removed:Object.freeze(direct.removed),orderingChanged}),ancestors:Object.freeze({added:Object.freeze(ancestors.added),removed:Object.freeze(ancestors.removed)})});
}