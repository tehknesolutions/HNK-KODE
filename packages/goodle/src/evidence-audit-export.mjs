import { verifyAuditChain } from './evidence-audit-integrity.mjs';
import { verifyAuditSeal } from './evidence-audit-seal.mjs';

export function exportSealedAuditArtifact(records = [], chain = [], seal = {}) {
  const chainVerification = verifyAuditChain(records, chain);
  if (!chainVerification.valid || !seal) return Object.freeze({ status: 'REJECTED', artifact: null });
  const sealVerification = verifyAuditSeal(records, chain, seal);
  if (!sealVerification.valid) return Object.freeze({ status: 'REJECTED', artifact: null });
  const artifact = Object.freeze({
    version: 'm18-v1',
    kind: 'GOODLE_AUDIT_ARTIFACT',
    records: Object.freeze(records.map((record) => Object.freeze({ ...record }))),
    chain: Object.freeze(chain.map((entry) => Object.freeze({ ...entry }))),
    seal: Object.freeze({ ...seal }),
  });
  return Object.freeze({ status: 'EXPORTED', artifact });
}

export function serializeSealedAuditArtifact(records = [], chain = [], seal = {}) {
  const result = exportSealedAuditArtifact(records, chain, seal);
  if (result.status !== 'EXPORTED') return result;
  return Object.freeze({ status: 'EXPORTED', artifact: result.artifact, serialized: JSON.stringify(result.artifact) });
}

export function verifySealedAuditArtifact(artifact = {}) {
  if (artifact?.version !== 'm18-v1' || artifact?.kind !== 'GOODLE_AUDIT_ARTIFACT') return Object.freeze({ valid: false, reason: 'INVALID_ARTIFACT' });
  const chain = verifyAuditChain(artifact.records ?? [], artifact.chain ?? []);
  if (!chain.valid) return Object.freeze({ valid: false, reason: 'CHAIN_INVALID' });
  const seal = verifyAuditSeal(artifact.records ?? [], artifact.chain ?? [], artifact.seal ?? {});
  if (!seal.valid) return Object.freeze({ valid: false, reason: 'SEAL_INVALID' });
  return Object.freeze({ valid: true, length: chain.length, chainHead: chain.head });
}