import { verifyArtifactLineage } from './evidence-artifact-lineage.mjs';

const RECORD_FIELDS = ['semanticId','target','adapter','artifact','capabilityId','authority','state','observationId','observedAt','evidenceSource'];

function identity(record = {}) {
  return JSON.stringify([record.semanticId ?? null, record.observationId ?? null, record.state ?? null]);
}

function snapshot(record) {
  return Object.freeze({ ...record });
}

export function compareAuditArtifacts(left = {}, right = {}) {
  const lineage = verifyArtifactLineage(left, right);
  if (lineage.status !== 'COMPATIBLE') return Object.freeze({ status: 'REJECTED', diff: null, reason: lineage.reason });

  const leftRecords = left.records ?? [];
  const rightRecords = right.records ?? [];
  const leftMap = new Map(leftRecords.map((record) => [identity(record), record]));
  const rightMap = new Map(rightRecords.map((record) => [identity(record), record]));
  const added = []; const removed = []; const changed = [];

  for (const [key, record] of rightMap) {
    if (!leftMap.has(key)) added.push(snapshot(record));
    else {
      const before = leftMap.get(key);
      const fields = RECORD_FIELDS.filter((field) => (before[field] ?? null) !== (record[field] ?? null));
      if (fields.length) changed.push(Object.freeze({ key, fields: Object.freeze(fields), before: snapshot(before), after: snapshot(record) }));
    }
  }
  for (const [key, record] of leftMap) if (!rightMap.has(key)) removed.push(snapshot(record));

  const leftOrder = leftRecords.map(identity); const rightOrder = rightRecords.map(identity);
  const orderingChanged = JSON.stringify(leftOrder) !== JSON.stringify(rightOrder);
  return Object.freeze({ status: 'COMPARED', diff: Object.freeze({ added: Object.freeze(added), removed: Object.freeze(removed), changed: Object.freeze(changed), orderingChanged }) });
}