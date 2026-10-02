import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate.mjs';
import { importProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate-import.mjs';

const source={status:'ATTESTATION_ROUND_TRIP_CONFORMANT',stages:{M37:'PASS',M38:'PASS'},digest:'m39-m41',evidenceClass:'PROTOCOL_CONFORMANCE'};
const certificate=createProvenanceConformanceCertificate(source).certificate;

test('M41.1/M41.3 imports and independently verifies valid M40 certificate',()=>{const r=importProvenanceConformanceCertificate(certificate);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M41.2 rejects protocol mutation',()=>{const r=importProvenanceConformanceCertificate({...certificate,protocol:'M29-M40'});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'INVALID_CERTIFICATE_SHAPE');});
test('M41.3 rejects digest tampering',()=>{const r=importProvenanceConformanceCertificate({...certificate,sourceDigest:'changed'});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'DIGEST_MISMATCH');});
test('M41.4 rejects execution-evidence promotion',()=>{const r=importProvenanceConformanceCertificate({...certificate,evidenceClass:'EXECUTION_EVIDENCE'});assert.equal(r.status,'REJECTED');});
test('M41.4 preserves immutable source digest and stages',()=>{const r=importProvenanceConformanceCertificate(certificate);assert.equal(r.certificate.sourceDigest,certificate.sourceDigest);assert.deepEqual(r.certificate.stages,certificate.stages);assert.ok(Object.isFrozen(r.certificate));assert.ok(Object.isFrozen(r.certificate.stages));});
test('M41.5 rejects malformed certificate',()=>{assert.equal(importProvenanceConformanceCertificate({version:'m40-v1'}).status,'REJECTED');});
