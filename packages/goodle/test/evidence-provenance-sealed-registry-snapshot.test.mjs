import test from 'node:test';
import assert from 'node:assert/strict';
import { exportSealedRegistrySnapshot, importSealedRegistrySnapshot } from '../src/evidence-provenance-sealed-registry-snapshot.mjs';

const seal={version:'m44-v1',kind:'GOODLE_VERIFIED_CERTIFICATE_REGISTRY_SEAL',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:0,entries:[],digest:'seal-47'};
const result={status:'REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',stages:{M44:'PASS',M45:'PASS'},seal,evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M47.1/M47.2 exports and deterministically imports a valid M46 result',()=>{const e=exportSealedRegistrySnapshot(result);assert.equal(e.status,'EXPORTED');const i=importSealedRegistrySnapshot(e.envelope);assert.equal(i.status,'IMPORTED_VERIFIED');assert.deepEqual(i.snapshot,e.snapshot);});
test('M47.2 export is deterministic',()=>{const a=exportSealedRegistrySnapshot(result);const b=exportSealedRegistrySnapshot(result);assert.equal(a.serialized,b.serialized);assert.equal(a.envelope.digest,b.envelope.digest);});
test('M47.3 rejects envelope digest tampering',()=>{const e=exportSealedRegistrySnapshot(result);assert.equal(importSealedRegistrySnapshot({...e.envelope,sourceDigest:'changed'}).status,'REJECTED');});
test('M47.4 rejects evidence promotion',()=>{assert.equal(exportSealedRegistrySnapshot({...result,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M47.4 rejects malformed source',()=>{const r=exportSealedRegistrySnapshot({status:'REJECTED'});assert.equal(r.status,'REJECTED');});
test('M47.5 reconstructed snapshot is immutable',()=>{const e=exportSealedRegistrySnapshot(result);const i=importSealedRegistrySnapshot(e.envelope);assert.ok(Object.isFrozen(i.snapshot));assert.ok(Object.isFrozen(i.snapshot.seal));});
