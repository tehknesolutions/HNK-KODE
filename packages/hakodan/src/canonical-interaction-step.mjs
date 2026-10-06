import {applyCanonicalPortalEntry} from "./canonical-portal-entry.mjs";
import {toTargetEnvelope} from "./target-envelope.mjs";

export function stepCanonicalInteraction(world,intent){
 const entry=applyCanonicalPortalEntry(world,intent);
 if(!entry.accepted)return {...entry,interactionRevision:entry.worldRevision,targetEnvelope:undefined};
 const targetEnvelope=toTargetEnvelope({portal:entry.portal},entry.worldRevision);
 return {accepted:true,reason:entry.reason,interaction:{...entry.interaction},actor:{...entry.actor},targetId:entry.targetId,interactionRevision:entry.worldRevision,worldRevision:entry.worldRevision,targetEnvelope};
}
