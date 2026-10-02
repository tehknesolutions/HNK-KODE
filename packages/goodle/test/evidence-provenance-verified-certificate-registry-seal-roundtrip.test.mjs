import test from 'node:test';
import assert from 'node:assert/strict';
import { createCertificateRegistrySealRoundTrip } from '../src/evidence-provenance-verified-certificate-registry-seal-roundtrip.mjs';

const entry=(digest,sourceDigest)=>Object.freeze({digest,sourceDigest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',stages:Object.freeze({M37:'PASS',M38:'PASS'}),certificate:Object.freeze({digest,sourceDigest,evidenceClass:'PROTOCOL_CONFORMANCE'})});
const snapshot={evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b','src-b'),entry('a','src-a')]};

test('M46.1/M46.2/M46.3 completes M44→M45 seal round trip',()=>{const r=createCertificateRegistrySealRoundTrip(snapshot);assert.equal(r.status,'REGISTRY_SEAL_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M44:'PASS',M45:'PASS'});});
test('M46.4 is deterministic and canonical',()=>{const a=createCertificateRegistrySealRoundTrip(snapshot);const b=createCertificateRegistrySealRoundTrip({...snapshot,entries:[...snapshot.entries].reverse()});assert.deepEqual(a,b);assert.equal(a.seal.entries[0].digest,'a');});
test('M46.4 classifies invalid registry at M44 creation',()=>{const r=createCertificateRegistrySealRoundTrip({evidenceClass:'EXECUTION_EVIDENCE',entries:[]});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M44_CREATE');});
test('M46.4 preserves protocol-conformance boundary',()=>{const r=createCertificateRegistrySealRoundTrip(snapshot);assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.seal.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M46.5 result, seal and stages are immutable',()=>{const r=createCertificateRegistrySealRoundTrip(snapshot);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));});
