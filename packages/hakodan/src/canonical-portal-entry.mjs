import {readInteractionIntent} from "./interaction-intent.mjs";
import {evaluatePortalProximityState} from "./portal-proximity-state.mjs";

export function applyCanonicalPortalEntry(world,value){
 const intent=readInteractionIntent(value,world?.actor?.id,"portal-1");
 if(!world||typeof world!=="object"||!world.actor||!world.portal||!Number.isSafeInteger(world.worldRevision)||world.worldRevision<0||world.worldRevision===Number.MAX_SAFE_INTEGER)throw new Error("HAKODAN_CANONICAL_PORTAL_ENTRY_INVALID");
 if(intent.targetId!==world.portal.id)throw new Error("HAKODAN_INTERACTION_INTENT_INVALID");
 const evaluated=evaluatePortalProximityState({portal:world.portal,actor:world.actor,threshold:world.threshold});
 const eligible=world.portal.state==="open"&&evaluated.evidence.proximity;
 if(!eligible)return {accepted:false,reason:"ineligible",interaction:intent,actor:{id:world.actor.id,x:world.actor.x,y:world.actor.y},targetId:world.portal.id,worldRevision:world.worldRevision,portal:{...world.portal}};
 return {accepted:true,reason:"entered",interaction:intent,actor:{id:world.actor.id,x:world.actor.x,y:world.actor.y},targetId:world.portal.id,worldRevision:world.worldRevision+1,portal:{...evaluated.portal}};
}
