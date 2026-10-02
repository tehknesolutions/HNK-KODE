import test from 'node:test';
import assert from 'node:assert/strict';
import { createCertificateRegistrySeal } from '../src/evidence-provenance-verified-certificate-registry-seal.mjs';
import { importCertificateRegistrySeal } from '../src/evidence-provenance-verified-certificate-registry-seal-import.mjs';

const entry=(digest,sourceDigest)=>Object.freeze({digest,sourceDigest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',stages:Object.freeze({M37:'PASS',M38:'PASS'}),certificate:Object.freeze({digest,sourceDigest,evidenceClass:'PROTOCOL_CONFORMANCE'})});
const seal=createCertificateRegistrySeal({evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('a','src-a'),entry('b','src-b')]}).seal;

test('M45.1/M45.3 imports and independently verifies a valid M44 seal',()=>{const r=importCertificateRegistrySeal(seal);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M45.2 rejects non-canonical entry order',()=>{const r=importCertificateRegistrySeal({...seal,entries:[...seal.entries].reverse()});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'NON_CANONICAL_ENTRY_ORDER');});
test('M45.3 rejects digest tampering',()=>{const r=importCertificateRegistrySeal({...seal,entryCount:seal.entryCount+1});assert.equal(r.status,'REJECTED');});
test('M45.4 rejects evidence-class promotion',()=>{assert.equal(importCertificateRegistrySeal({...seal,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M45.4 preserves immutable seal and entries',()=>{const r=importCertificateRegistrySeal(seal);assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));assert.ok(r.seal.entries.every(Object.isFrozen));});
test('M45.5 rejects malformed seal',()=>{assert.equal(importCertificateRegistrySeal({version:'m44-v1'}).status,'REJECTED');});
