const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
function freezeArchive(a){return Object.freeze({...a,seal:Object.freeze({...a.seal,entries:Object.freeze((a.seal?.entries??[]).map(e=>Object.freeze({...e,anchor:e.anchor?Object.freeze({...e.anchor}):e.anchor})))})});}
function valid(r={}){const a=r.archive;return r.status==='ANCHOR_REGISTRY_SEAL_ARCHIVE_ROUND_TRIP_CONFORMANT'&&r.evidenceClass===EVIDENCE_CLASS&&a?.evidenceClass===EVIDENCE_CLASS&&a?.protocol===PROTOCOL&&!!a?.digest&&a?.sourceDigest===a?.seal?.digest&&a?.seal?.evidenceClass===EVIDENCE_CLASS;}
function canonical(v){return JSON.stringify(v);}
export function createVerifiedAnchorArchiveRegistry(){const entries=new Map();return Object.freeze({
 register(result={}){if(!valid(result))return Object.freeze({status:'REJECTED',reason:'INVALID_M58_ARCHIVE'});const entry=Object.freeze({digest:result.archive.digest,sourceDigest:result.archive.sourceDigest,protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,archive:freezeArchive(result.archive)});const old=entries.get(entry.digest);if(old)return Object.freeze(canonical(old)===canonical(entry)?{status:'ALREADY_REGISTERED',entry:old}:{status:'REGISTRY_CONFLICT',reason:'DIGEST_CONTENT_CONFLICT',existing:old});entries.set(entry.digest,entry);return Object.freeze({status:'REGISTERED',entry});},
 get(digest){return entries.get(digest)??null;},
 snapshot(){return Object.freeze({version:'m59-v1',kind:'GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY',protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,entries:Object.freeze([...entries.values()])});}
});}
