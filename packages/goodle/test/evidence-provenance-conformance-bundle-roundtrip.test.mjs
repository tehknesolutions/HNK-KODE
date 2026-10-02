import test from 'node:test';
import assert from 'node:assert/strict';
import { runConformanceBundleRoundTrip } from '../src/evidence-provenance-conformance-bundle-roundtrip.mjs';

const input={status:'CONFORMANT',stages:{M30:'PASS',M31:'PASS',M32:'PASS'},digest:'abc123'};
test('M36.1/M36.2/M36.3 completes M34→M35 round trip',()=>{const r=runConformanceBundleRoundTrip(input,{ledger:'M33'});assert.equal(r.status,'CONFORMANT_ROUND_TRIP');assert.deepEqual(r.stages,{M34:'PASS',M35:'PASS'});});
test('M36.4 is deterministic',()=>{const a=runConformanceBundleRoundTrip(input,{ledger:'M33'});const b=runConformanceBundleRoundTrip(input,{ledger:'M33'});assert.deepEqual(a,b);});
test('M36.4 classifies failed creation stage',()=>{const r=runConformanceBundleRoundTrip({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M34_CREATE');});
test('M36.5 result is immutable',()=>{const r=runConformanceBundleRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));});