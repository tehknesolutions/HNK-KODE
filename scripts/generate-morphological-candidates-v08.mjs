import { readFile, writeFile } from 'node:fs/promises';
import { generateRoleCandidates, scoreRoleCandidate, ROLE_MORPHEME_HYPOTHESES } from '../packages/hakodan/src/morphological-generator-v0.8.mjs';
const roles=JSON.parse(await readFile('data/lexicon/haKodan-morphological-roles-v0.8.json','utf8'));
const used=new Set(), watch=[];
const items=roles.assignments.map(row=>{
  const candidates=generateRoleCandidates(row).map(c=>({...c,score:scoreRoleCandidate(c,row)}));
  for(const c of candidates)c.totalScore=Object.values(c.score).reduce((a,b)=>a+b,0);
  candidates.sort((a,b)=>b.totalScore-a.totalScore||a.form.length-b.form.length||a.form.localeCompare(b.form));
  let selected=candidates.find(c=>!used.has(c.form));
  if(!selected){selected=candidates[0];watch.push({semanticId:row.semanticId,code:'MORPH08_COLLISION',form:selected.form});}
  used.add(selected.form);
  return {...row,candidates,selected:selected.form,selectedVariant:selected.variant,status:'DISCOVERY_CANDIDATE',canon:false};
});
const data={schemaVersion:'HAKODAN-MORPHOLOGY/V0.8',status:'DISCOVERY_NON_CANONICAL',roleMorphemeHypotheses:ROLE_MORPHEME_HYPOTHESES,concepts:items.length,canonPromotions:0,selectedUnique:new Set(items.map(x=>x.selected)).size===items.length,watch,items};
await writeFile('data/lexicon/haKodan-morphological-candidates-v0.8.json',JSON.stringify(data,null,2)+'\n');
const q=v=>'"'+String(v).replaceAll('"','""')+'"';
const csv=['semanticId,ptBr,role,familyRoot,v07Form,selected,variant,status',...items.map(x=>[x.semanticId,x.ptBr,x.role,x.familyRoot,x.selected,x.selected,x.selectedVariant,x.status].map(q).join(','))];
await writeFile('data/lexicon/haKodan-morphological-shortlist-v0.8.csv',csv.join('\n')+'\n');
console.log(JSON.stringify({concepts:items.length,unique:data.selectedUnique,watch:watch.length,roles:Object.fromEntries(Object.entries(ROLE_MORPHEME_HYPOTHESES))}));
