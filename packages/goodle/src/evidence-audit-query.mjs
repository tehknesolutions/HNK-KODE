function matches(record, filters = {}) {
  for (const field of ['semanticId','observationId','capabilityId','target','authority','state']) {
    if (filters[field] !== undefined && record[field] !== filters[field]) return false;
  }
  return true;
}

export function queryEvidenceAudit(store, filters = {}) {
  if (!store || typeof store.records !== 'function') return Object.freeze({ status: 'REJECTED', records: [] });
  const records = store.records().filter((record) => matches(record, filters));
  return Object.freeze({ status: 'OK', records: Object.freeze(records.map((record) => Object.freeze({ ...record }))) });
}

export function buildEvidenceTimeline(store, filters = {}) {
  const result = queryEvidenceAudit(store, filters);
  if (result.status !== 'OK') return result;
  return Object.freeze({
    status: 'OK',
    timeline: Object.freeze(result.records.map((record, index) => Object.freeze({ index, ...record }))),
  });
}