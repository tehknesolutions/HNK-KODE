import test from 'node:test';
import assert from 'node:assert/strict';
import { planAuditArtifactMerge } from '../src/evidence-artifact-merge-plan.mjs';
import { applyAuditMergePlan } from '../src/evidence-artifact-merge.mjs';

const base={semanticId:'m23',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',capabilityId:'cap-23',authority:'HAKODAN'};
const left={records:[{...base,state:'DISPATCH_ACCEPTED'}]};
const right={records:[{...base,state:'DISPATCH_ACCEPTED'},{...base,state:'OBSERVED_EXECUTION',observationId:'obs-23',observedAt:'2026-10-02T15:20:00Z',evidenceSource:'hakodan-runtime'}]};

test('M23.1 applies a valid merge plan into a new immutable artifact',()=>{const plan=planAuditArtifactMerge(left,right);const r=applyAuditMergePlan(left,right,plan.plan);assert.equal(r.status,'MERGED');assert.equal(r.artifact.records.length,2);assert.ok(Object.isFrozen(r.artifact));});
test('M23.2 rejects unresolved conflicts',()=>{const conflict={records:[{...base,state:'DISPATCH_ACCEPTED',artifact:'changed.json'}]};const plan=planAuditArtifactMerge(left,conflict);const r=applyAuditMergePlan(left,conflict,plan.plan);assert.equal(r.status,'REJECTED');});
test('M23.3 does not mutate sources',()=>{const before=JSON.stringify(left);const plan=planAuditArtifactMerge(left,right);applyAuditMergePlan(left,right,plan.plan);assert.equal(JSON.stringify(left),before);});
test('M23.4 records applied operations',()=>{const plan=planAuditArtifactMerge(left,right);const r=applyAuditMergePlan(left,right,plan.plan);assert.ok(r.artifact.mergeAudit.sourcePlans.additions.length===1);});
test('M23.5 rejects an invalid plan',()=>{const r=applyAuditMergePlan(left,right,{});assert.equal(r.status,'REJECTED');});