import { createHash } from 'node:crypto';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';
const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function freezeEntry(entry){return Object.freeze({...entry,anchor:Object.freeze({...entry.anchor})});}
function validEntry(e={}){return !!e.digest&&!!e.snapshotDigest&&!!e.sealDigest&&e.protocol===PROTOCOL&&e.evidenceClass===EVIDENCE_CLASS&&e.anchor?.digest===e.digest&&e.anchor?.evidenceClass===EVIDENCE_CLASS;}
function canonicalEntries(entries=[]){return entries.map(freezeEntry);}
export function importVerifiedAnchorRegistrySeal(seal={}) {
  if(seal?.version!=='m53-v1'||seal?.kind!=='GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL'||seal?.protocol!==PROTOCOL||seal?.evidenceClass!==EVIDENCE_CLASS||!Array.isArray(seal.entries)||seal.entryCount!==seal.entries.length||!seal.digest)return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_ANCHOR_REGISTRY_SEAL'});
  if(!seal.entries.every(validEntry)||new Set(seal.entries.map(x=>x.digest)).size!==seal.entries.length)return Object.freeze({status:'REJECTED',seal:null,reason:'INVALID_ANCHOR_REGISTRY_ENTRIES'});
  const sorted=[...seal.entries].sort((a,b)=>a.digest.localeCompare(b.digest));
  if(JSON.stringify(sorted)!==JSON.stringify(seal.entries))return Object.freeze({status:'REJECTED',seal:null,reason:'NON_CANONICAL_ENTRY_ORDER'});
  const {digest,...payload}=seal;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(digest!==expected)return Object.freeze({status:'REJECTED',seal:null,reason:'DIGEST_MISMATCH'});
  const imported=Object.freeze({...seal,entries:Object.freeze(canonicalEntries(seal.entries))});
  return Object.freeze({status:'IMPORTED_VERIFIED',seal:imported,verification:Object.freeze({valid:true,evidenceClass:EVIDENCE_CLASS})});
}
