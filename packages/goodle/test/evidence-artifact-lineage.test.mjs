import test from 'node:test';
import assert from 'node:assert/strict';
import { computeArtifactLineageFingerprint, verifyArtifactLineage } from '../src/evidence-artifact-lineage.mjs';

const base={version:'m18-v1',kind:'GOODLE_AUDIT_ARTIFACT',records:[{semanticId:'m20',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',capabilityId:'cap-20',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'}]};

test('M20.1 lineage fingerprint is deterministic',()=>{const a=computeArtifactLineageFingerprint(base);const b=computeArtifactLineageFingerprint({...base,records:base.records.map(x=>({...x}))});assert.equal(a.status,'READY');assert.equal(a.fingerprint,b.fingerprint);});
test('M20.3 compatible artifacts share explicit identity lineage',()=>{const left=base;const right={...base,seal:{chainHead:'other'}};const r=verifyArtifactLineage(left,right);assert.equal(r.status,'COMPATIBLE');assert.equal(r.compatible,true);});
test('M20.4 rejects semantic identity collision',()=>{const right={...base,records:[{...base.records[0],semanticId:'different'}]};const r=verifyArtifactLineage(base,right);assert.equal(r.status,'REJECTED');assert.equal(r.reason,'SEMANTIC_ID_MISMATCH');});
test('M20.4 rejects authority/capability lineage mismatch',()=>{for(const field of ['authority','capabilityId','target','adapter']){const right={...base,records:[{...base.records[0],[field]:'different'}]};const r=verifyArtifactLineage(base,right);assert.equal(r.status,'REJECTED');}});
test('M20 rejects empty artifact identity',()=>{const r=computeArtifactLineageFingerprint({records:[]});assert.equal(r.status,'REJECTED');});