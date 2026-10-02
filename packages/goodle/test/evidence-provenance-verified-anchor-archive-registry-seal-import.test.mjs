import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { importVerifiedAnchorArchiveRegistrySeal } from '../src/evidence-provenance-verified-anchor-archive-registry-seal-import.mjs';

const protocol='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
const archiveSeal={digest:'seal-a',evidenceClass:'PROTOCOL_CONFORMANCE'};
const archive={digest:'archive-a',sourceDigest:'seal-a',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',seal:archiveSeal};
const entry={digest:'archive-a',sourceDigest:'seal-a',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',archive};
const payload={version:'m60-v1',kind:'GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY_SEAL',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:1,entries:[entry]};
const seal={...payload,digest:createHash('sha256').update(JSON.stringify(payload)).digest('hex')};

test('M61.1/M61.2 imports a structurally valid canonical M60 seal',()=>{const r=importVerifiedAnchorArchiveRegistrySeal(seal);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.stages.M61_STRUCTURE,'PASS');assert.equal(r.stages.M61_CANONICAL,'PASS');});
test('M61.3 independently verifies SHA-256',()=>{const r=importVerifiedAnchorArchiveRegistrySeal(seal);assert.equal(r.stages.M61_DIGEST,'PASS');assert.equal(r.digest,seal.digest);});
test('M61.4 rejects digest tampering',()=>{const r=importVerifiedAnchorArchiveRegistrySeal({...seal,digest:'0'.repeat(64)});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M61_DIGEST');});
test('M61.4 rejects evidence promotion',()=>{const r=importVerifiedAnchorArchiveRegistrySeal({...seal,evidenceClass:'EXECUTION_EVIDENCE'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M61_STRUCTURE');});
test('M61.4 rejects sourceDigest binding mutation',()=>{const badEntry={...entry,sourceDigest:'other'};const badPayload={...payload,entries:[badEntry]};const bad={...badPayload,digest:createHash('sha256').update(JSON.stringify(badPayload)).digest('hex')};const r=importVerifiedAnchorArchiveRegistrySeal(bad);assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M61_ENTRIES');});
test('M61.5 returns immutable verified reconstruction',()=>{const r=importVerifiedAnchorArchiveRegistrySeal(seal);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(Object.isFrozen(r.stages));assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');});
