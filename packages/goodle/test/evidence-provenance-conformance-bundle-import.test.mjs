import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceBundle } from '../src/evidence-provenance-conformance-bundle.mjs';
import { importProvenanceConformanceBundle } from '../src/evidence-provenance-conformance-bundle-import.mjs';

const source={status:'CONFORMANT',stages:{M30:'PASS',M31:'PASS',M32:'PASS'},digest:'abc123'};
const bundle=createProvenanceConformanceBundle(source,{ledger:'M33'}).bundle;

test('M35.1/M35.3 imports and verifies a valid M34 bundle',()=>{const r=importProvenanceConformanceBundle(bundle);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M35.2 rejects malformed bundle',()=>{const r=importProvenanceConformanceBundle({version:'m34-v1',kind:'GOODLE_PROVENANCE_CONFORMANCE_BUNDLE'});assert.equal(r.status,'REJECTED');});
test('M35.3 rejects tampering',()=>{const r=importProvenanceConformanceBundle({...bundle,sourceDigest:'changed'});assert.equal(r.status,'REJECTED');});
test('M35.4 preserves stage results and source digest',()=>{const r=importProvenanceConformanceBundle(bundle);assert.deepEqual(r.bundle.stages,source.stages);assert.equal(r.bundle.sourceDigest,source.digest);});
test('M35.5 imported bundle is immutable',()=>{const r=importProvenanceConformanceBundle(bundle);assert.ok(Object.isFrozen(r.bundle));assert.ok(Object.isFrozen(r.bundle.stages));});
test('M35.2 rejects missing required PASS stage',()=>{const malformed={...bundle,stages:{M30:'PASS',M31:'PASS',M32:'FAIL'}};assert.equal(importProvenanceConformanceBundle(malformed).status,'REJECTED');});
test('M35.4 imported snapshot is independent from later source mutation',()=>{const sourceBundle={...bundle,stages:{...bundle.stages}};const r=importProvenanceConformanceBundle(sourceBundle);sourceBundle.stages.M30='CHANGED';assert.equal(r.bundle.stages.M30,'PASS');});
