export const MORA_KODIN_V07=Object.freeze({
 schema:"MORA-KODIN-PHONOLOGICAL-SEPARATION/V0.7",
 concepts:122,canonPromotions:0,highThreshold:0.75,watchThreshold:0.67
});
export function assertPhonologicalGate(data){
 if(data.schemaVersion!==MORA_KODIN_V07.schema)throw new Error("MORA07_SCHEMA");
 if(data.concepts!==122||data.canonPromotions!==0)throw new Error("MORA07_COUNT");
 if(new Set(data.selected.map(x=>x.selected)).size!==122)throw new Error("MORA07_UNIQUE");
 if(data.after.c75>data.before.c75||data.after.c67>data.before.c67)throw new Error("MORA07_REGRESSION");
 if(!data.selected.every(x=>x.status==="DISCOVERY_CANDIDATE"&&x.canon===false))throw new Error("MORA07_STATUS");
 return true;
}
