import { extractGlyphFeatureVector } from './glyph-feature-vector.mjs';

const N=12, V=441;
const HNK40_COARSE='MF_CG|N:12-0-0|E:7-4-0-0-0';

function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function fnv1a(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)}return h>>>0}

function makeGraph(){
  const adj=Array.from({length:V},()=>[]);
  const add=(a,b,t)=>{adj[a].push([b,t]);adj[b].push([a,t])};
  const mf=(l,s)=>l*72+s;
  for(let l=0;l<6;l++)for(let s=0;s<72;s++){
    const v=mf(l,s);
    add(v,mf(l,(s+1)%72),'MF_ANGULAR');
    if(l<5)add(v,mf(l+1,s),'MF_RADIAL');
    if(l===5)add(v,432+Math.floor(s/8),'MF_CG');
  }
  for(let g=0;g<9;g++)add(432+g,432+(g+1)%9,'CG_CG');
  return adj;
}

const ADJ=makeGraph();

function transform(v,k,reflect=false){
  if(v<432){
    const l=Math.floor(v/72),s=v%72;
    const sp=reflect?((8*k+7-s)%72+72)%72:(s+8*k)%72;
    return l*72+sp;
  }
  const g=v-432;
  return 432+(reflect?((k-g)%9+9)%9:(g+k)%9);
}

function canonicalPath(path){
  let best=null;
  for(let k=0;k<9;k++)for(const reflect of [false,true])for(const reverse of [false,true]){
    const source=reverse?[...path].reverse():path;
    const candidate=source.map(v=>transform(v,k,reflect));
    const key=candidate.map(v=>String(v).padStart(3,'0')).join(',');
    if(best===null||key<best.key)best={key,path:candidate};
  }
  return best.path;
}

function address(v){
  if(v<432)return `MF:L${String(Math.floor(v/72)+1).padStart(2,'0')}:S${String(v%72+1).padStart(2,'0')}`;
  return `CG:${String(v-431).padStart(2,'0')}`;
}

function edgeType(a,b){
  for(const [w,t] of ADJ[a])if(w===b)return t;
  throw new Error('invalid graph edge');
}

function coarseKey(path){
  const edges=path.slice(0,-1).map((_,i)=>edgeType(path[i],path[i+1]));
  const cg=path.filter(v=>v>=432).length;
  const count=t=>edges.filter(x=>x===t).length;
  return `MF_CG|N:${12-cg}-${cg}-0|E:${count('MF_ANGULAR')}-${count('MF_RADIAL')}-${count('MF_CG')}-${count('CG_CG')}-0`;
}

function weightedChoice(options,rng){
  const weights=options.map(([,t])=>t==='MF_CG'||t==='CG_CG'?4:t==='MF_RADIAL'?2:1);
  let x=rng()*weights.reduce((a,b)=>a+b,0),i=0;
  while(x>=weights[i]){x-=weights[i];i++}
  return options[i][0];
}

function discoverCoarseRepresentatives({seed=2647892,target=120,maxTrials=180000}={}){
  const rng=mulberry32(seed), reps=new Map();
  for(let trial=0;trial<maxTrials&&reps.size<target;trial++){
    const start=trial%3===0?432+Math.floor(rng()*9):Math.floor(rng()*432);
    const path=[start],seen=new Set(path);
    while(path.length<N){
      const options=ADJ[path.at(-1)].filter(([w])=>!seen.has(w));
      if(!options.length)break;
      const w=weightedChoice(options,rng);
      path.push(w);seen.add(w);
    }
    if(path.length!==N)continue;
    const key=coarseKey(path);
    if(key===HNK40_COARSE||reps.has(key))continue;
    const canonical=canonicalPath(path);
    const addresses=canonical.map(address);
    const gfv=extractGlyphFeatureVector({identityId:`DISCOVERY-${reps.size+1}`,path:addresses});
    reps.set(key,{path:addresses,familyKeys:{...gfv.familyKeys},hasCG:addresses.some(x=>x.startsWith('CG:'))});
  }
  if(reps.size<target)throw new Error(`family discovery incomplete: ${reps.size}/${target}`);
  return reps;
}

export function generateFamilyExpansionCorpusV1(){
  const reps=discoverCoarseRepresentatives();
  const rank=(a,b)=>fnv1a(a.familyKeys.coarse)-fnv1a(b.familyKeys.coarse)||a.familyKeys.coarse.localeCompare(b.familyKeys.coarse);
  const pure=[...reps.values()].filter(x=>!x.hasCG).sort(rank);
  const mixed=[...reps.values()].filter(x=>x.hasCG).sort(rank);
  if(pure.length<9||mixed.length<86)throw new Error(`insufficient selection pool pure=${pure.length} mixed=${mixed.length}`);

  const training=[...pure.slice(0,9),...mixed.slice(0,63)];
  const outerHoldout=mixed.slice(63,86);
  const reserve=mixed.slice(86);

  const decorate=(record,id,split)=>({
    identityId:id,
    split,
    component:'MF_CG',
    path:record.path,
    familyKeys:record.familyKeys,
    authority:'STRUCTURAL_ONLY',
    semanticBinding:null
  });

  const train=training.map((r,i)=>decorate(r,`FEXP-T${String(i+1).padStart(3,'0')}`,'TRAIN'));
  const holdout=outerHoldout.map((r,i)=>decorate(r,`FEXP-H${String(i+1).padStart(3,'0')}`,'HOLDOUT'));
  const crdPath=Array.from({length:12},(_,i)=>`CR:D:${String(i+1).padStart(2,'0')}`);
  const crdGfv=extractGlyphFeatureVector({identityId:'FEXP-H024',path:crdPath});
  holdout.push({
    identityId:'FEXP-H024',split:'HOLDOUT',component:'CR_D',path:crdPath,
    familyKeys:{...crdGfv.familyKeys},authority:'STRUCTURAL_ONLY',semanticBinding:null
  });

  const trainCoarse=new Set(train.map(r=>r.familyKeys.coarse));
  const holdoutCoarse=new Set(holdout.map(r=>r.familyKeys.coarse));
  const overlap=[...trainCoarse].filter(k=>holdoutCoarse.has(k));
  if(overlap.length)throw new Error('train/holdout coarse-family leakage');

  const cardinality=records=>Object.fromEntries(['coarse','topological','radialAngular'].map(k=>[k,new Set(records.map(r=>r.familyKeys[k])).size]));

  return {
    schemaVersion:'1.0.0',
    id:'HNK-FAMILY-EXPANSION-CORPUS-V1',
    mathematicalKernel:'HNK-2647892-MATH-KERNEL-V1',
    familyCensus:'HNK-2647892-FAMILY-CENSUS-V1',
    selection:{
      seed:2647892,
      prng:'MULBERRY32',
      coarseDiscoveryTarget:120,
      maxTrials:180000,
      coarseRank:'FNV1A32_THEN_LEXICOGRAPHIC',
      hnk40CoarseExcluded:HNK40_COARSE,
      trainingRule:'9 discovered pure-MF coarse families + first 63 mixed coarse families by deterministic rank',
      holdoutRule:'next 23 mixed coarse families by deterministic rank + CR:D D12 class',
      reserveRule:'remaining discovered mixed coarse families',
      holdoutUnit:'COARSE_FAMILY',
      semanticSelection:false
    },
    summary:{
      train:train.length,holdout:holdout.length,total:train.length+holdout.length,
      reserveDiscoveredCoarseFamilies:reserve.length,
      trainFamilyCardinality:cardinality(train),
      holdoutFamilyCardinality:cardinality(holdout),
      trainHoldoutCoarseOverlap:overlap.length,
      semanticBindings:0
    },
    train,holdout,
    reserveCoarseFamilies:reserve.map(r=>r.familyKeys.coarse),
    authority:'STRUCTURAL_ONLY'
  };
}
