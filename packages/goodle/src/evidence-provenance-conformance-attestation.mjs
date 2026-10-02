import { createHash } from 'node:crypto';

export function createConformanceAttestation(roundTrip = {}, metadata = {}) {
  if (roundTrip?.status !== 'CONFORMANT_ROUND_TRIP' || !roundTrip.digest || !roundTrip.stages) return Object.freeze({ status:'REJECTED', manifest:null, reason:'NON_CONFORMANT_ROUND_TRIP' });
  const payload={version:'m37-v1',kind:'GOODLE_CONFORMANCE_ATTESTATION',evidenceClass:'PROTOCOL_CONFORMANCE',protocol:'M29-M30-M31-M32-M33-M34-M35-M36',stages:{...roundTrip.stages},bundleDigest:roundTrip.digest,ledger:metadata.ledger ?? 'M36'};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'ATTESTED',manifest:Object.freeze({...payload,digest}),serialized});
}

export function verifyConformanceAttestation(manifest = {}) {
  if (manifest?.version !== 'm37-v1' || manifest?.kind !== 'GOODLE_CONFORMANCE_ATTESTATION' || manifest?.evidenceClass !== 'PROTOCOL_CONFORMANCE' || !manifest.digest) return Object.freeze({valid:false,reason:'INVALID_ATTESTATION'});
  const {digest,...payload}=manifest;
  const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return Object.freeze({valid:digest===expected,reason:digest===expected?undefined:'DIGEST_MISMATCH',evidenceClass:'PROTOCOL_CONFORMANCE'});
}
