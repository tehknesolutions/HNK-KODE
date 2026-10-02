import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function freezeEntry(entry) {
  return Object.freeze({...entry,stages:Object.freeze({...entry.stages}),certificate:Object.freeze({...entry.certificate})});
}

function canonicalEntries(entries = []) {
  return [...entries].sort((a,b)=>a.digest.localeCompare(b.digest)).map(freezeEntry);
}

function validEntry(entry = {}) {
  return !!entry.digest && !!entry.sourceDigest && entry.protocol===PROTOCOL && entry.evidenceClass===EVIDENCE_CLASS;
}

export function createCertificateRegistrySeal(snapshot = {}) {
  if(snapshot?.evidenceClass!==EVIDENCE_CLASS || !Array.isArray(snapshot.entries)) return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_REGISTRY_SNAPSHOT'});
  const entries=canonicalEntries(snapshot.entries);
  if(!entries.every(validEntry)) return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_REGISTRY_ENTRY'});
  if(new Set(entries.map(x=>x.digest)).size!==entries.length) return Object.freeze({status:'REJECTED',seal:null,reason:'DUPLICATE_OR_CONFLICTING_DIGEST'});
  const payload={version:'m44-v1',kind:'GOODLE_VERIFIED_CERTIFICATE_REGISTRY_SEAL',protocol:PROTOCOL,evidenceClass:EVIDENCE_CLASS,entryCount:entries.length,entries:Object.freeze(entries)};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'SEALED',seal:Object.freeze({...payload,digest}),serialized});
}

export function verifyCertificateRegistrySeal(seal = {}) {
  if(seal?.version!=='m44-v1' || seal?.kind!=='GOODLE_VERIFIED_CERTIFICATE_REGISTRY_SEAL' || seal?.protocol!==PROTOCOL || seal?.evidenceClass!==EVIDENCE_CLASS || !Array.isArray(seal.entries) || seal.entryCount!==seal.entries.length || !seal.digest) return Object.freeze({valid:false,reason:'INVALID_REGISTRY_SEAL'});
  if(!seal.entries.every(validEntry) || new Set(seal.entries.map(x=>x.digest)).size!==seal.entries.length) return Object.freeze({valid:false,reason:'INVALID_REGISTRY_ENTRIES'});
  const canonical=canonicalEntries(seal.entries);
  if(JSON.stringify(canonical)!==JSON.stringify(seal.entries)) return Object.freeze({valid:false,reason:'NON_CANONICAL_ENTRY_ORDER'});
  const {digest,...payload}=seal;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return Object.freeze({valid:digest===expected,reason:digest===expected?undefined:'DIGEST_MISMATCH',evidenceClass:EVIDENCE_CLASS});
}
