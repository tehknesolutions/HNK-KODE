import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedAnchorArchiveRegistrySeal, verifyVerifiedAnchorArchiveRegistrySeal } from '../src/evidence-provenance-verified-anchor-archive-registry-seal.mjs';

const protocol='M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39';
const entry=(digest)=>Object.freeze({digest,sourceDigest:'seal-'+digest,protocol,evidenceClass:'PROTOCOL_CONFORMANCE',archive:Object.freeze({version:'m56-v1',kind:'GOODLE_VERIFIED_ANCHOR_REGISTRY_SEAL_ARCHIVE',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',sourceDigest:'seal-'+digest,seal:Object.freeze({digest:'seal-'+digest,evidenceClass:'PROTOCOL_CONFORMANCE'}),digest})});
const snapshot={version:'m59-v1',kind:'GOODLE_VERIFIED_ANCHOR_ARCHIVE_REGISTRY',protocol,evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b'),entry('a')]};

test('M60.1/M60.2 creates deterministic canonical seal',()=>{const a=createVerifiedAnchorArchiveRegistrySeal(snapshot);const b=createVerifiedAnchorArchiveRegistrySeal({...snapshot,entries:[...snapshot.entries].reverse()});assert.equal(a.status,'SEALED');assert.equal(a.seal.digest,b.seal.digest);assert.deepEqual(a.seal.entries.map(x=>x.digest),['a','b']);});
test('M60.2 empty registry is deterministic',()=>{const x={...snapshot,entries:[]};const a=createVerifiedAnchorArchiveRegistrySeal(x);const b=createVerifiedAnchorArchiveRegistrySeal(x);assert.equal(a.seal.entryCount,0);assert.equal(a.seal.digest,b.seal.digest);});
test('M60.3 independently verifies seal and detects digest tampering',()=>{const r=createVerifiedAnchorArchiveRegistrySeal(snapshot);assert.equal(verifyVerifiedAnchorArchiveRegistrySeal(r.seal).valid,true);assert.equal(verifyVerifiedAnchorArchiveRegistrySeal({...r.seal,digest:'tampered'}).valid,false);});
test('M60.4 rejects duplicate archive digest',()=>{assert.equal(createVerifiedAnchorArchiveRegistrySeal({...snapshot,entries:[entry('a'),entry('a')]}).status,'REJECTED');});
test('M60.4 rejects broken source binding and evidence promotion',()=>{const broken=entry('a');const changed={...broken,archive:{...broken.archive,sourceDigest:'wrong'}};assert.equal(createVerifiedAnchorArchiveRegistrySeal({...snapshot,entries:[changed]}).status,'REJECTED');assert.equal(createVerifiedAnchorArchiveRegistrySeal({...snapshot,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M60.5 seal and entries are immutable',()=>{const r=createVerifiedAnchorArchiveRegistrySeal(snapshot);assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(r.seal.entries.every(Object.isFrozen));});
