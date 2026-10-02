import test from 'node:test';
import assert from 'node:assert/strict';
import { createCertificateRegistrySeal, verifyCertificateRegistrySeal } from '../src/evidence-provenance-verified-certificate-registry-seal.mjs';

const entry=(digest,sourceDigest)=>Object.freeze({digest,sourceDigest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',stages:Object.freeze({M37:'PASS',M38:'PASS'}),certificate:Object.freeze({digest,sourceDigest,evidenceClass:'PROTOCOL_CONFORMANCE'})});
const snapshot={evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b','src-b'),entry('a','src-a')]};

test('M44.1/M44.2 creates deterministic seal independent of registry insertion order',()=>{const a=createCertificateRegistrySeal(snapshot);const b=createCertificateRegistrySeal({...snapshot,entries:[...snapshot.entries].reverse()});assert.equal(a.status,'SEALED');assert.equal(a.serialized,b.serialized);assert.equal(a.seal.digest,b.seal.digest);assert.deepEqual(a.seal.entries.map(x=>x.digest),['a','b']);});
test('M44.2 empty registry has deterministic explicit seal',()=>{const a=createCertificateRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]});const b=createCertificateRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[]});assert.equal(a.status,'SEALED');assert.equal(a.seal.entryCount,0);assert.equal(a.seal.digest,b.seal.digest);});
test('M44.3 verifies seal and detects content mutation',()=>{const r=createCertificateRegistrySeal(snapshot);assert.equal(verifyCertificateRegistrySeal(r.seal).valid,true);const changed={...r.seal,entries:r.seal.entries.map((x,i)=>i?x:{...x,sourceDigest:'changed'})};assert.equal(verifyCertificateRegistrySeal(changed).valid,false);});
test('M44.4 rejects duplicate digest entries',()=>{const r=createCertificateRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('a','one'),entry('a','two')]});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'DUPLICATE_OR_CONFLICTING_DIGEST');});
test('M44.4 rejects evidence-class promotion',()=>{assert.equal(createCertificateRegistrySeal({...snapshot,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M44.5 seal and nested snapshots are immutable',()=>{const r=createCertificateRegistrySeal(snapshot);assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(r.seal.entries.every(Object.isFrozen));});
