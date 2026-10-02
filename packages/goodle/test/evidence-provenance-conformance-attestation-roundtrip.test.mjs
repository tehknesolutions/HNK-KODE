import test from 'node:test';
import assert from 'node:assert/strict';
import { runConformanceAttestationRoundTrip } from '../src/evidence-provenance-conformance-attestation-roundtrip.mjs';

const input={status:'CONFORMANT_ROUND_TRIP',stages:{M34:'PASS',M35:'PASS'},digest:'bundle-39'};

test('M39.1/M39.2/M39.3 completes M37→M38 round trip',()=>{const r=runConformanceAttestationRoundTrip(input,{ledger:'M36'});assert.equal(r.status,'ATTESTATION_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M37:'PASS',M38:'PASS'});});
test('M39.4 is deterministic',()=>{const a=runConformanceAttestationRoundTrip(input,{ledger:'M36'});const b=runConformanceAttestationRoundTrip(input,{ledger:'M36'});assert.deepEqual(a,b);});
test('M39.4 classifies failed creation',()=>{const r=runConformanceAttestationRoundTrip({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M37_CREATE');});
test('M39.4 preserves PROTOCOL_CONFORMANCE boundary',()=>{const r=runConformanceAttestationRoundTrip(input);assert.equal(r.manifest.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M39.5 result and stages are immutable',()=>{const r=runConformanceAttestationRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));});
