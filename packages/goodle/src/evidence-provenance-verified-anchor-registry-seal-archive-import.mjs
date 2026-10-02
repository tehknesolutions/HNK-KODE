import { createHash } from 'node:crypto';
import { verifyVerifiedAnchorRegistrySeal } from './evidence-provenance-verified-anchor-registry-seal.mjs';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
const VERSION='m56-v1';
const KIND='GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL_ARCHIVE';

function reject(reason, failedStage){return Object.freeze({status:'REJECTED',archive:null,seal:null,reason,failedStage,evidenceClass:EVIDENCE_CLASS});}
function freezeSeal(seal={}){return Object.freeze({...seal,entries:Object.freeze((seal.entries??[]).map(e=>Object.freeze({...e,anchor:e.anchor?Object.freeze({...e.anchor}):e.anchor}))) });}
export function importVerifiedAnchorRegistrySealArchive(archive={}){
  if(archive?.version!==VERSION||archive?.kind!==KIND||archive?.protocol!==PROTOCOL||archive?.evidenceClass!==EVIDENCE_CLASS||!archive?.seal||!archive?.digest)return reject('INVALID_ARCHIVE','M57_STRUCTURE');
  const {digest,...payload}=archive;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(digest!==expected)return reject('ARCHIVE_DIGEST_MISMATCH','M57_DIGEST');
  if(payload.sourceDigest!==payload.seal?.digest)return reject('SOURCE_DIGEST_MISMATCH','M57_BINDING');
  const verified=verifyVerifiedAnchorRegistrySeal(payload.seal);
  if(verified.valid!==true)return reject(verified.reason??'INVALID_EMBEDDED_SEAL','M57_SEAL');
  if(verified.evidenceClass!==EVIDENCE_CLASS||payload.seal.evidenceClass!==EVIDENCE_CLASS)return reject('EVIDENCE_CLASS_PROMOTION','M57_BOUNDARY');
  const seal=freezeSeal(payload.seal);
  const reconstructed=Object.freeze({...payload,digest,seal});
  return Object.freeze({status:'IMPORTED_VERIFIED',archive:reconstructed,seal,sourceDigest:payload.sourceDigest,evidenceClass:EVIDENCE_CLASS,stages:Object.freeze({M57_STRUCTURE:'PASS',M57_DIGEST:'PASS',M57_BINDING:'PASS',M57_SEAL:'PASS',M57_BOUNDARY:'PASS'})});
}
