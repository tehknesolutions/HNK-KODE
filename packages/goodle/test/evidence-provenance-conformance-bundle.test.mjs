import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceBundle, verifyProvenanceConformanceBundle } from '../src/evidence-provenance-conformance-bundle.mjs';

const conformance={status:'CONFORMANT',stages:{M30:'PASS',M31:'PASS',M32:'PASS'},digest:'abc123'};
test('M34.1/M34.2 creates deterministic bundle',()=>{const a=createProvenanceConformanceBundle(conformance,{ledger:'M33'});const b=createProvenanceConformanceBundle(conformance,{ledger:'M33'});assert.equal(a.status,'CREATED');assert.equal(a.serialized,b.serialized);assert.equal(a.bundle.digest,b.bundle.digest);});
test('M34.3 verifies bundle integrity',()=>{const r=createProvenanceConformanceBundle(conformance);assert.equal(verifyProvenanceConformanceBundle(r.bundle).valid,true);});
test('M34.4 rejects non-conformant input',()=>{const r=createProvenanceConformanceBundle({status:'REJECTED'});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'NON_CONFORMANT_INPUT');});
test('M34.4 rejects tampering',()=>{const r=createProvenanceConformanceBundle(conformance);const v=verifyProvenanceConformanceBundle({...r.bundle,sourceDigest:'changed'});assert.equal(v.valid,false);});
test('M34.5 bundle is immutable',()=>{const r=createProvenanceConformanceBundle(conformance);assert.ok(Object.isFrozen(r.bundle));});