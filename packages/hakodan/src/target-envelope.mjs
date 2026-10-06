import { toPortalTargetSnapshot } from "./portal-target-snapshot.mjs";

export function toTargetEnvelope(evaluated,revision){
 if(!Number.isSafeInteger(revision)||revision<=0)throw new Error("HAKODAN_TARGET_ENVELOPE_INVALID");
 let snapshot;
 try{snapshot=toPortalTargetSnapshot(evaluated);}catch{throw new Error("HAKODAN_TARGET_ENVELOPE_INVALID");}
 return {schema:"hnk.target-envelope.v1",target:"goodle-browser",kind:"portal-state",revision,snapshot:{id:snapshot.id,state:snapshot.state}};
}
