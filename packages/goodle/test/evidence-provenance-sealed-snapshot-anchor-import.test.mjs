import test from 'node:test';
import assert from 'node:assert/strict';
import { createSealedSnapshotAnchor } from '../src/evidence-provenance-sealed-snapshot-anchor.mjs';
import { importSealedSnapshotAnchor } from '../src/evidence-provenance-sealed-snapshot-anchor-import.mjs';

const snapshot={version:'m46-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',seal:{digest:'seal-50',evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]}};
const input={status:'SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT',stages:{M47_EXPORT:'PASS',M47_IMPORT:'PASS'},snapshot,evidenceClass:'PROTOCOL_CONFORMANCE',digest:'snapshot-50'};
const anchor=createSealedSnapshotAnchor(input).anchor;

test('M50.1/M50.3 imports and independently verifies a valid M49 anchor',()=>{const r=importSealedSnapshotAnchor(anchor);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M50.2 rejects protocol mutation',()=>{assert.equal(importSealedSnapshotAnchor({...anchor,protocol:'M29-M40'}).status,'REJECTED');});
test('M50.3 rejects anchor digest tampering',()=>{assert.equal(importSealedSnapshotAnchor({...anchor,digest:'tampered'}).reason,'DIGEST_MISMATCH');});
test('M50.4 rejects snapshot/seal binding mutation',()=>{assert.equal(importSealedSnapshotAnchor({...anchor,sealDigest:'different'}).reason,'SEAL_DIGEST_MISMATCH');});
test('M50.4 rejects evidence-class promotion',()=>{assert.equal(importSealedSnapshotAnchor({...anchor,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M50.4 preserves immutable imported anchor',()=>{const r=importSealedSnapshotAnchor(anchor);assert.ok(Object.isFrozen(r.anchor));assert.ok(Object.isFrozen(r.anchor.snapshot));});
test('M50.5 rejects malformed anchor',()=>{assert.equal(importSealedSnapshotAnchor({version:'m49-v1'}).status,'REJECTED');});
