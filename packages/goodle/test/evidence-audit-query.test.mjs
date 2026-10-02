import test from 'node:test';
import assert from 'node:assert/strict';
import { createInMemoryEvidenceAuditStore } from '../src/evidence-audit-store.mjs';
import { queryEvidenceAudit, buildEvidenceTimeline } from '../src/evidence-audit-query.mjs';

function store() {
 const s=createInMemoryEvidenceAuditStore();
 for (const state of ['DISPATCH_ACCEPTED','OBSERVED_EXECUTION','EXECUTION_VERIFIED']) s.append({semanticId:'m15',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.hakodan.manifest.json',capabilityId:'cap-15',authority:'HAKODAN',state,observationId:state==='DISPATCH_ACCEPTED'?null:'obs-15',observedAt:state==='DISPATCH_ACCEPTED'?null:'2026-10-02T13:00:00Z'});
 s.append({semanticId:'other',target:'other',adapter:'other',artifact:null,capabilityId:'other',authority:'OTHER',state:'OBSERVED_FAILURE',observationId:'obs-other',observedAt:'2026-10-02T13:01:00Z'});
 return s;
}

test('M15.1 queries by supported audit dimensions',()=>{ const r=queryEvidenceAudit(store(),{semanticId:'m15',state:'OBSERVED_EXECUTION'}); assert.equal(r.status,'OK'); assert.equal(r.records.length,1); assert.equal(r.records[0].observationId,'obs-15'); });
test('M15.2 timeline preserves append order and state',()=>{ const r=buildEvidenceTimeline(store(),{semanticId:'m15'}); assert.deepEqual(r.timeline.map(x=>x.state),['DISPATCH_ACCEPTED','OBSERVED_EXECUTION','EXECUTION_VERIFIED']); assert.deepEqual(r.timeline.map(x=>x.index),[0,1,2]); });
test('M15.3 missing filters return an explicit empty result',()=>{ const r=queryEvidenceAudit(store(),{semanticId:'missing'}); assert.equal(r.status,'OK'); assert.deepEqual(r.records,[]); });
test('M15.4 query does not expose mutable store records',()=>{ const s=store(); const r=queryEvidenceAudit(s,{semanticId:'m15'}); assert.ok(Object.isFrozen(r.records)); assert.ok(Object.isFrozen(r.records[0])); });