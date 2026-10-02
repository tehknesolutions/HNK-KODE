import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate.mjs';
import { importProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate-import.mjs';

const m39={status:'ATTESTATION_ROUND_TRIP_CONFORMANT',evidenceClass:'PROTOCOL_CONFORMANCE',digest:'m39-digest',stages:{M29:'PASS',M30:'PASS',M31:'PASS',M32:'PASS',M33:'PASS',M34:'PASS',M35:'PASS',M36:'PASS',M37:'PASS',M38:'PASS',M39:'PASS'}};

test('M42.1/M42.2 creates M40 certificate from valid M39 and M41 imports it independently',()=>{
  const certified=createProvenanceConformanceCertificate(m39);
  assert.equal(certified.status,'CERTIFIED');
  assert.equal(certified.certificate.evidenceClass,'PROTOCOL_CONFORMANCE');
  const imported=importProvenanceConformanceCertificate(certified.certificate);
  assert.equal(imported.status,'IMPORTED_VERIFIED');
  assert.equal(imported.verification.valid,true);
  assert.equal(imported.certificate.digest,certified.certificate.digest);
  assert.equal(imported.certificate.sourceDigest,m39.digest);
  assert.deepEqual(imported.certificate.stages,certified.certificate.stages);
});

test('M42.1 rejects non-conformant M39 input at M40 boundary',()=>{
  const certified=createProvenanceConformanceCertificate({...m39,status:'REJECTED'});
  assert.equal(certified.status,'REJECTED');
  assert.equal(certified.reason,'INVALID_M39_CONFORMANCE');
});

test('M42 preserves protocol-conformance class and never promotes execution evidence',()=>{
  const certified=createProvenanceConformanceCertificate(m39);
  const imported=importProvenanceConformanceCertificate(certified.certificate);
  assert.equal(imported.certificate.evidenceClass,'PROTOCOL_CONFORMANCE');
  assert.notEqual(imported.certificate.evidenceClass,'EXECUTION_EVIDENCE');
});
