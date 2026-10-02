import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

export function createSealedSnapshotAnchor(result={}) {
  if(result?.status!=='SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT' || result?.evidenceClass!==EVIDENCE_CLASS || !result?.snapshot || result.snapshot.evidenceClass!==EVIDENCE_CLASS || !result.digest || result.snapshot.seal?.digest!==result.snapshot.seal?.digest) return Object.freeze({status:'REJECTED',anchor:null,reason:'INVALID_M48_RESULT'});
  const canonical={version:'m49-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT_ANCHOR',protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,snapshotDigest:result.digest,sealDigest:result.snapshot.seal.digest,snapshot:result.snapshot};
  const digest=createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  const anchor=Object.freeze({...canonical,digest,snapshot:Object.freeze({...result.snapshot,seal:Object.freeze({...result.snapshot.seal,entries:Object.freeze([...(result.snapshot.seal.entries??[])].map(e=>Object.freeze({...e})))})})});
  return Object.freeze({status:'ANCHORED',anchor});
}
