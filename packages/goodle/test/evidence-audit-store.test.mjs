import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAuditRecord, createInMemoryEvidenceAuditStore, appendEvidenceAuditRecord } from '../src/evidence-audit-store.mjs';

const evidence={semanticId:'m14',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.hakodan.manifest.json',capabilityId:'goodle.target.hakodan-manifestation-plan.v1',authority:'HAKODAN',observationId:'obs-m14',observedAt:'2026-10-02T12:40:00Z',source:'hakodan-runtime'};

test('M14.1 creates an auditable immutable record from validated evidence',()=>{
 const r=createEvidenceAuditRecord({evidence,state:'OBSERVED_EXECUTION'});
 assert.equal(r.status,'READY'); assert.equal(r.record.semanticId,'m14'); assert.ok(Object.isFrozen(r.record));
});
test('M14.2 append-only store accepts records without upgrading state',()=>{
 const store=createInMemoryEvidenceAuditStore(); const r=createEvidenceAuditRecord({evidence,state:'OBSERVED_EXECUTION'});
 const a=appendEvidenceAuditRecord(store,r); assert.equal(a.status,'APPENDED'); assert.equal(store.records()[0].state,'OBSERVED_EXECUTION');
});
test('M14.3 identical observation is idempotent and conflicting observation is rejected',()=>{
 const store=createInMemoryEvidenceAuditStore(); const r=createEvidenceAuditRecord({evidence,state:'OBSERVED_EXECUTION'});
 appendEvidenceAuditRecord(store,r); assert.equal(appendEvidenceAuditRecord(store,r).status,'IDEMPOTENT');
 const conflict=createEvidenceAuditRecord({evidence:{...evidence,authority:'GOODLE'},state:'OBSERVED_EXECUTION'}); assert.equal(appendEvidenceAuditRecord(store,conflict).status,'CONFLICT');
});
test('M14.3 invalid audit state is rejected',()=>{ const r=createEvidenceAuditRecord({evidence,state:'EXECUTED'}); assert.equal(r.status,'REJECTED'); });