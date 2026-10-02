import { createHash } from 'node:crypto';
import { verifyVerifiedAnchorArchiveRegistrySeal } from './evidence-provenance-verified-anchor-archive-registry-seal.mjs';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
const VERSION='m60-v1';
const KIND='GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY_SEAL';

function reject(reason,failedStage){return Object.freeze({status:'REJECTED',seal:null,reason,failedStage,evidenceClass:EVIDENCE_CLASS});}
function freezeEntry(e){return Object.freeze({...e,archive:Object.freeze({...e.archive,seal:Object.freeze({...e.archive?.seal})})});}
function validEntry(e={}){const a=e.archive;return !!e.digest&&!!e.sourceDigest&&e.protocol===PROTOCOL&&e.evidenceClass===EVIDENCE_CLASS&&a?.digest===e.digest&&a?.sourceDigest===e.sourceDigest&&a?.protocol===PROTOCOL&&a?.evidenceClass===EVIDENCE_CLASS&&a?.sourceDigest===a?.seal?.digest&&a?.seal?.evidenceClass===EVIDENCE_CLASS;}

export function importVerifiedAnchorArchiveRegistrySeal(seal={}){
 if(seal?.version!==VERSION||seal?.kind!==KIND||seal?.protocol!==PROTOCOL||seal?.evidenceClass!==EVIDENCE_CLASS||!Array.isArray(seal.entries)||seal.entryCount!==seal.entries.length||!seal.digest)return reject('INVALID_ARCHIVE_REGISTRY_SEAL','M61_STRUCTURE');
 if(!seal.entries.every(validEntry)||new Set(seal.entries.map(e=>e.digest)).size!==seal.entries.length)return reject('INVALID_ARCHIVE_REGISTRY_ENTRIES','M61_ENTRIES');
 const canonical=[...seal.entries].sort((a,b)=>a.digest.localeCompare(b.digest));
 if(JSON.stringify(canonical)!==JSON.stringify(seal.entries))return reject('NON_CANONICAL_ENTRY_ORDER','M61_CANONICAL');
 const {digest,...payload}=seal;const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 if(digest!==expected)return reject('DIGEST_MISMATCH','M61_DIGEST');
 const verified=verifyVerifiedAnchorArchiveRegistrySeal(seal);
 if(verified.valid!==true)return reject(verified.reason??'INDEPENDENT_VERIFICATION_FAILED','M61_VERIFY');
 const reconstructed=Object.freeze({...seal,entries:Object.freeze(seal.entries.map(freezeEntry))});
 return Object.freeze({status:'IMPORTED_VERIFIED',seal:reconstructed,digest,evidenceClass:EVIDENCE_CLASS,stages:Object.freeze({M61_STRUCTURE:'PASS',M61_ENTRIES:'PASS',M61_CANONICAL:'PASS',M61_DIGEST:'PASS',M61_VERIFY:'PASS'})});
}
