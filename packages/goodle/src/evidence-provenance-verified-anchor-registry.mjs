const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';

function canonical(value){return JSON.stringify(value);}
function toEntry(result){const a=result.anchor;return Object.freeze({digest:a.digest,snapshotDigest:a.snapshotDigest,sealDigest:a.sealDigest,protocol:a.protocol,evidenceClass:EVIDENCE_CLASS,anchor:Object.freeze({...a,snapshot:Object.freeze({...a.snapshot,seal:Object.freeze({...a.snapshot.seal,entries:Object.freeze([...(a.snapshot.seal?.entries??[])].map(e=>Object.freeze({...e})))})})})});}
function valid(result={}){return result?.status==='ANCHOR_ROUND_TRIP_CONFORMANT'&&result?.evidenceClass===EVIDENCE_CLASS&&result?.anchor?.evidenceClass===EVIDENCE_CLASS&&!!result.anchor.digest&&result.anchor.snapshotDigest===result.anchor.snapshotDigest&&result.anchor.sealDigest===result.anchor.snapshot?.seal?.digest;}
export function createVerifiedAnchorRegistry(){const entries=new Map();return Object.freeze({
 register(result={}){if(!valid(result))return Object.freeze({status:'REJECTED',reason:'INVALID_M51_ANCHOR'});const entry=toEntry(result);const existing=entries.get(entry.digest);if(existing)return Object.freeze(canonical(existing)===canonical(entry)?{status:'ALREADY_REGISTERED',entry:existing}:{status:'REGISTRY_CONFLICT',reason:'DIGEST_CONTENT_CONFLICT',existing});entries.set(entry.digest,entry);return Object.freeze({status:'REGISTERED',entry});},
 get(digest){return entries.get(digest)??null;},
 snapshot(){return Object.freeze({evidenceClass:EVIDENCE_CLASS,entries:Object.freeze([...entries.values()])});}
});}
