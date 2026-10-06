const VALID_STATES=new Set(["closed","open"]);
function invalid(){throw new Error("HAKODAN_PORTAL_TARGET_SNAPSHOT_INVALID");}

export function toPortalTargetSnapshot(evaluated){
 if(!evaluated||typeof evaluated!=="object"||Array.isArray(evaluated))invalid();
 const portal=evaluated.portal;
 if(!portal||typeof portal!=="object"||Array.isArray(portal))invalid();
 if(typeof portal.id!=="string"||portal.id.length===0||!VALID_STATES.has(portal.state))invalid();
 return {id:portal.id,state:portal.state};
}
