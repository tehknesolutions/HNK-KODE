import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditChain } from '../src/evidence-audit-integrity.mjs';
import { createAuditSeal, verifyAuditSeal } from '../src/evidence-audit-seal.mjs';

const records=[
 {semanticId:'m17',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-17',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'},
 {semanticId:'m17',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-17',authority:'HAKODAN',state:'OBSERVED_EXECUTION',observationId:'obs-17',observedAt:'2026-10-02T14:00:00Z',evidenceSource:'hakodan-runtime'},
];

test('M17.1 creates a deterministic seal only for a verified non-empty chain',()=>{ const chain=buildAuditChain(records); const a=createAuditSeal(records,chain); const b=createAuditSeal(records,chain); assert.equal(a.status,'SEALED'); assert.deepEqual(a.seal,b.seal); assert.equal(a.seal.length,2); });
test('M17.3 verifies an unchanged sealed timeline',()=>{ const chain=buildAuditChain(records); const seal=createAuditSeal(records,chain).seal; const r=verifyAuditSeal(records,chain,seal); assert.equal(r.valid,true); });
test('M17.4 rejects tampered post-seal records',()=>{ const chain=buildAuditChain(records); const seal=createAuditSeal(records,chain).seal; const tampered=[...records.slice(0,1),{...records[1],authority:'GOODLE'}]; const r=verifyAuditSeal(tampered,chain,seal); assert.equal(r.valid,false); });
test('M17.4 refuses empty timeline sealing',()=>{ const r=createAuditSeal([],[]); assert.equal(r.status,'REJECTED'); assert.equal(r.seal,null); });