import test from 'node:test';
import assert from 'node:assert/strict';
import { runSealedSnapshotAnchorRoundTrip } from '../src/evidence-provenance-sealed-snapshot-anchor-roundtrip.mjs';

const snapshot={version:'m46-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',seal:{digest:'seal-51',evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]}};
const input={status:'SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT',stages:{M47_EXPORT:'PASS',M47_IMPORT:'PASS'},snapshot,evidenceClass:'PROTOCOL_CONFORMANCE',digest:'snapshot-51'};

test('M51.1/M51.2/M51.3 completes M49→M50 anchor round trip',()=>{const r=runSealedSnapshotAnchorRoundTrip(input);assert.equal(r.status,'ANCHOR_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M49:'PASS',M50:'PASS'});});
test('M51.4 is deterministic',()=>{const a=runSealedSnapshotAnchorRoundTrip(input);const b=runSealedSnapshotAnchorRoundTrip(input);assert.deepEqual(a,b);});
test('M51.4 classifies invalid source at M49 creation',()=>{const r=runSealedSnapshotAnchorRoundTrip({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M49_CREATE');});
test('M51.4 preserves protocol-conformance boundary',()=>{const r=runSealedSnapshotAnchorRoundTrip(input);assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.anchor.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M51.5 result and anchor are immutable',()=>{const r=runSealedSnapshotAnchorRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.anchor));});
