const KEYS=["actorId","interaction","targetId"];
const invalid=()=>{throw new Error("HAKODAN_INTERACTION_INTENT_INVALID");};
const exact=(value)=>{if(!value||typeof value!=="object"||Array.isArray(value))return false;const keys=Object.keys(value).sort();return keys.length===KEYS.length&&keys.every((key,i)=>key===KEYS.slice().sort()[i]);};
export function readInteractionIntent(value,expectedActorId="alakazam",expectedTargetId="portal-1"){
 if(!exact(value))invalid();
 const record=value;const actorId=actorId,interaction=interaction,targetId=targetId;
 if(typeof expectedActorId!=="string"||expectedActorId.length===0||typeof actorId!=="string"||actorId.length===0||typeof targetId!=="string"||targetId.length===0||actorId!==expectedActorId||interaction!=="enter"||targetId!==expectedTargetId)invalid();
 return {actorId,interaction,targetId};
}
