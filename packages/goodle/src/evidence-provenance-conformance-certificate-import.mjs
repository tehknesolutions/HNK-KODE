import { createHash } from 'node:crypto';

const PROTOCOL='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';

function validShape(certificate = {}) {
  return certificate?.version === 'm40-v1' && certificate?.kind === 'GOODLE_PROVENANCE_CONFORMANCE_CERTIFICATE' && certificate?.protocol === PROTOCOL && certificate?.evidenceClass === 'PROTOCOL_CONFORMANCE' && !!certificate.sourceDigest && !!certificate.stages && !!certificate.digest;
}

export function importProvenanceConformanceCertificate(certificate = {}) {
  if (!validShape(certificate)) return Object.freeze({status:'REJECTED',certificate:null,reason:'INVALID_CERTIFICATE_SHAPE'});
  const {digest,...payload}=certificate;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if (digest !== expected) return Object.freeze({status:'REJECTED',certificate:null,reason:'DIGEST_MISMATCH'});
  const imported=Object.freeze({version:certificate.version,kind:certificate.kind,protocol:PROTOCOL,evidenceClass:'PROTOCOL_CONFORMANCE',sourceDigest:certificate.sourceDigest,stages:Object.freeze({...certificate.stages}),digest});
  return Object.freeze({status:'IMPORTED_VERIFIED',certificate:imported,verification:Object.freeze({valid:true,evidenceClass:'PROTOCOL_CONFORMANCE'})});
}
