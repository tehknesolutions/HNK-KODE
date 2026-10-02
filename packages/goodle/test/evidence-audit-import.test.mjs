import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditChain } from '../src/evidence-audit-integrity.mjs';
import { createAuditSeal } from '../src/evidence-audit-seal.mjs';
import { exportSealedAuditArtifact } from '../src/evidence-audit-export.mjs';
import { importSealedAuditArtifact } from '../src/evidence-audit-import.mjs';

const records=[{semanticId:'m19',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-19',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'},{semanticId:'m19',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-19',authority:'HAKODAN',state:'OBSERVED_EXECUTION',observationId:'obs-19',observedAt:'2026-10-02T14:30:00Z',evidenceSource:'hakodan-runtime'}];
function artifact(){const chain=buildAuditChain(records);const seal=createAuditSeal(records,chain).seal;return exportSealedAuditArtifact(records,chain,seal).artifact;}

test('M19.1 imports and verifies a valid M18 artifact',()=>{const r=importSealedAuditArtifact(artifact());assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);assert.ok(Object.isFrozen(r.artifact));});
test('M19.2 rejects malformed artifact',()=>{const r=importSealedAuditArtifact({version:'m18-v1',kind:'GOODLE_AUDIT_ARTIFACT'});assert.equal(r.status,'REJECTED');});
test('M19.3 rejects tampered imported artifact',()=>{const a=artifact();const r=importSealedAuditArtifact({...a,records:[...a.records,{...a.records[1],authority:'GOODLE'}]});assert.equal(r.status,'REJECTED');});
test('M19.4 imported snapshot is immutable',()=>{const r=importSealedAuditArtifact(artifact());assert.ok(Object.isFrozen(r.artifact.records));assert.ok(Object.isFrozen(r.artifact.records[0]));assert.ok(Object.isFrozen(r.artifact.seal));});