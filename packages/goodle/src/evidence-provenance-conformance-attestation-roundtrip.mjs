import { createConformanceAttestation } from './evidence-provenance-conformance-attestation.mjs';
import { importConformanceAttestation } from './evidence-provenance-conformance-attestation-import.mjs';

export function runConformanceAttestationRoundTrip(input = {}, metadata = {}) {
  const created=createConformanceAttestation(input,metadata);
  if(created.status!=='ATTESTED') return Object.freeze({status:'REJECTED',failedStage:'M37_CREATE',reason:created.reason ?? 'ATTESTATION_CREATE_FAILED'});
  const imported=importConformanceAttestation(JSON.parse(created.serialized));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M38_IMPORT',reason:imported.reason ?? 'ATTESTATION_IMPORT_FAILED'});
  const equivalent=JSON.stringify(created.manifest)===JSON.stringify(imported.manifest);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M39_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'ATTESTATION_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M37:'PASS',M38:'PASS'}),digest:created.manifest.digest,manifest:imported.manifest,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
