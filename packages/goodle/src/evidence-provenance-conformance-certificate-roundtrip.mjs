import { createProvenanceConformanceCertificate } from './evidence-provenance-conformance-certificate.mjs';
import { importProvenanceConformanceCertificate } from './evidence-provenance-conformance-certificate-import.mjs';

export function runProvenanceConformanceCertificateRoundTrip(input = {}) {
  const created=createProvenanceConformanceCertificate(input);
  if(created.status!=='CERTIFIED') return Object.freeze({status:'REJECTED',failedStage:'M40_CREATE',reason:created.reason ?? 'CERTIFICATE_CREATE_FAILED'});
  const imported=importProvenanceConformanceCertificate(JSON.parse(JSON.stringify(created.certificate)));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M41_IMPORT',reason:imported.reason ?? 'CERTIFICATE_IMPORT_FAILED'});
  const equivalent=JSON.stringify(created.certificate)===JSON.stringify(imported.certificate);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M42_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'CERTIFICATE_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M40:'PASS',M41:'PASS'}),digest:created.certificate.digest,certificate:imported.certificate,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
