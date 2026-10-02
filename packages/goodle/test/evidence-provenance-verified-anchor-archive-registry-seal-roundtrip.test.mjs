import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { runVerifiedAnchorArchiveRegistrySealRoundTrip } from '../src/evidence-provenance-verified-anchor-archive-registry-seal-roundtrip.mjs';

const protocol='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
const archiveSeal={digest:'seal-a',evidenceClass:'PROTOCOL_CONFORMANCE'};
const archive={digest:'archive-a',sourceDigest:'seal-a',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',seal:archiveSeal};
const entry={digest:'archive-a',sourceDigest:'seal-a',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',archive};
const payload={version:'m60-v1',kind:'GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY_SEAL',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',entryCount:1,entries:[entry]};
const seal={...payload,digest:createHash('sha256').update(JSON.stringify(payload)).digest('hex')};

test('M62.1-M62.3 closes M60 through independent M61 import',()=>{const r=runVerifiedAnchorArchiveRegistrySealRoundTrip(seal);assert.equal(r.status,'ANCHOR_ARCHIVE_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M60:'PASS',M61:'PASS',M62:'PASS'});});
test('M62.4 preserves exact seal semantics and digest',()=>{const r=runVerifiedAnchorArchiveRegistrySealRoundTrip(seal);assert.deepEqual(r.seal,seal);assert.equal(r.digest,seal.digest);assert.deepEqual(r.archiveDigests,['archive-a']);});
test('M62.4 rejects invalid M60 input deterministically',()=>{const r=runVerifiedAnchorArchiveRegistrySealRoundTrip({...seal,evidenceClass:'EXECUTION_EVIDENCE'});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M62_INPUT');});
test('M62.4 propagates independent M61 tamper rejection',()=>{const r=runVerifiedAnchorArchiveRegistrySealRoundTrip({...seal,digest:'0'.repeat(64)});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M61_IMPORT');});
test('M62.5 preserves immutable protocol-conformance boundary',()=>{const r=runVerifiedAnchorArchiveRegistrySealRoundTrip(seal);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.notEqual(r.evidenceClass,'EXECUTION_EVIDENCE');});
