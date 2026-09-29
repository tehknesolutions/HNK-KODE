export const MORA_KODIN_V06 = Object.freeze({
  schema:"MORA-KODIN-ROOT-FAMILY/V0.6",
  familyCount:26,
  concepts:122,
  candidates:366,
  canonPromotions:0,
  creatorGateRequired:true
});

export function assertRootFamilyGate(data){
  if(data.schemaVersion!==MORA_KODIN_V06.schema) throw new Error("MORA06_SCHEMA");
  if(data.familyCount!==26||data.concepts!==122||data.candidates!==366) throw new Error("MORA06_COUNT");
  if(data.canonPromotions!==0) throw new Error("MORA06_CANON");
  if(!data.metrics.allConceptsAssigned||!data.metrics.allCandidateFormsUnique||!data.metrics.allWinnerFormsUnique) throw new Error("MORA06_UNIQUENESS");
  const assigned=new Set(data.items.map(x=>x.semanticId));
  if(assigned.size!==122) throw new Error("MORA06_COVERAGE");
  for(const x of data.items){
    if(x.status!=="DISCOVERY_CANDIDATE"||x.canon!==false) throw new Error("MORA06_STATUS");
    if(!x.familyId||!x.familyRoot||x.candidates.length!==3) throw new Error("MORA06_FAMILY");
  }
  return true;
}
