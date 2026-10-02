import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditChain } from '../src/evidence-audit-integrity.mjs';
import { createAuditSeal } from '../src/evidence-audit-seal.mjs';
import { exportSealedAuditArtifact, serializeSealedAuditArtifact, verifySealedAuditArtifact } from '../src/evidence-audit-export.mjs';

const records=[{semanticId:'m18',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-18',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'},{semanticId:'m18',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-18',authority:'HAKODAN',state:'OBSERVED_EXECUTION',observationId:'obs-18',observedAt:'2026-10-02T14:20:00Z',evidenceSource:'hakodan-runtime'}];
function sealed(){ const chain=buildAuditChain(records); const seal=createAuditSeal(records,chain).seal; return {chain,seal}; }

test('M18.1 exports only a valid sealed timeline',()=>{ const {chain,seal}=sealed(); const r=exportSealedAuditArtifact(records,chain,seal); assert.equal(r.status,'EXPORTED'); assert.equal(r.artifact.version,'m18-v1'); assert.equal(r.artifact.records.length,2); });
test('M18.2 serialization is deterministic',()=>{ const {chain,seal}=sealed(); const a=serializeSealedAuditArtifact(records,chain,seal); const b=serializeSealedAuditArtifact(records,chain,seal); assert.equal(a.serialized,b.serialized); });
test('M18.3 embedded artifact verifies against chain and seal',()=>{ const {chain,seal}=sealed(); const artifact=exportSealedAuditArtifact(records,chain,seal).artifact; const r=verifySealedAuditArtifact(artifact); assert.equal(r.valid,true); });
test('M18.4 rejects tampered artifact',()=>{ const {chain,seal}=sealed(); const artifact=exportSealedAuditArtifact(records,chain,seal).artifact; const tampered={...artifact,records:[...artifact.records,{...artifact.records[1],authority:'GOODLE'}]}; const r=verifySealedAuditArtifact(tampered); assert.equal(r.valid,false); });
test('M18.4 rejects unsealed export',()=>{ const chain=buildAuditChain(records); const r=exportSealedAuditArtifact(records,chain,{}); assert.equal(r.status,'REJECTED'); });