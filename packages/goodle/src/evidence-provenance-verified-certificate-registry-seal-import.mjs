import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function validEntry(entry={}) { return !!entry.digest && !!entry.sourceDigest && entry.protocol===PROTOCOL && entry.evidenceClass===EVIDENCE_CLASS; }
function freezeEntry(entry) { return Object.freeze({...entry,stages:Object.freeze({...entry.stages}),certificate:Object.freeze({...entry.certificate})}); }
function canonicalEntries(entries=[]) { return [...entries].sort((a,b)=>a.digest.localeCompare(b.digest)).map(freezeEntry); }

export function importCertificateRegistrySeal(seal={}) {
  if(seal?.version!=='m44-v1' || seal?.kind!=='GOODLE_VERIFIED_CERTIFICATE_REGISTRY_SEAL' || seal?.protocol!==PROTOCOL || seal?.evidenceClass!==EVIDENCE_CLASS || !Array.isArray(seal.entries) || !seal.digest) return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_REGISTRY_SEAL'});
  if(seal.entryCount!==seal.entries.length) return Object.freeze({status:'REJECTED',seal:null,reason:'ENTRY_COUNT_MISMATCH'});
  if(!seal.entries.every(validEntry) || new Set(seal.entries.map(x=>x.digest)).size!==seal.entries.length) return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_REGISTRY_ENTRIES'});
  const entries=canonicalEntries(seal.entries);
  if(JSON.stringify(entries)!==JSON.stringify(seal.entries)) return Object.freeze({status:'REJECTED',seal:null,reason:'NON_CANONICAL_ENTRY_ORDER'});
  const {digest,...payload}=seal;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(digest!==expected) return Object.freeze({status:'REJECTED',seal:null,reason:'DIGEST_MISMATCH'});
  const imported=Object.freeze({...payload,entries:Object.freeze(entries),digest});
  return Object.freeze({status:'IMPORTED_VERIFIED',seal:imported,verification:Object.freeze({valid:true,evidenceClass:EVIDENCE_CLASS})});
}
