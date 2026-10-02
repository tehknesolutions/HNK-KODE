import { createHash } from 'node:crypto';

const FIELDS = ['semanticId','target','adapter','capabilityId','authority'];

export function computeArtifactLineageFingerprint(artifact = {}) {
  const records = artifact?.records;
  if (!Array.isArray(records) || records.length === 0) return Object.freeze({ status: 'REJECTED', fingerprint: null });
  const identities = records.map((record) => FIELDS.map((field) => record[field] ?? null));
  const canonical = JSON.stringify(identities);
  return Object.freeze({ status: 'READY', fingerprint: createHash('sha256').update(canonical).digest('hex') });
}

export function verifyArtifactLineage(left = {}, right = {}) {
  const a = computeArtifactLineageFingerprint(left);
  const b = computeArtifactLineageFingerprint(right);
  if (a.status !== 'READY' || b.status !== 'READY') return Object.freeze({ status: 'REJECTED', compatible: false, reason: 'INVALID_ARTIFACT' });
  const leftRecords = left.records;
  const rightRecords = right.records;
  if (leftRecords[0].semanticId !== rightRecords[0].semanticId) return Object.freeze({ status: 'REJECTED', compatible: false, reason: 'SEMANTIC_ID_MISMATCH' });
  for (const field of FIELDS.slice(1)) {
    if (leftRecords[0][field] !== rightRecords[0][field]) return Object.freeze({ status: 'REJECTED', compatible: false, reason: `${field.toUpperCase()}_MISMATCH` });
  }
  return Object.freeze({ status: 'COMPATIBLE', compatible: true, fingerprint: a.fingerprint, sameFingerprint: a.fingerprint === b.fingerprint });
}