import { assignments } from './morphological-roles-v0.8.mjs';
import { SEMANTIC_TOKENS } from './semantic-tokens.mjs';

export function toRoleBlock(record){
  return {kind:'HNKRoleBlock',semanticId:record.semanticId,role:record.role,familyId:record.familyId,surfaceLanguage:record.surfaceLanguage,surfaceForm:record.surfaceForm,children:[]};
}

export function fromRoleBlock(block,targetLanguage='HNK'){
  const row=assignments.find(x=>x.semanticId===block.semanticId);
  if(!row) throw new Error(`UNKNOWN_SEMANTIC_ID:${block.semanticId}`);
  if(row.role!==block.role) throw new Error(`ROLE_MISMATCH:${row.role}:${block.role}`);
  let surfaceForm=row.selected;
  if(targetLanguage!=='HNK') surfaceForm=SEMANTIC_TOKENS[row.semanticId]?.[targetLanguage] ?? row.semanticId.toLowerCase();
  return {semanticId:row.semanticId,role:row.role,familyId:row.familyId,surfaceLanguage:targetLanguage,surfaceForm,children:structuredClone(block.children ?? [])};
}