export function createEvidenceAuditRecord(input = {}) {
  const source = input.evidence ?? input.receipt;
  if (!source || !source.semanticId || !source.target || !source.adapter || !source.capabilityId || !source.authority) {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  const state = input.state ?? source.executionEvidence ?? source.status;
  const allowed = ['DISPATCH_ACCEPTED', 'OBSERVED_EXECUTION', 'OBSERVED_FAILURE', 'EXECUTION_VERIFIED'];
  if (!allowed.includes(state)) return Object.freeze({ status: 'REJECTED', record: null });
  if ((state === 'OBSERVED_EXECUTION' || state === 'EXECUTION_VERIFIED') && !source.observationId) {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  return Object.freeze({
    status: 'READY',
    record: Object.freeze({
      semanticId: source.semanticId, target: source.target, adapter: source.adapter,
      artifact: source.artifact ?? null, capabilityId: source.capabilityId,
      authority: source.authority, state, observationId: source.observationId ?? null,
      observedAt: source.observedAt ?? null, evidenceSource: source.evidenceSource ?? source.source ?? null,
    }),
  });
}

export function appendEvidenceAuditRecord(store, candidate) {
  if (!store || typeof store.append !== 'function' || candidate?.status !== 'READY') {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  return store.append(candidate.record);
}

export function createInMemoryEvidenceAuditStore() {
  const records = [];
  return Object.freeze({
    records: () => records.map((record) => Object.freeze({ ...record })),
    append(record) {
      const existing = records.find((item) => item.observationId === record.observationId && record.observationId);
      if (existing) {
        const same = JSON.stringify(existing) === JSON.stringify(record);
        return Object.freeze({ status: same ? 'IDEMPOTENT' : 'CONFLICT', record: Object.freeze({ ...existing }) });
      }
      records.push(Object.freeze({ ...record }));
      return Object.freeze({ status: 'APPENDED', record: Object.freeze({ ...record }) });
    },
  });
}