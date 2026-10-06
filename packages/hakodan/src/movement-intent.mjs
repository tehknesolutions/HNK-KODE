const KEYS=["actorId","direction"];
const DIRECTIONS=new Set(["left","right","up","down"]);
const invalid=()=>{throw new Error("HAKODAN_MOVEMENT_INTENT_INVALID");};
export function readMovementIntent(value,expectedActorId){
 if(!value||typeof value!=="object"||Array.isArray(value))invalid();
 const keys=Object.keys(value).sort();if(keys.length!==2||keys.some((key,index)=>key!==KEYS[index]))invalid();
 const {actorId,direction}=value;
 if(typeof expectedActorId!=="string"||!expectedActorId||actorId!==expectedActorId||!DIRECTIONS.has(direction))invalid();
 return {actorId,direction};
}
