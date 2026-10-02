import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedAnchorArchiveRegistry } from '../src/evidence-provenance-verified-anchor-archive-registry.mjs';

const archive={version:'m56-v1',kind:'GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL_ARCHIVE',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',sourceDigest:'seal-59',seal:{version:'m53-v1',kind:'GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:0,entries:[],digest:'seal-59'},digest:'archive-59'};
const result={status:'ANCHOR_REGISTRY_SEAL_ARCHIVE_ROUND_TRIP_CONFORMANT',stages:{M56:'PASS',M57:'PASS'},archive,evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M59 registers valid M58 archive by digest',()=>{const r=createVerifiedAnchorArchiveRegistry();const x=r.register(result);assert.equal(x.status,'REGISTERED');assert.equal(r.get('archive-59').digest,'archive-59');});
test('M59 identical registration is idempotent',()=>{const r=createVerifiedAnchorArchiveRegistry();r.register(result);assert.equal(r.register(result).status,'ALREADY_REGISTERED');});
test('M59 detects same-digest divergent content',()=>{const r=createVerifiedAnchorArchiveRegistry();r.register(result);assert.equal(r.register({...result,archive:{...archive,sourceDigest:'different'}}).status,'REGISTRY_CONFLICT');});
test('M59 rejects invalid and promoted evidence',()=>{const r=createVerifiedAnchorArchiveRegistry();assert.equal(r.register({status:'REJECTED'}).status,'REJECTED');assert.equal(r.register({...result,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M59 returns immutable lookup and snapshot',()=>{const r=createVerifiedAnchorArchiveRegistry();r.register(result);const e=r.get('archive-59');const s=r.snapshot();assert.ok(Object.isFrozen(e));assert.ok(Object.isFrozen(e.archive));assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.entries));});
