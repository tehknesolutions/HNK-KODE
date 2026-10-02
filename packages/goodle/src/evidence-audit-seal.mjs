import { createHash } from 'node:crypto';
import { verifyAuditChain } from './evidence-audit-integrity.mjs';

export function createAuditSeal(records = [], chain = []) {
  const verification = verifyAuditChain(records, chain);
  if (!verification.valid || records.length === 0) {
    return Object.freeze({ status: 'REJECTED', seal: null, verification });
  }
  const sealDigest = createHash('sha256').update(`M17:${verification.length}:${verification.head}`).digest('hex');
  return Object.freeze({
    status: 'SEALED',
    seal: Object.freeze({ version: 'm17-v1', length: verification.length, chainHead: verification.head, sealDigest }),
  });
}

export function verifyAuditSeal(records = [], chain = [], seal = {}) {
  const verification = verifyAuditChain(records, chain);
  if (!verification.valid || !seal || seal.version !== 'm17-v1') return Object.freeze({ valid: false, reason: 'INVALID_SEAL_INPUT' });
  const expected = createHash('sha256').update(`M17:${verification.length}:${verification.head}`).digest('hex');
  if (seal.length !== verification.length || seal.chainHead !== verification.head || seal.sealDigest !== expected) {
    return Object.freeze({ valid: false, reason: 'SEAL_MISMATCH' });
  }
  return Object.freeze({ valid: true, length: verification.length, chainHead: verification.head });
}