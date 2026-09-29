export const MORA_KODIN_V05 = Object.freeze({
  schema:"MORA-KODIN-COMPACT-GATE/V0.5",
  concepts:122,
  candidates:366,
  canonPromotions:0,
  creatorGateRequired:true,
  canonicalFrozen:Object.freeze(["AHNUVA","EMANU","HAYA","HODERU","KODAN"])
});

export function assertCompactMoraGate(data){
  if(data.schemaVersion!==MORA_KODIN_V05.schema) throw new Error("MORA05_SCHEMA");
  if(data.concepts!==122||data.candidates!==366) throw new Error("MORA05_COUNT");
  if(data.canonPromotions!==0) throw new Error("MORA05_CANON");
  if(!data.metrics.uniqueWinners||!data.metrics.allCandidatesUnique) throw new Error("MORA05_UNIQUENESS");
  for(const x of data.items){
    if(x.status!=="DISCOVERY_CANDIDATE"||x.canon!==false) throw new Error("MORA05_STATUS");
    if(x.candidates.length!==3) throw new Error("MORA05_TRIPLE");
    if(!x.candidates.some(c=>c.form===x.shortlist)) throw new Error("MORA05_SHORTLIST");
  }
  return true;
}
