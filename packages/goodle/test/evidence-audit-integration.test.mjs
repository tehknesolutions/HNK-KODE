import test from 'node:test';
import assert from 'node:assert/strict';
import { createInMemoryEvidenceAuditStore } from '../src/evidence-audit-store.mjs';
import { persistDispatchReceipt, persistExecutionEvidence, persistFinalizedReceipt } from '../src/evidence-audit-integration.mjs';

const receipt={status:'DISPATCH_ACCEPTED',executionEvidence:'UNVERIFIED',semanticId:'m14-flow',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.hakodan.manifest.json',capabilityId:'goodle.target.hakodan-manifestation-plan.v1',authority:'HAKODAN'};

test('M14.4 persists dispatch, observation and finalized receipt as distinct audit states',()=>{
 const store=createInMemoryEvidenceAuditStore();
 const d=persistDispatchReceipt(store,{status:'ACCEPTED',receipt}); assert.equal(d.status,'APPENDED');
 const e={status:'OBSERVED_EXECUTION',evidence:{...receipt,source:'hakodan-runtime',observationId:'obs-flow',observedAt:'2026-10-02T12:50:00Z',outcome:'OBSERVED_EXECUTION'}};
 assert.equal(persistExecutionEvidence(store,e).status,'APPENDED');
 const f={status:'FINALIZED',receipt:{...receipt,status:'EXECUTION_VERIFIED',executionEvidence:'VERIFIED',evidenceSource:'hakodan-runtime',observationId:'obs-flow',observedAt:'2026-10-02T12:50:00Z',evidenceOutcome:'EXECUTED'}};
 assert.equal(persistFinalizedReceipt(store,f).status,'APPENDED');
 assert.deepEqual(store.records().map(r=>r.state),['DISPATCH_ACCEPTED','OBSERVED_EXECUTION','EXECUTION_VERIFIED']);
});

test('M14.4 rejects persistence attempts that bypass state boundaries',()=>{
 const store=createInMemoryEvidenceAuditStore();
 assert.equal(persistExecutionEvidence(store,{status:'EXECUTION_VERIFIED',evidence:receipt}).status,'REJECTED');
 assert.equal(persistFinalizedReceipt(store,{status:'ACCEPTED',receipt}).status,'REJECTED');
});