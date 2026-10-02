import { createProvenanceConformanceCertificate } from './evidence-provenance-conformance-certificate.mjs';
import { importProvenanceConformanceCertificate } from './evidence-provenance-conformance-certificate-import.mjs';

function reject(reason, stage) {
  return Object.freeze({status:'CERTIFICATE_ROUND_TRIP_REJECTED',reason,stage,evidenceClass:'PROTOCOL_CONFORMANCE'});
}

export function verifyProvenanceCertificateRoundTrip(m39 = {}) {
  const created=createProvenanceConformanceCertificate(m39);
  if (created.status !== 'CERTIFIED' || !created.certificate) return reject(created.reason ?? 'M40_CERTIFICATE_CREATION_FAILED','M40');

  const imported=importProvenanceConformanceCertificate(created.certificate);
  if (imported.status !== 'IMPORTED_VERIFIED' || !imported.certificate || imported.verification?.valid !== true) return reject(imported.reason ?? 'M41_IMPORT_VERIFICATION_FAILED','M41');

  const source=created.certificate;
  const roundTrip=imported.certificate;
  if (roundTrip.evidenceClass !== 'PROTOCOL_CONFORMANCE') return reject('EVIDENCE_CLASS_MISMATCH','M42');
  if (roundTrip.digest !== source.digest) return reject('CERTIFICATE_DIGEST_MISMATCH','M42');
  if (roundTrip.sourceDigest !== source.sourceDigest) return reject('SOURCE_DIGEST_MISMATCH','M42');
  if (roundTrip.protocol !== source.protocol) return reject('PROTOCOL_MISMATCH','M42');
  if (JSON.stringify(roundTrip.stages) !== JSON.stringify(source.stages)) return reject('STAGE_SNAPSHOT_MISMATCH','M42');

  return Object.freeze({
    status:'CERTIFICATE_ROUND_TRIP_CONFORMANT',
    evidenceClass:'PROTOCOL_CONFORMANCE',
    digest:roundTrip.digest,
    sourceDigest:roundTrip.sourceDigest,
    protocol:roundTrip.protocol,
    stages:Object.freeze({...roundTrip.stages}),
    certificate:roundTrip,
    verification:Object.freeze({valid:true,executionEvidence:false})
  });
}
