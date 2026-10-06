const KEYS=["actorId","interaction","targetId"];
const invalid=()=>{throw new Error("HAKODAN_INTERACTION_INTENT_INVALID");};
const exact=(value)=>{if(!value||typeof value!=="object"||Array.isArray(value))return false;const keys=Object.keys(value).sort();return keys.length===KEYS.length&&keys.every((key,i)=>key===KEYS.slice().sort()[i]);};
export function readInteractionIntent(value,expectedActorId="alakazam",expectedTargetId="portal-1"){
 if(!exact(value))invalid();
 const record=value;
 if(record.actorId!==expectedActorId||record.interaction!=="enter"||record.targetId!==expectedTargetId)invalid();
 return {actorId:record.actorId,interaction:record.interaction,targetId:record.targetId};
}
