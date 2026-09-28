// Exact N=12 family census core for HNK-2647892.
// Structural only: no linguistic or semantic assignment.

export const N = 12;
export const V = 441;
const A = 0, R = 1, X = 2, G = 3;
const EDGE_LABELS = ['MF_ANGULAR','MF_RADIAL','MF_CG','CG_CG'];
const POW4 = Array.from({length: 11}, (_, i) => 4 ** i);
const COARSE_SIZE = 10 * 12 * 12 * 12 * 12;
const TOPO_SIZE = 4 ** 11;
const RADIAL_SIZE = 6 * 12 * 12 * 67;

function makeGraph() {
  const adj = Array.from({length: V}, () => []);
  const add = (a,b,t) => { adj[a].push((b<<3)|t); adj[b].push((a<<3)|t); };
  const mf = (l,s) => l*72+s;
  for (let l=0;l<6;l++) for (let s=0;s<72;s++) {
    const v=mf(l,s);
    add(v,mf(l,(s+1)%72),A);
    if (l<5) add(v,mf(l+1,s),R);
    if (l===5) add(v,432+Math.floor(s/8),X);
  }
  for (let g=0;g<9;g++) add(432+g,432+(g+1)%9,G);
  return adj;
}

const ADJ = makeGraph();

export function transformOuter(v,k,reflect=false) {
  if (v<432) {
    const l=Math.floor(v/72), s=v%72;
    const sp=reflect ? ((8*k+7-s)%72+72)%72 : (s+8*k)%72;
    return l*72+sp;
  }
  const g=v-432;
  const gp=reflect ? ((k-g)%9+9)%9 : (g+k)%9;
  return 432+gp;
}

function edgeType(a,b) {
  for (const packed of ADJ[a]) if ((packed>>3)===b) return packed&7;
  return -1;
}

function coarseIndex(cg,a,r,x,g) {
  return cg + 10*(a + 12*(r + 12*(x + 12*g)));
}
function decodeCoarse(i) {
  const cg=i%10; i=Math.floor(i/10);
  const a=i%12; i=Math.floor(i/12);
  const r=i%12; i=Math.floor(i/12);
  const x=i%12; i=Math.floor(i/12);
  const g=i%12;
  return `MF_CG|N:${12-cg}-${cg}-0|E:${a}-${r}-${x}-${g}-0`;
}

function radialIndex(layerSpan,r,a,sectorSpan) {
  return layerSpan + 6*(r + 12*(a + 12*sectorSpan));
}
function decodeRadial(i) {
  const layerSpan=i%6; i=Math.floor(i/6);
  const r=i%12; i=Math.floor(i/12);
  const a=i%12; i=Math.floor(i/12);
  const sectorSpan=i%67;
  return `R:${layerSpan}-${r}|A:${a}-${sectorSpan}`;
}

function decodeTopology(code) {
  const edges=new Array(11);
  let x=code;
  for (let i=10;i>=0;i--) { edges[i]=EDGE_LABELS[x%4]; x=Math.floor(x/4); }
  let switches=0;
  for (let i=1;i<edges.length;i++) if (edges[i]!==edges[i-1]) switches++;
  return `${edges.join('.')}|T:${switches}|S:${switches}`;
}

function sparse(array) {
  const out=[];
  for (let i=0;i<array.length;i++) if (array[i]) out.push([i,array[i]]);
  return out;
}
function addSparse(array, entries) {
  for (const [i,n] of entries) array[i]+=n;
}

function circularSpan(sortedSectors,len) {
  if (len<2) return 0;
  let maxGap=0;
  for (let i=0;i<len;i++) {
    const a=sortedSectors[i];
    const b=i===len-1 ? sortedSectors[0]+72 : sortedSectors[i+1];
    if (b-a>maxGap) maxGap=b-a;
  }
  return 72-maxGap;
}

export function runFamilyCensusShard({shardIndex=0,shardCount=1}={}) {
  if (!Number.isInteger(shardIndex)||!Number.isInteger(shardCount)||shardCount<1||shardIndex<0||shardIndex>=shardCount) {
    throw new Error('invalid shard');
  }

  const orderedCoarse=new Float64Array(COARSE_SIZE);
  const orderedTopo=new Float64Array(TOPO_SIZE);
  const orderedRadial=new Float64Array(RADIAL_SIZE);
  const antiCoarse=new Float64Array(COARSE_SIZE);
  const antiTopo=new Float64Array(TOPO_SIZE);
  const antiRadial=new Float64Array(RADIAL_SIZE);
  const antiTotals=Array(9).fill(0);
  let orderedTotal=0;

  const seen=new Uint8Array(V);
  const sectorCounts=new Uint8Array(72);
  const sectorList=new Uint8Array(12);

  function addSector(s,len) {
    if (sectorCounts[s]++>0) return len;
    let pos=0;
    while (pos<len && sectorList[pos]<s) pos++;
    for (let j=len;j>pos;j--) sectorList[j]=sectorList[j-1];
    sectorList[pos]=s;
    return len+1;
  }
  function removeSector(s,len) {
    sectorCounts[s]--;
    if (sectorCounts[s]>0) return len;
    let pos=0; while (pos<len && sectorList[pos]!==s) pos++;
    for (let j=pos;j<len-1;j++) sectorList[j]=sectorList[j+1];
    return len-1;
  }

  function dfs(v,depth,cg,a,r,x,g,seqF,seqR,minL,maxL,sectorLen) {
    if (depth===N) {
      orderedTotal++;
      orderedCoarse[coarseIndex(cg,a,r,x,g)]++;
      orderedTopo[Math.min(seqF,seqR)]++;
      orderedRadial[radialIndex(maxL-minL,r,a,circularSpan(sectorList,sectorLen))]++;
      return;
    }
    const edgeIndex=depth-1;
    for (const packed of ADJ[v]) {
      const w=packed>>3, t=packed&7;
      if (seen[w]) continue;
      seen[w]=1;
      let nSectorLen=sectorLen, nMin=minL, nMax=maxL, nCg=cg;
      if (w<432) {
        const l=Math.floor(w/72), s=w%72;
        if (l<nMin) nMin=l; if (l>nMax) nMax=l;
        nSectorLen=addSector(s,sectorLen);
      } else nCg++;
      dfs(
        w,depth+1,nCg,
        a+(t===A),r+(t===R),x+(t===X),g+(t===G),
        (seqF<<2)|t, seqR+t*POW4[edgeIndex],
        nMin,nMax,nSectorLen
      );
      if (w<432) removeSector(w%72,nSectorLen);
      seen[w]=0;
    }
  }

  for (let st=shardIndex;st<V;st+=shardCount) {
    seen[st]=1;
    let sectorLen=0,minL=99,maxL=-1,cg=0;
    if (st<432) {
      minL=maxL=Math.floor(st/72);
      sectorLen=addSector(st%72,0);
    } else cg=1;
    dfs(st,1,cg,0,0,0,0,0,0,minL,maxL,sectorLen);
    if (st<432) removeSector(st%72,sectorLen);
    seen[st]=0;
  }

  // Reflection anti-fixed paths: g(P)=reverse(P).
  const half=new Int16Array(6);
  const seenHalf=new Uint8Array(V);
  const full=new Int16Array(12);

  function countAntiPath(path) {
    let cg=0,a=0,r=0,x=0,g=0,seqF=0,seqR=0,minL=99,maxL=-1;
    const sectors=[];
    for (let i=0;i<12;i++) {
      const v=path[i];
      if (v<432) {
        const l=Math.floor(v/72),s=v%72;
        if (l<minL) minL=l; if (l>maxL) maxL=l;
        if (!sectors.includes(s)) sectors.push(s);
      } else cg++;
      if (i<11) {
        const t=edgeType(v,path[i+1]);
        if (t<0) throw new Error('anti-fixed path contains illegal edge');
        a+=(t===A); r+=(t===R); x+=(t===X); g+=(t===G);
        seqF=(seqF<<2)|t;
        seqR+=t*POW4[i];
      }
    }
    sectors.sort((p,q)=>p-q);
    antiCoarse[coarseIndex(cg,a,r,x,g)]++;
    antiTopo[Math.min(seqF,seqR)]++;
    antiRadial[radialIndex(maxL-minL,r,a,circularSpan(sectors,sectors.length))]++;
  }

  for (let k=0;k<9;k++) {
    function halfDfs(v,depth) {
      half[depth-1]=v; seenHalf[v]=1;
      if (depth===6) {
        const gv=transformOuter(v,k,true);
        if (gv!==v && edgeType(v,gv)>=0) {
          let ok=true;
          for (let i=0;i<6;i++) if (seenHalf[transformOuter(half[i],k,true)]) { ok=false; break; }
          if (ok) {
            for (let i=0;i<6;i++) full[i]=half[i];
            for (let i=0;i<6;i++) full[6+i]=transformOuter(half[5-i],k,true);
            antiTotals[k]++;
            countAntiPath(full);
          }
        }
      } else {
        for (const packed of ADJ[v]) {
          const w=packed>>3;
          if (!seenHalf[w]) halfDfs(w,depth+1);
        }
      }
      seenHalf[v]=0;
    }
    for (let st=shardIndex;st<V;st+=shardCount) halfDfs(st,1);
  }

  return {
    schemaVersion:'1.0.0',
    shard:{index:shardIndex,count:shardCount},
    orderedTotal,
    reflectionAntiFixedTotals:antiTotals,
    ordered:{
      coarse:sparse(orderedCoarse),
      topological:sparse(orderedTopo),
      radialAngular:sparse(orderedRadial)
    },
    reflectionAntiFixedSum:{
      coarse:sparse(antiCoarse),
      topological:sparse(antiTopo),
      radialAngular:sparse(antiRadial)
    }
  };
}

function mergeDimension(shards, orderedField, antiField, decoder) {
  const size = orderedField==='topological' ? TOPO_SIZE : orderedField==='coarse' ? COARSE_SIZE : RADIAL_SIZE;
  const ordered=new Float64Array(size), anti=new Float64Array(size);
  for (const shard of shards) {
    addSparse(ordered,shard.ordered[orderedField]);
    addSparse(anti,shard.reflectionAntiFixedSum[antiField]);
  }
  const families=[];
  let total=0;
  for (let i=0;i<size;i++) {
    if (!ordered[i] && !anti[i]) continue;
    if ((ordered[i]+anti[i])%36!==0) throw new Error(`Burnside family divisibility failure ${orderedField}:${i}`);
    const count=(ordered[i]+anti[i])/36;
    if (count) { families.push({key:decoder(i),count}); total+=count; }
  }
  return {families,total};
}

export function mergeFamilyCensusShards(shards) {
  if (!Array.isArray(shards)||!shards.length) throw new Error('no shards');
  const count=shards[0].shard.count;
  if (shards.length!==count) throw new Error(`expected ${count} shards, got ${shards.length}`);
  const indices=new Set(shards.map(s=>s.shard.index));
  if (indices.size!==count) throw new Error('duplicate/missing shard indices');

  const orderedTotal=shards.reduce((a,s)=>a+s.orderedTotal,0);
  if (orderedTotal!==95284494) throw new Error(`ordered MF+CG total drift: ${orderedTotal}`);
  const reflectionTotals=Array(9).fill(0);
  for (const s of shards) for (let k=0;k<9;k++) reflectionTotals[k]+=s.reflectionAntiFixedTotals[k];
  if (reflectionTotals.some(x=>x!==4398)) throw new Error(`reflection anti-fixed drift: ${reflectionTotals.join(',')}`);

  const coarse=mergeDimension(shards,'coarse','coarse',decodeCoarse);
  const topological=mergeDimension(shards,'topological','topological',decodeTopology);
  const radialAngular=mergeDimension(shards,'radialAngular','radialAngular',decodeRadial);

  const crd={
    coarse:'CR_D|N:0-0-12|E:0-0-0-0-11',
    topological:`${Array(11).fill('CR_D_CYCLE').join('.')}|T:0|S:0`,
    radialAngular:'R:0-0|A:0-NA'
  };
  coarse.families.push({key:crd.coarse,count:1}); coarse.total++;
  topological.families.push({key:crd.topological,count:1}); topological.total++;
  radialAngular.families.push({key:crd.radialAngular,count:1}); radialAngular.total++;

  for (const [name,x] of Object.entries({coarse,topological,radialAngular})) {
    if (x.total!==2647892) throw new Error(`${name} family orbit total drift: ${x.total}`);
    x.families.sort((a,b)=>b.count-a.count || a.key.localeCompare(b.key));
  }

  return {
    schemaVersion:'1.0.0',
    mathematicalKernel:'HNK-2647892-MATH-KERNEL-V1',
    n:12,
    method:'BURNSIDE_WEIGHTED_BY_REVERSAL_INVARIANT_FAMILY',
    proof:{
      orderedMfCgSimplePaths:orderedTotal,
      reversalClassesMfCg:orderedTotal/2,
      reflectionOrderedAntiFixed:reflectionTotals,
      group:'D9',
      groupOrder:18,
      crDGeometricClasses:1
    },
    summary:{
      geometricIdentities:2647892,
      familyCardinality:{
        coarse:coarse.families.length,
        topological:topological.families.length,
        radialAngular:radialAngular.families.length
      }
    },
    families:{
      coarse:coarse.families,
      topological:topological.families,
      radialAngular:radialAngular.families
    },
    authority:'STRUCTURAL_ONLY'
  };
}
