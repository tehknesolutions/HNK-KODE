import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function freezeSnapshot(snapshot={}) {
  return Object.freeze({...snapshot,seal:Object.freeze({...snapshot.seal,entries:Object.freeze((snapshot.seal?.entries??[]).map(e=>Object.freeze({...e})))})});
}

export function importSealedSnapshotAnchor(anchor={}) {
  if(anchor?.version!=='m49-v1' || anchor?.kind!=='GOODLE_SEALED_REGISTRY_SNAPSHOT_ANCHOR' || anchor?.protocol!==PROTOCOL || anchor?.evidenceClass!==EVIDENCE_CLASS || !anchor.snapshot || !anchor.snapshotDigest || !anchor.sealDigest || !anchor.digest) return Object.freeze({status:'REJECTED',anchor:null,reason:'INVALID_ANCHOR'});
  if(anchor.snapshot.evidenceClass!==EVIDENCE_CLASS) return Object.freeze({status:'REJECTED',anchor:null,reason:'INVALID_SNAPSHOT_EVIDENCE_CLASS'});
  if(anchor.snapshotDigest!==anchor.snapshotDigest || anchor.snapshot.seal?.digest!==anchor.sealDigest) return Object.freeze({status:'REJECTED',anchor:null,reason:'SEAL_DIGEST_MISMATCH'});
  const {digest,...payload}=anchor;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(digest!==expected) return Object.freeze({status:'REJECTED',anchor:null,reason:'DIGEST_MISMATCH'});
  if(anchor.snapshotDigest !== anchor.snapshotDigest) return Object.freeze({status:'REJECTED',anchor:null,reason:'SNAPSHOT_DIGEST_MISMATCH'});
  const imported=Object.freeze({...anchor,snapshot:freezeSnapshot(anchor.snapshot)});
  return Object.freeze({status:'IMPORTED_VERIFIED',anchor:imported,verification:Object.freeze({valid:true,evidenceClass:EVIDENCE_CLASS})});
}
