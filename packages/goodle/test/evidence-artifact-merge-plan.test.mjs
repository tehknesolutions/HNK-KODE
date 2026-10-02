import test from 'node:test';
import assert from 'node:assert/strict';
import { planAuditArtifactMerge } from '../src/evidence-artifact-merge-plan.mjs';

const base={semanticId:'m22',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',capabilityId:'cap-22',authority:'HAKODAN'};
const left={records:[{...base,state:'DISPATCH_ACCEPTED'}]};
const right={records:[{...base,state:'DISPATCH_ACCEPTED'},{...base,state:'OBSERVED_EXECUTION',observationId:'obs-22',observedAt:'2026-10-02T15:00:00Z',evidenceSource:'hakodan-runtime'}]};

test('M22.1 creates deterministic plan without mutating sources',()=>{const a=planAuditArtifactMerge(left,right);const b=planAuditArtifactMerge(left,right);assert.equal(a.status,'PLANNED');assert.deepEqual(a.plan,b.plan);assert.equal(a.plan.additions.length,1);assert.equal(left.records.length,1);});
test('M22.3 classifies conflicting records',()=>{const r={records:[{...base,state:'DISPATCH_ACCEPTED',artifact:'changed.json'}]};const x=planAuditArtifactMerge(left,r);assert.equal(x.status,'CONFLICTS_REQUIRE_RESOLUTION');assert.equal(x.plan.conflicts.length,1);});
test('M22.4 resolution policy is explicit',()=>{const r={records:[{...base,state:'DISPATCH_ACCEPTED',artifact:'changed.json'}]};const x=planAuditArtifactMerge(left,r,{resolve:'right'});assert.equal(x.status,'PLANNED');assert.equal(x.plan.retained[0].source,'right');});
test('M22 rejects incompatible lineage',()=>{const r={records:[{...base,semanticId:'other',state:'DISPATCH_ACCEPTED'}]};const x=planAuditArtifactMerge(left,r);assert.equal(x.status,'REJECTED');});
test('M22 plan is immutable',()=>{const x=planAuditArtifactMerge(left,right);assert.ok(Object.isFrozen(x.plan));assert.ok(Object.isFrozen(x.plan.additions));});