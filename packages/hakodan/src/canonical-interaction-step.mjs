import {applyCanonicalPortalEntry} from "./canonical-portal-entry.mjs";
import {toTargetEnvelope} from "./target-envelope.mjs";
import {toCanonicalPortalTransition} from "./canonical-transition-resolution.mjs";

export function stepCanonicalInteraction(world,intent){
 const entry=applyCanonicalPortalEntry(world,intent);
 if(!entry.accepted)return {accepted:false,reason:entry.reason,interaction:{...entry.interaction},actor:{id:entry.actor.id,x:entry.actor.x,y:entry.actor.y},targetId:entry.targetId,interactionRevision:entry.worldRevision,worldRevision:entry.worldRevision,targetEnvelope:undefined};
 const targetEnvelope=toTargetEnvelope({portal:entry.portal},entry.worldRevision);
 const base={accepted:true,reason:entry.reason,interaction:{...entry.interaction},actor:{id:entry.actor.id,x:entry.actor.x,y:entry.actor.y},targetId:entry.targetId,interactionRevision:entry.worldRevision,worldRevision:entry.worldRevision,targetEnvelope};
 const transition=toCanonicalPortalTransition(base);
 return {...base,transitionRevision:entry.worldRevision,transition};
}
