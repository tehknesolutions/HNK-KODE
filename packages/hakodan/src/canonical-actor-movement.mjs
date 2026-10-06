const invalid=()=>{throw new Error("HAKODAN_CANONICAL_MOVEMENT_INVALID");};
export function applyCanonicalActorMovement(world,intent){
 const actor=world?.actor,revision=world?.worldRevision;
 if(!Number.isSafeInteger(revision)||revision<0||revision>=Number.MAX_SAFE_INTEGER||!actor||typeof actor.id!=="string"||!Number.isFinite(actor.x)||!Number.isFinite(actor.y)||intent?.actorId!==actor.id)invalid();
 let {x,y}=actor;switch(intent.direction){case"right":x+=1;break;case"left":x-=1;break;case"down":y+=1;break;case"up":y-=1;break;default:invalid();}
 return {worldRevision:revision+1,actor:{id:actor.id,x,y}};
}
