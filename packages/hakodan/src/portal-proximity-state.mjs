import { evaluateFormula } from "./derived-formula-state.mjs";

const VALID_PORTAL_STATES=new Set(["closed","open"]);

function finiteNumber(value){return typeof value==="number"&&Number.isFinite(value);}
function invalid(){throw new Error("HAKODAN_PORTAL_PROXIMITY_INVALID");}

export function evaluatePortalProximityState(input){
 if(!input||typeof input!=="object"||Array.isArray(input))invalid();
 const {portal,actor,threshold}=input;
 if(!portal||typeof portal!=="object"||Array.isArray(portal)||!actor||typeof actor!=="object"||Array.isArray(actor))invalid();
 if(!VALID_PORTAL_STATES.has(portal.state)||!finiteNumber(portal.x)||!finiteNumber(portal.y)||!finiteNumber(actor.x)||!finiteNumber(actor.y)||!finiteNumber(threshold)||threshold<0)invalid();

 const formula={op:"DISTANCE",args:[{value:actor.x},{value:actor.y},{value:portal.x},{value:portal.y}]};
 const evaluated=evaluateFormula(formula,{resolveStat(){throw new Error("HAKODAN_PORTAL_PROXIMITY_INVALID");}});
 const distance=evaluated.value;
 const proximity=distance<=threshold;
 const shouldOpen=portal.state==="closed"&&proximity;
 const nextPortal={...portal,state:shouldOpen?"open":portal.state};

 return {
  portal:nextPortal,
  transition:shouldOpen?{from:"closed",to:"open"}:null,
  evidence:{distance,threshold,proximity,formula:evaluated.expression}
 };
}
