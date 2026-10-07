const invalid=()=>{throw new Error("HAKODAN_CANONICAL_TRANSITION_INVALID");};
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).sort().join("|")===[...keys].sort().join("|");
const OUTER=["accepted","reason","interaction","actor","targetId","interactionRevision","worldRevision","targetEnvelope"];
const INTENT=["actorId","interaction","targetId"];
const ACTOR=["id","x","y"];
const ENVELOPE=["schema","target","kind","revision","snapshot"];
const SNAPSHOT=["id","state"];

export function toCanonicalPortalTransition(result){
 if(!exact(result,OUTER))invalid();
 const {accepted,reason,interaction,actor,targetId,interactionRevision,worldRevision,targetEnvelope}=result;
 if(!exact(interaction,INTENT)||!exact(actor,ACTOR)||!exact(targetEnvelope,ENVELOPE))invalid();
 const {actorId,interaction:action,targetId:intentTarget}=interaction;
 const {id,x,y}=actor;
 const {schema,target,kind,revision,snapshot}=targetEnvelope;
 if(!exact(snapshot,SNAPSHOT))invalid();
 const {id:portalId,state}=snapshot;
 if(accepted!==true||reason!=="entered"||action!=="enter"||typeof actorId!=="string"||!actorId||typeof intentTarget!=="string"||!intentTarget||id!==actorId||targetId!==intentTarget||portalId!==targetId||!Number.isFinite(x)||!Number.isFinite(y)||!Number.isSafeInteger(worldRevision)||worldRevision<=0||interactionRevision!==worldRevision||revision!==worldRevision||schema!=="hnk.target-envelope.v1"||target!=="goodle-browser"||kind!=="portal-state"||!["open","closed"].includes(state))invalid();
 return {occurred:true,kind:"portal-entry",actorId,targetId,transitionRevision:worldRevision};
}
