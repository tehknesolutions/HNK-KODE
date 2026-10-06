import {readMovementIntent} from "./movement-intent.mjs";
import {applyCanonicalActorMovement} from "./canonical-actor-movement.mjs";
import {evaluatePortalProximityState} from "./portal-proximity-state.mjs";
import {toTargetEnvelope} from "./target-envelope.mjs";

export function stepCanonicalWorld(world,value){
 const actor=world?.actor;const intent=readMovementIntent(value,actor?.id);
 const moved=applyCanonicalActorMovement({worldRevision:world?.worldRevision,actor},intent);
 const evaluated=evaluatePortalProximityState({portal:world?.portal,actor:moved.actor,threshold:world?.threshold});
 const targetEnvelope=toTargetEnvelope(evaluated,moved.worldRevision);
 return {worldRevision:moved.worldRevision,actor:{...moved.actor},targetEnvelope};
}
