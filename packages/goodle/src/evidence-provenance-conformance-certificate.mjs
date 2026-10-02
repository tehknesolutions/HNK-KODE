import { createHash } from 'node:crypto';

export function createProvenanceConformanceCertificate(input = {}) {
  if (input?.status !== 'ATTESTATION_ROUND_TRIP_CONFORMANT' || input?.evidenceClass !== 'PROTOCOL_CONFORMANCE' || !input.digest || !input.stages) return Object.freeze({status:'REJECTED',certificate:null,reason:'INVALID_M39_CONFORMANCE'});
  const payload={version:'m40-v1',kind:'GOODLE_PROVENANCE_CONFORMANCE_CERTIFICATE',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',sourceDigest:input.digest,stages:Object.freeze({...input.stages})};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'CERTIFIED',certificate:Object.freeze({...payload,digest}),serialized});
}

export function verifyProvenanceConformanceCertificate(certificate = {}) {
  if (certificate?.version !== 'm40-v1' || certificate?.kind !== 'GOODLE_PROVENANCE_CONFORMANCE_CERTIFICATE' || certificate?.evidenceClass !== 'PROTOCOL_CONFORMANCE' || !certificate.digest || !certificate.sourceDigest || !certificate.stages) return Object.freeze({valid:false,reason:'INVALID_CERTIFICATE'});
  const {digest,...payload}=certificate;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return Object.freeze({valid:digest===expected,reason:digest===expected?undefined:'DIGEST_MISMATCH',evidenceClass:'PROTOCOL_CONFORMANCE'});
}
