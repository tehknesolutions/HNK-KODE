import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeAuditRecord, digestAuditRecord, buildAuditChain, verifyAuditChain } from '../src/evidence-audit-integrity.mjs';

const a={semanticId:'m16-a',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-16',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'};
const b={...a,state:'OBSERVED_EXECUTION',observationId:'obs-16',observedAt:'2026-10-02T13:10:00Z',evidenceSource:'hakodan-runtime'};

test('M16.1 canonicalization is deterministic',()=>{ assert.equal(canonicalizeAuditRecord(a),canonicalizeAuditRecord({...a})); assert.equal(digestAuditRecord(a),digestAuditRecord({...a})); });
test('M16.2 chain verifies in append order',()=>{ const records=[a,b]; const chain=buildAuditChain(records); const r=verifyAuditChain(records,chain); assert.equal(r.valid,true); assert.equal(r.length,2); });
test('M16.4 detects tampering',()=>{ const records=[a,b]; const chain=buildAuditChain(records); const tampered=[{...a}, {...b,authority:'GOODLE'}]; const r=verifyAuditChain(tampered,chain); assert.equal(r.valid,false); assert.equal(r.reason,'RECORD_DIGEST_MISMATCH'); });
test('M16.4 detects reordering',()=>{ const records=[a,b]; const chain=buildAuditChain(records); const r=verifyAuditChain([b,a],chain); assert.equal(r.valid,false); });
test('M16.4 detects omission',()=>{ const records=[a,b]; const chain=buildAuditChain(records); const r=verifyAuditChain([a],[chain[0]]); assert.equal(r.valid,false); assert.equal(r.reason,'LENGTH_MISMATCH'); });
test('M16.5 empty history is valid',()=>{ const r=verifyAuditChain([],[]); assert.equal(r.valid,true); assert.equal(r.length,0); });