import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceCertificate, verifyProvenanceConformanceCertificate } from '../src/evidence-provenance-conformance-certificate.mjs';

const input={status:'ATTESTATION_ROUND_TRIP_CONFORMANT',stages:{M37:'PASS',M38:'PASS'},digest:'m39-digest',evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M40.1/M40.2 creates deterministic certificate',()=>{const a=createProvenanceConformanceCertificate(input);const b=createProvenanceConformanceCertificate(input);assert.equal(a.status,'CERTIFIED');assert.equal(a.serialized,b.serialized);assert.equal(a.certificate.digest,b.certificate.digest);});
test('M40.3 verifies certificate integrity',()=>{const r=createProvenanceConformanceCertificate(input);assert.equal(verifyProvenanceConformanceCertificate(r.certificate).valid,true);});
test('M40.3 rejects digest tampering',()=>{const r=createProvenanceConformanceCertificate(input);assert.equal(verifyProvenanceConformanceCertificate({...r.certificate,sourceDigest:'changed'}).valid,false);});
test('M40.4 fixes evidence class to protocol conformance',()=>{const r=createProvenanceConformanceCertificate(input);assert.equal(r.certificate.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(verifyProvenanceConformanceCertificate({...r.certificate,evidenceClass:'EXECUTION_EVIDENCE'}).valid,false);});
test('M40.4 rejects invalid M39 input',()=>{assert.equal(createProvenanceConformanceCertificate({status:'REJECTED'}).status,'REJECTED');});
test('M40.5 certificate snapshots are immutable',()=>{const r=createProvenanceConformanceCertificate(input);assert.ok(Object.isFrozen(r.certificate));assert.ok(Object.isFrozen(r.certificate.stages));});
