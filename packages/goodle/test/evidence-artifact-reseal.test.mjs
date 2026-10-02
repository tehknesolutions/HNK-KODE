import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditChain } from '../src/evidence-audit-integrity.mjs';
import { createAuditSeal } from '../src/evidence-audit-seal.mjs';
import { resealMergedArtifact, verifyMergedReseal } from '../src/evidence-artifact-reseal.mjs';

const records=[{semanticId:'m24',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-24',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'},{semanticId:'m24',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-24',authority:'HAKODAN',state:'OBSERVED_EXECUTION',observationId:'obs-24',observedAt:'2026-10-02T15:40:00Z',evidenceSource:'hakodan-runtime'}];
const artifact={version:'m23-v1',kind:'GOODLE_AUDIT_ARTIFACT',records,mergeAudit:{sourcePlans:{additions:[]}}};

test('M24.1/M24.3 validates and reseals an M23 result',()=>{const r=resealMergedArtifact(artifact);assert.equal(r.status,'SEALED');assert.equal(r.chain.length,2);assert.equal(r.seal.version,'m17-v1');});
test('M24.2 verifies the fresh result seal',()=>{const r=resealMergedArtifact(artifact);const v=verifyMergedReseal(artifact,r.chain,r.seal);assert.equal(v.valid,true);});
test('M24.4 source seal remains independent',()=>{const sourceChain=buildAuditChain(records.slice(0,1));const sourceSeal=createAuditSeal(records.slice(0,1),sourceChain).seal;const r=resealMergedArtifact(artifact);assert.notEqual(r.seal.sealDigest,sourceSeal.sealDigest);});
test('M24.1 rejects invalid merge result',()=>{const r=resealMergedArtifact({version:'m23-v1',kind:'GOODLE_AUDIT_ARTIFACT',records:[]});assert.equal(r.status,'REJECTED');});
test('M24.4 does not mutate merged artifact',()=>{const before=JSON.stringify(artifact);resealMergedArtifact(artifact);assert.equal(JSON.stringify(artifact),before);});