// Structural confusion metric for KODESCRIPT acquisition experiments.
// It compares family feature keys only. It never assigns semantics.

function parseCoarse(key){
  const m=/^([^|]+)\|N:(\d+)-(\d+)-(\d+)\|E:(\d+)-(\d+)-(\d+)-(\d+)-(\d+)$/.exec(key);
  if(!m) throw new Error(`invalid coarse key: ${key}`);
  return {component:m[1],v:m.slice(2).map(Number)};
}
function parseRadial(key){
  const m=/^R:(\d+)-(\d+)\|A:(\d+)-(\d+|NA)$/.exec(key);
  if(!m) throw new Error(`invalid radialAngular key: ${key}`);
  return [Number(m[1]),Number(m[2]),Number(m[3]),m[4]==='NA'?null:Number(m[4])];
}
function topoEdges(key){
  return key.split('|')[0].split('.');
}
function l1(a,b){return a.reduce((s,x,i)=>s+Math.abs(x-b[i]),0)}

export function structuralConfusionDistance(a,b){
  const ca=parseCoarse(a.familyKeys.coarse), cb=parseCoarse(b.familyKeys.coarse);
  const componentPenalty=ca.component===cb.component?0:100;
  const coarse=l1(ca.v,cb.v);
  const ta=topoEdges(a.familyKeys.topological), tb=topoEdges(b.familyKeys.topological);
  const topological=ta.length===tb.length?ta.reduce((s,x,i)=>s+(x===tb[i]?0:1),0):Math.max(ta.length,tb.length);
  const ra=parseRadial(a.familyKeys.radialAngular), rb=parseRadial(b.familyKeys.radialAngular);
  let radialAngular=0;
  for(let i=0;i<3;i++) radialAngular+=Math.abs(ra[i]-rb[i]);
  radialAngular += ra[3]===null||rb[3]===null ? (ra[3]===rb[3]?0:12) : Math.abs(ra[3]-rb[3]);
  return {total:componentPenalty+coarse+topological+radialAngular,componentPenalty,coarse,topological,radialAngular};
}

export function buildConfusionNeighborhoods(records,{neighbors=3,withinSplit=false}={}){
  if(!Array.isArray(records)) throw new Error('records required');
  return records.map(record=>{
    const candidates=records
      .filter(x=>x.identityId!==record.identityId && (!withinSplit || x.split===record.split))
      .map(x=>({identityId:x.identityId,split:x.split,distance:structuralConfusionDistance(record,x)}))
      .sort((x,y)=>x.distance.total-y.distance.total || x.identityId.localeCompare(y.identityId))
      .slice(0,neighbors);
    return {identityId:record.identityId,split:record.split,neighbors:candidates};
  });
}

export function buildContrastPairs(records,{count=32}={}){
  const seen=new Set(), pairs=[];
  for(const row of buildConfusionNeighborhoods(records,{neighbors:Math.min(8,records.length-1),withinSplit:false})){
    for(const n of row.neighbors){
      const ids=[row.identityId,n.identityId].sort();
      const key=ids.join('|');
      if(seen.has(key)) continue;
      seen.add(key);
      pairs.push({a:ids[0],b:ids[1],distance:n.distance});
    }
  }
  pairs.sort((x,y)=>x.distance.total-y.distance.total || `${x.a}|${x.b}`.localeCompare(`${y.a}|${y.b}`));
  return pairs.slice(0,count);
}
