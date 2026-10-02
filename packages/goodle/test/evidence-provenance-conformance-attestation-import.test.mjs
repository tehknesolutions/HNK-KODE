import test from 'node:test';
import assert from 'node:assert/strict';
import { createConformanceAttestation } from '../src/evidence-provenance-conformance-attestation.mjs';
import { importConformanceAttestation } from '../src/evidence-provenance-conformance-attestation-import.mjs';

const source={status:'CONFORMANT_ROUND_TRIP',stages:{M34:'PASS',M35:'PASS'},digest:'bundle-38'};
const manifest=createConformanceAttestation(source,{ledger:'M36'}).manifest;

test('M38.1/M38.3 imports and verifies a valid M37 attestation',()=>{const r=importConformanceAttestation(manifest);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M38.2 rejects execution-evidence promotion',()=>{const r=importConformanceAttestation({...manifest,evidenceClass:'EXECUTION_EVIDENCE'});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'INVALID_ATTESTATION_SHAPE');});
test('M38.3 rejects digest tampering',()=>{const r=importConformanceAttestation({...manifest,bundleDigest:'changed'});assert.equal(r.status,'REJECTED');assert.equal(r.reason,'DIGEST_MISMATCH');});
test('M38.4 preserves protocol metadata',()=>{const r=importConformanceAttestation(manifest);assert.equal(r.manifest.bundleDigest,manifest.bundleDigest);assert.equal(r.manifest.protocol,manifest.protocol);assert.deepEqual(r.manifest.stages,manifest.stages);assert.equal(r.manifest.ledger,manifest.ledger);});
test('M38.4 returns immutable snapshot',()=>{const r=importConformanceAttestation(manifest);assert.ok(Object.isFrozen(r.manifest));assert.ok(Object.isFrozen(r.manifest.stages));});
test('M38.5 rejects malformed manifest',()=>{assert.equal(importConformanceAttestation({version:'m37-v1'}).status,'REJECTED');});
