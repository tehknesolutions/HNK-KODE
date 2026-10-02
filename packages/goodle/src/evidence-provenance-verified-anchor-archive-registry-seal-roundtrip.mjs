import { importVerifiedAnchorArchiveRegistrySeal } from './evidence-provenance-verified-anchor-archive-registry-seal-import.mjs';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const VERSION='m60-v1';
const KIND='GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY_SEAL';

function reject(reason,failedStage){return Object.freeze({status:'REJECTED',reason,failedStage,evidenceClass:EVIDENCE_CLASS});}
function canonical(value){return JSON.stringify(value);}

export function runVerifiedAnchorArchiveRegistrySealRoundTrip(seal={}){
 if(seal?.version!==VERSION||seal?.kind!==KIND||seal?.evidenceClass!==EVIDENCE_CLASS||!seal?.digest||!Array.isArray(seal.entries))return reject('INVALID_M60_SEAL','M62_INPUT');
 const imported=importVerifiedAnchorArchiveRegistrySeal(JSON.parse(JSON.stringify(seal)));
 if(imported.status!=='IMPORTED_VERIFIED'||!imported.seal)return reject(imported.reason??'M61_IMPORT_FAILED','M61_IMPORT');
 if(canonical(seal)!==canonical(imported.seal))return reject('SEAL_ROUND_TRIP_MISMATCH','M62_EQUIVALENCE');
 return Object.freeze({status:'ANCHOR_ARCHIVE_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',digest:seal.digest,entryCount:seal.entryCount,archiveDigests:Object.freeze(seal.entries.map(e=>e.digest)),protocol:seal.protocol,evidenceClass:EVIDENCE_CLASS,seal:imported.seal,stages:Object.freeze({M60:'PASS',M61:'PASS',M62:'PASS'})});
}
