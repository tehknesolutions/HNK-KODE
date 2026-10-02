import test from 'node:test';
import assert from 'node:assert/strict';
import { runProvenanceConformanceCertificateRoundTrip } from '../src/evidence-provenance-conformance-certificate-roundtrip.mjs';

const input={status:'ATTESTATION_ROUND_TRIP_CONFORMANT',stages:{M37:'PASS',M38:'PASS'},digest:'m39-m42',evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M42.1/M42.2/M42.3 completes M40→M41 round trip',()=>{const r=runProvenanceConformanceCertificateRoundTrip(input);assert.equal(r.status,'CERTIFICATE_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M40:'PASS',M41:'PASS'});});
test('M42.4 is deterministic',()=>{const a=runProvenanceConformanceCertificateRoundTrip(input);const b=runProvenanceConformanceCertificateRoundTrip(input);assert.deepEqual(a,b);});
test('M42.4 classifies invalid source at M40 creation',()=>{const r=runProvenanceConformanceCertificateRoundTrip({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M40_CREATE');});
test('M42.4 preserves protocol-conformance boundary',()=>{const r=runProvenanceConformanceCertificateRoundTrip(input);assert.equal(r.certificate.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M42.5 result and nested stages are immutable',()=>{const r=runProvenanceConformanceCertificateRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.certificate));});
