import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedAnchorRegistrySeal } from '../src/evidence-provenance-verified-anchor-registry-seal.mjs';
import { importVerifiedAnchorRegistrySeal } from '../src/evidence-provenance-verified-anchor-registry-seal-import.mjs';

const entry=(digest)=>({digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',anchor:{digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,evidenceClass:'PROTOCOL_CONFORMANCE'}});
const seal=createVerifiedAnchorRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b'),entry('a')]}).seal;

test('M54 imports and independently verifies a valid M53 seal',()=>{const r=importVerifiedAnchorRegistrySeal(seal);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M54 rejects non-canonical entry order',()=>{const r=importVerifiedAnchorRegistrySeal({...seal,entries:[...seal.entries].reverse()});assert.equal(r.reason,'NON_CANONICAL_ENTRY_ORDER');});
test('M54 rejects digest tampering',()=>{const r=importVerifiedAnchorRegistrySeal({...seal,digest:'tampered'});assert.equal(r.reason,'DIGEST_MISMATCH');});
test('M54 rejects protocol mutation',()=>{assert.equal(importVerifiedAnchorRegistrySeal({...seal,protocol:'MUTATED'}).status,'REJECTED');});
test('M54 rejects evidence-class promotion',()=>{assert.equal(importVerifiedAnchorRegistrySeal({...seal,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M54 preserves immutable imported seal and entries',()=>{const r=importVerifiedAnchorRegistrySeal(seal);assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(r.seal.entries.every(Object.isFrozen));});
test('M54 rejects malformed seal',()=>{assert.equal(importVerifiedAnchorRegistrySeal({version:'m53-v1'}).status,'REJECTED');});
