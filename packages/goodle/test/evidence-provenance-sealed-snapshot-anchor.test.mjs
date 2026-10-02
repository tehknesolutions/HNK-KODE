import test from 'node:test';
import assert from 'node:assert/strict';
import { createSealedSnapshotAnchor } from '../src/evidence-provenance-sealed-snapshot-anchor.mjs';

const snapshot={version:'m46-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',seal:{digest:'seal-49',evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]}};
const input={status:'SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT',stages:{M47_EXPORT:'PASS',M47_IMPORT:'PASS'},snapshot,evidenceClass:'PROTOCOL_CONFORMANCE',digest:'snapshot-49'};

test('M49.1/M49.2 creates deterministic anchor from M48',()=>{const a=createSealedSnapshotAnchor(input);const b=createSealedSnapshotAnchor(input);assert.equal(a.status,'ANCHORED');assert.equal(a.anchor.digest,b.anchor.digest);assert.deepEqual(a,b);});
test('M49.3 identical snapshots are idempotent and changed snapshots get a different identity',()=>{const a=createSealedSnapshotAnchor(input);const changed=createSealedSnapshotAnchor({...input,digest:'snapshot-50'});assert.notEqual(a.anchor.digest,changed.anchor.digest);});
test('M49.3 rejects digest inconsistency',()=>{assert.equal(createSealedSnapshotAnchor({...input,digest:'other',snapshot:{...snapshot,seal:{...snapshot.seal,digest:'different'}}}).status,'REJECTED');});
test('M49.4 rejects evidence-class promotion',()=>{assert.equal(createSealedSnapshotAnchor({...input,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M49.4 anchor is immutable',()=>{const r=createSealedSnapshotAnchor(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.anchor));assert.ok(Object.isFrozen(r.anchor.snapshot));});
test('M49.5 rejects invalid M48 status',()=>{assert.equal(createSealedSnapshotAnchor({...input,status:'REJECTED'}).status,'REJECTED');});
