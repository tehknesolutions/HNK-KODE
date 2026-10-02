import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate.mjs';
import { importProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate-import.mjs';
import { verifyProvenanceCertificateRoundTrip } from '../src/evidence-provenance-certificate-roundtrip.mjs';

const m39={status:'ATTESTATION_ROUND_TRIP_CONFORMANT',evidenceClass:'PROTOCOL_CONFORMANCE',digest:'m39-digest',stages:{M29:'PASS',M30:'PASS',M31:'PASS',M32:'PASS',M33:'PASS',M34:'PASS',M35:'PASS',M36:'PASS',M37:'PASS',M38:'PASS',M39:'PASS'}};

test('M42.1/M42.2 creates M40 certificate from valid M39 and M41 imports it independently',()=>{
  const certified=createProvenanceConformanceCertificate(m39);
  assert.equal(certified.status,'CERTIFIED');
  const imported=importProvenanceConformanceCertificate(certified.certificate);
  assert.equal(imported.status,'IMPORTED_VERIFIED');
  assert.equal(imported.verification.valid,true);
  assert.equal(imported.certificate.digest,certified.certificate.digest);
  assert.equal(imported.certificate.sourceDigest,m39.digest);
  assert.deepEqual(imported.certificate.stages,certified.certificate.stages);
});

test('M42.3/M42.4 closes the certificate round trip with semantic equivalence',()=>{
  const result=verifyProvenanceCertificateRoundTrip(m39);
  assert.equal(result.status,'CERTIFICATE_ROUND_TRIP_CONFORMANT');
  assert.equal(result.evidenceClass,'PROTOCOL_CONFORMANCE');
  assert.equal(result.sourceDigest,m39.digest);
  assert.deepEqual(result.stages,m39.stages);
  assert.equal(result.verification.valid,true);
  assert.equal(result.verification.executionEvidence,false);
});

test('M42 classifies invalid M39 deterministically at M40',()=>{
  const result=verifyProvenanceCertificateRoundTrip({...m39,status:'REJECTED'});
  assert.equal(result.status,'CERTIFICATE_ROUND_TRIP_REJECTED');
  assert.equal(result.stage,'M40');
  assert.equal(result.reason,'INVALID_M39_CONFORMANCE');
});

test('M42 preserves protocol-conformance class and never promotes execution evidence',()=>{
  const result=verifyProvenanceCertificateRoundTrip(m39);
  assert.equal(result.evidenceClass,'PROTOCOL_CONFORMANCE');
  assert.notEqual(result.evidenceClass,'EXECUTION_EVIDENCE');
  assert.equal(result.verification.executionEvidence,false);
});
