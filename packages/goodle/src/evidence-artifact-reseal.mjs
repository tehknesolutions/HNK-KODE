import { buildAuditChain, verifyAuditChain } from './evidence-audit-integrity.mjs';
import { createAuditSeal, verifyAuditSeal } from './evidence-audit-seal.mjs';

export function validateMergedArtifact(artifact = {}) {
  if (artifact?.version !== 'm23-v1' || artifact?.kind !== 'GOODLE_AUDIT_ARTIFACT' || !Array.isArray(artifact.records) || artifact.records.length === 0) return Object.freeze({ status: 'REJECTED', reason: 'INVALID_MERGE_RESULT' });
  return Object.freeze({ status: 'VALID', artifact });
}

export function resealMergedArtifact(artifact = {}) {
  const validation = validateMergedArtifact(artifact);
  if (validation.status !== 'VALID') return Object.freeze({ status: 'REJECTED', seal: null, reason: validation.reason });
  const chain = buildAuditChain(artifact.records);
  const verification = verifyAuditChain(artifact.records, chain);
  if (!verification.valid) return Object.freeze({ status: 'REJECTED', seal: null, reason: 'CHAIN_INVALID' });
  const sealed = createAuditSeal(artifact.records, chain);
  if (sealed.status !== 'SEALED') return Object.freeze({ status: 'REJECTED', seal: null, reason: 'SEAL_FAILED' });
  return Object.freeze({ status: 'SEALED', chain, seal: sealed.seal });
}

export function verifyMergedReseal(artifact = {}, chain = [], seal = {}) {
  const validation = validateMergedArtifact(artifact);
  if (validation.status !== 'VALID') return Object.freeze({ valid: false, reason: validation.reason });
  const verification = verifyAuditSeal(artifact.records, chain, seal);
  return Object.freeze(verification);
}