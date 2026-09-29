import { assignments } from './morphological-roles-v0.8.mjs';
const byId=new Map(assignments.map(x=>[x.semanticId,x]));

export function validateMorphology(semanticId, parsedMorphology) {
  const diagnostics=[];
  const registered=byId.get(semanticId);
  if(!registered) diagnostics.push(`UNKNOWN_SEMANTIC_ID:${semanticId}`);
  if(!parsedMorphology || typeof parsedMorphology!=='object') diagnostics.push('MALFORMED_MORPHOLOGY');
  if(registered && parsedMorphology && typeof parsedMorphology==='object') {
    if(parsedMorphology.role!==registered.role) diagnostics.push(`ROLE_MISMATCH:${registered.role}:${parsedMorphology.role ?? ''}`);
    if(parsedMorphology.familyId!==registered.familyId) diagnostics.push(`FAMILY_MISMATCH:${registered.familyId}:${parsedMorphology.familyId ?? ''}`);
  }
  return {ok:diagnostics.length===0,semanticId,registeredRole:registered?.role ?? null,diagnostics};
}