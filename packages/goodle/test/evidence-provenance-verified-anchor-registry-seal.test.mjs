import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedAnchorRegistrySeal, verifyVerifiedAnchorRegistrySeal } from '../src/evidence-provenance-verified-anchor-registry-seal.mjs';

const entry=(digest)=>Object.freeze({digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',anchor:Object.freeze({digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,evidenceClass:'PROTOCOL_CONFORMANCE'})});
const snapshot={evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b'),entry('a')]};

test('M53.1/M53.2 creates deterministic seal independent of insertion order',()=>{const a=createVerifiedAnchorRegistrySeal(snapshot);const b=createVerifiedAnchorRegistrySeal({...snapshot,entries:[...snapshot.entries].reverse()});assert.equal(a.status,'SEALED');assert.equal(a.seal.digest,b.seal.digest);assert.deepEqual(a.seal.entries.map(x=>x.digest),['a','b']);});
test('M53.2 empty registry is deterministic',()=>{const a=createVerifiedAnchorRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]});const b=createVerifiedAnchorRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]});assert.equal(a.seal.entryCount,0);assert.equal(a.seal.digest,b.seal.digest);});
test('M53.3 verifies seal and detects mutation',()=>{const r=createVerifiedAnchorRegistrySeal(snapshot);assert.equal(verifyVerifiedAnchorRegistrySeal(r.seal).valid,true);assert.equal(verifyVerifiedAnchorRegistrySeal({...r.seal,digest:'tampered'}).valid,false);});
test('M53.4 rejects duplicate anchor digest',()=>{assert.equal(createVerifiedAnchorRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('a'),entry('a')]}).status,'REJECTED');});
test('M53.4 rejects evidence promotion',()=>{assert.equal(createVerifiedAnchorRegistrySeal({...snapshot,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M53.5 seal and entries are immutable',()=>{const r=createVerifiedAnchorRegistrySeal(snapshot);assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(r.seal.entries.every(Object.isFrozen));});
