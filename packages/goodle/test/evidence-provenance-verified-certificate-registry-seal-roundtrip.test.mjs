import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyCertificateRegistrySealRoundTrip } from '../src/evidence-provenance-verified-certificate-registry-seal-roundtrip.mjs';

const entry=(digest,sourceDigest)=>Object.freeze({digest,sourceDigest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',stages:Object.freeze({M37:'PASS',M38:'PASS'}),certificate:Object.freeze({digest,sourceDigest,evidenceClass:'PROTOCOL_CONFORMANCE'})});
const snapshot={evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b','src-b'),entry('a','src-a')]};

test('M45.1/M45.2 seals a valid M43 snapshot through M44',()=>{const r=verifyCertificateRegistrySealRoundTrip(snapshot);assert.equal(r.status,'CERTIFICATE_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT');assert.equal(r.entryCount,2);assert.equal(r.certificateDigests[0],'a');assert.equal(r.certificateDigests[1],'b');});
test('M45.3 independently verifies the M44 seal',()=>{const r=verifyCertificateRegistrySealRoundTrip(snapshot);assert.equal(r.stages.M44_VERIFY,'PASS');assert.ok(r.registryDigest);});
test('M45.4 proves semantic equivalence and deterministic canonical ordering',()=>{const a=verifyCertificateRegistrySealRoundTrip(snapshot);const b=verifyCertificateRegistrySealRoundTrip({...snapshot,entries:[...snapshot.entries].reverse()});assert.deepEqual(a,b);assert.equal(a.stages.M45_EQUIVALENCE,'PASS');});
test('M45.4 classifies invalid registry at M44 seal stage',()=>{const r=verifyCertificateRegistrySealRoundTrip({evidenceClass:'EXECUTION_EVIDENCE',entries:[]});assert.equal(r.status,'CERTIFICATE_REGISTRY_SEAL_ROUND_TRIP_REJECTED');assert.equal(r.failedStage,'M44_SEAL');assert.equal(r.reason,'INVALID_REGISTRY_SNAPSHOT');});
test('M45.5 preserves protocol-conformance boundary',()=>{const r=verifyCertificateRegistrySealRoundTrip(snapshot);assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.seal.evidenceClass,'PROTOCOL_CONFORMANCE');assert.notEqual(r.evidenceClass,'EXECUTION_EVIDENCE');});
test('M45.5 result, stages and seal are immutable',()=>{const r=verifyCertificateRegistrySealRoundTrip(snapshot);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.seal));});
