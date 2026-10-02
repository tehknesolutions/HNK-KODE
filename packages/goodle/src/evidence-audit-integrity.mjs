import { createHash } from 'node:crypto';

const FIELDS = ['semanticId','target','adapter','artifact','capabilityId','authority','state','observationId','observedAt','evidenceSource'];

export function canonicalizeAuditRecord(record = {}) {
  return JSON.stringify(FIELDS.map((field) => [field, record[field] ?? null]));
}

export function digestAuditRecord(record = {}) {
  return createHash('sha256').update(canonicalizeAuditRecord(record)).digest('hex');
}

export function buildAuditChain(records = []) {
  let previousDigest = 'GENESIS';
  return Object.freeze(records.map((record, index) => {
    const recordDigest = digestAuditRecord(record);
    const chainDigest = createHash('sha256').update(previousDigest + ':' + recordDigest).digest('hex');
    previousDigest = chainDigest;
    return Object.freeze({ index, recordDigest, previousDigest: index === 0 ? 'GENESIS' : undefined, chainDigest });
  }));
}

export function verifyAuditChain(records = [], chain = []) {
  if (records.length !== chain.length) return Object.freeze({ valid: false, reason: 'LENGTH_MISMATCH' });
  let previous = 'GENESIS';
  for (let index = 0; index < records.length; index += 1) {
    const recordDigest = digestAuditRecord(records[index]);
    const expected = createHash('sha256').update(previous + ':' + recordDigest).digest('hex');
    if (chain[index]?.recordDigest !== recordDigest) return Object.freeze({ valid: false, reason: 'RECORD_DIGEST_MISMATCH', index });
    if (chain[index]?.chainDigest !== expected) return Object.freeze({ valid: false, reason: 'CHAIN_DIGEST_MISMATCH', index });
    previous = expected;
  }
  return Object.freeze({ valid: true, length: records.length, head: previous });
}