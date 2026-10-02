import test from 'node:test';
import assert from 'node:assert/strict';
import { createConformanceAttestation, verifyConformanceAttestation } from '../src/evidence-provenance-conformance-attestation.mjs';

const input={status:'CONFORMANT_ROUND_TRIP',stages:{M34:'PASS',M35:'PASS'},digest:'bundle-37'};
test('M37.1/M37.2 creates deterministic attestation',()=>{const a=createConformanceAttestation(input);const b=createConformanceAttestation(input);assert.equal(a.status,'ATTESTED');assert.equal(a.serialized,b.serialized);assert.equal(a.manifest.digest,b.manifest.digest);});
test('M37.3 verifies attestation integrity',()=>{const r=createConformanceAttestation(input);assert.equal(verifyConformanceAttestation(r.manifest).valid,true);});
test('M37.4 fixes evidence class to protocol conformance',()=>{const r=createConformanceAttestation(input);assert.equal(r.manifest.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(verifyConformanceAttestation({...r.manifest,evidenceClass:'EXECUTION_EVIDENCE'}).valid,false);});
test('M37.4 rejects non-conformant input',()=>{assert.equal(createConformanceAttestation({status:'REJECTED'}).status,'REJECTED');});
test('M37.5 manifest is immutable',()=>{const r=createConformanceAttestation(input);assert.ok(Object.isFrozen(r.manifest));});
