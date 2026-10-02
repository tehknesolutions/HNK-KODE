import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function freezeSeal(seal){return Object.freeze({...seal,entries:Object.freeze((seal.entries??[]).map(e=>Object.freeze({...e,anchor:e.anchor?Object.freeze({...e.anchor}):e.anchor})))});}
export function exportVerifiedAnchorRegistrySealArchive(result={}) {
  if(result?.status!=='ANCHOR_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT'||result?.evidenceClass!==EVIDENCE_CLASS||result?.seal?.evidenceClass!==EVIDENCE_CLASS||!result.seal.digest||result.seal.protocol!==PROTOCOL)return Object.freeze({status:'REJECTED',archive:null,reason:'INVALID_M55_RESULT'});
  const seal=freezeSeal(result.seal);
  const payload={version:'m56-v1',kind:'GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL_ARCHIVE',protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,sourceDigest:seal.digest,seal};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'EXPORTED',archive:Object.freeze({...payload,digest}),serialized});
}
