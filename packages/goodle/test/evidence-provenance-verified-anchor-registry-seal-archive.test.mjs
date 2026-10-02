import test from 'node:test';
import assert from 'node:assert/strict';
import { exportVerifiedAnchorRegistrySealArchive } from '../src/evidence-provenance-verified-anchor-registry-seal-archive.mjs';

const seal={version:'m53-v1',kind:'GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:0,entries:[],digest:'seal-56'};
const input={status:'ANCHOR_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',stages:{M53:'PASS',M54:'PASS'},seal,evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M56.1/M56.2 exports a valid M55 seal deterministically',()=>{const a=exportVerifiedAnchorRegistrySealArchive(input);const b=exportVerifiedAnchorRegistrySealArchive(input);assert.equal(a.status,'EXPORTED');assert.equal(a.serialized,b.serialized);assert.equal(a.archive.digest,b.archive.digest);});
test('M56.3 binds archive sourceDigest to M55 seal digest',()=>{const r=exportVerifiedAnchorRegistrySealArchive(input);assert.equal(r.archive.sourceDigest,'seal-56');});
test('M56.4 rejects invalid M55 state',()=>{assert.equal(exportVerifiedAnchorRegistrySealArchive({status:'REJECTED'}).status,'REJECTED');});
test('M56.4 rejects evidence promotion',()=>{assert.equal(exportVerifiedAnchorRegistrySealArchive({...input,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M56.5 archive and payload are immutable',()=>{const r=exportVerifiedAnchorRegistrySealArchive(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.archive));assert.ok(Object.isFrozen(r.archive.seal));});
