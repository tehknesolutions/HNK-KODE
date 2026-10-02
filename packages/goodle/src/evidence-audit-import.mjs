import { verifySealedAuditArtifact } from './evidence-audit-export.mjs';

export function importSealedAuditArtifact(artifact = {}) {
  if (!artifact || typeof artifact !== 'object') return Object.freeze({ status: 'REJECTED', artifact: null });
  if (!Array.isArray(artifact.records) || !Array.isArray(artifact.chain) || !artifact.seal) return Object.freeze({ status: 'REJECTED', artifact: null });
  const verification = verifySealedAuditArtifact(artifact);
  if (!verification.valid) return Object.freeze({ status: 'REJECTED', artifact: null, reason: verification.reason });
  const imported = Object.freeze({
    version: artifact.version, kind: artifact.kind,
    records: Object.freeze(artifact.records.map((record) => Object.freeze({ ...record }))),
    chain: Object.freeze(artifact.chain.map((entry) => Object.freeze({ ...entry }))),
    seal: Object.freeze({ ...artifact.seal }),
  });
  return Object.freeze({ status: 'IMPORTED_VERIFIED', artifact: imported, verification });
}