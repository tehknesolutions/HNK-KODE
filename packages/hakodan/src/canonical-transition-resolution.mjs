const EXACT_KEYS=["occurred","kind","actorId","targetId","transitionRevision"];

function exactKeys(value,keys){
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const actual=Object.keys(value).sort();
 const expected=[...keys].sort();
 return actual.length===expected.length&&actual.every((key,index)=>key===expected[index]);
}

export function toCanonicalPortalTransition(interactionResult){
 if(!interactionResult||typeof interactionResult!=="object"||interactionResult.accepted!==true||interactionResult.reason!=="entered")throw new Error("HAKODAN_CANONICAL_TRANSITION_INVALID");
 const interaction=interactionResult.interaction;
 const actor=interactionResult.actor;
 const revision=interactionResult.worldRevision;
 if(!interaction||typeof interaction!=="object"||interaction.interaction!=="enter"||!actor||typeof actor!=="object"||typeof actor.id!=="string"||actor.id.length===0||typeof interaction.targetId!=="string"||interaction.targetId.length===0||!Number.isSafeInteger(revision)||revision<=0)throw new Error("HAKODAN_CANONICAL_TRANSITION_INVALID");
 if(interactionResult.interactionRevision!==revision||interactionResult.targetEnvelope?.revision!==revision||interaction.actorId!==actor.id||interactionResult.targetId!==interaction.targetId)throw new Error("HAKODAN_CANONICAL_TRANSITION_INVALID");
 const transition={occurred:true,kind:"portal-entry",actorId:actor.id,targetId:interaction.targetId,transitionRevision:revision};
 if(!exactKeys(transition,EXACT_KEYS))throw new Error("HAKODAN_CANONICAL_TRANSITION_INVALID");
 return transition;
}
