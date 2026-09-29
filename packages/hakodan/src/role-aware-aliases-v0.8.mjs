import { SEMANTIC_TOKENS } from './semantic-tokens.mjs';
import { assignments, getRoleForSemanticId } from './morphological-roles-v0.8.mjs';

const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ç/gi,'c').toLowerCase();
const aliases=new Map();
for(const row of assignments){
  aliases.set(normalize(row.selected),{semanticId:row.semanticId,surfaceLanguage:'HNK'});
  aliases.set(normalize(row.semanticId),{semanticId:row.semanticId,surfaceLanguage:'EN'});
}
for(const [semanticId,forms] of Object.entries(SEMANTIC_TOKENS)){
  if(forms['PT-BR']) aliases.set(normalize(forms['PT-BR']),{semanticId,surfaceLanguage:'PT-BR'});
  if(forms.EN) aliases.set(normalize(forms.EN),{semanticId,surfaceLanguage:'EN'});
}

export function resolveRoleAwareAlias(surface, languageHint=null){
  const normalizedSurface=normalize(surface);
  const hit=aliases.get(normalizedSurface);
  if(!hit) throw new Error(`UNKNOWN_ALIAS:${surface}`);
  const row=assignments.find(x=>x.semanticId===hit.semanticId);
  return {semanticId:hit.semanticId,role:getRoleForSemanticId(hit.semanticId),familyId:row.familyId,normalizedSurface,surfaceLanguage:languageHint ?? hit.surfaceLanguage,surfaceForm:surface};
}