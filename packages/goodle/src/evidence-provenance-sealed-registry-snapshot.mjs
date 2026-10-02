import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function freezeSeal(seal={}) { return Object.freeze({...seal,entries:Object.freeze((seal.entries??[]).map(e=>Object.freeze({...e})))}); }

export function exportSealedRegistrySnapshot(result={}) {
  if(result?.status!=='REGISTRY_SEAL_ROUND_TRIP_CONFORMANT' || result?.evidenceClass!==EVIDENCE_CLASS || result?.seal?.evidenceClass!==EVIDENCE_CLASS || !result?.seal?.digest) return Object.freeze({status:'REJECTED',envelope:null,snapshot:null,reason:'INVALID_M46_RESULT'});
  const snapshot={version:'m46-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT',protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,seal:freezeSeal(result.seal)};
  const sourceDigest=result.seal.digest;
  const payload={...snapshot,sourceDigest};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'EXPORTED',envelope:Object.freeze({...payload,digest}),snapshot:Object.freeze(snapshot),serialized});
}

export function importSealedRegistrySnapshot(envelope={}) {
  if(envelope?.version!=='m46-v1' || envelope?.kind!=='GOODLE_SEALED_REGISTRY_SNAPSHOT' || envelope?.protocol!==PROTOCOL || envelope?.evidenceClass!==EVIDENCE_CLASS || !envelope.sourceDigest || !envelope.digest || !envelope.seal) return Object.freeze({status:'REJECTED',snapshot:null,reason:'INVALID_SNAPSHOT_ENVELOPE'});
  const {digest,...payload}=envelope;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(digest!==expected) return Object.freeze({status:'REJECTED',snapshot:null,reason:'DIGEST_MISMATCH'});
  if(envelope.sourceDigest!==envelope.seal.digest) return Object.freeze({status:'REJECTED',snapshot:null,reason:'SOURCE_DIGEST_MISMATCH'});
  const snapshot=Object.freeze({version:envelope.version,kind:envelope.kind,protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,seal:freezeSeal(envelope.seal)});
  return Object.freeze({status:'IMPORTED_VERIFIED',snapshot,verification:Object.freeze({valid:true,evidenceClass:EVIDENCE_CLASS})});
}
