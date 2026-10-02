import { verifyConformanceAttestation } from './evidence-provenance-conformance-attestation.mjs';

function validShape(manifest = {}) {
  return manifest?.version === 'm37-v1' && manifest?.kind === 'GOODLE_CONFORMANCE_ATTESTATION' && manifest?.evidenceClass === 'PROTOCOL_CONFORMANCE' && manifest?.protocol === 'M29-M30-M31-M32-M33-M34-M35-M36' && !!manifest.bundleDigest && !!manifest.stages && !!manifest.digest;
}

export function importConformanceAttestation(manifest = {}) {
  if (!validShape(manifest)) return Object.freeze({ status:'REJECTED', manifest:null, reason:'INVALID_ATTESTATION_SHAPE' });
  const verification=verifyConformanceAttestation(manifest);
  if (!verification.valid) return Object.freeze({ status:'REJECTED', manifest:null, reason:verification.reason });
  const imported=Object.freeze({version:manifest.version,kind:manifest.kind,evidenceClass:'PROTOCOL_CONFORMANCE',protocol:manifest.protocol,stages:Object.freeze({...manifest.stages}),bundleDigest:manifest.bundleDigest,ledger:manifest.ledger ?? null,digest:manifest.digest});
  return Object.freeze({status:'IMPORTED_VERIFIED',manifest:imported,verification});
}
