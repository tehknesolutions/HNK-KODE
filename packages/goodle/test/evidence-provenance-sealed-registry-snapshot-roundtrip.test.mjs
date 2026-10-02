import test from 'node:test';
import assert from 'node:assert/strict';
import { runSealedRegistrySnapshotRoundTrip } from '../src/evidence-provenance-sealed-registry-snapshot-roundtrip.mjs';

const seal={version:'m44-v1',kind:'GOODLE_VERIFIED_CERTIFICATE_REGISTRY_SEAL',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:0,entries:[],digest:'seal-48'};
const input={status:'REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',stages:{M44:'PASS',M45:'PASS'},seal,evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M48.1/M48.2/M48.3 completes M47 export/import round trip',()=>{const r=runSealedRegistrySnapshotRoundTrip(input);assert.equal(r.status,'SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M47_EXPORT:'PASS',M47_IMPORT:'PASS'});});
test('M48.4 is deterministic',()=>{const a=runSealedRegistrySnapshotRoundTrip(input);const b=runSealedRegistrySnapshotRoundTrip(input);assert.deepEqual(a,b);});
test('M48.4 classifies invalid source at M47 export',()=>{const r=runSealedRegistrySnapshotRoundTrip({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M47_EXPORT');});
test('M48.4 preserves protocol-conformance boundary',()=>{const r=runSealedRegistrySnapshotRoundTrip(input);assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.snapshot.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M48.5 result and snapshot are immutable',()=>{const r=runSealedRegistrySnapshotRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.snapshot));});
