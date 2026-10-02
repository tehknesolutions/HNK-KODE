function reject() {
  return Object.freeze({ status: 'REJECTED', receipt: null });
}

export function submitExecutionEvidence(dispatch = {}, evidence = {}) {
  const receipt = dispatch?.receipt;

  if (
    dispatch?.status !== 'ACCEPTED' ||
    !receipt ||
    receipt.status !== 'DISPATCH_ACCEPTED' ||
    receipt.executionEvidence !== 'UNVERIFIED'
  ) {
    return reject();
  }

  const fields = ['semanticId', 'target', 'adapter', 'artifact', 'capabilityId'];
  for (const field of fields) {
    if (!evidence[field] || evidence[field] !== receipt[field]) return reject();
  }

  if (!evidence.source || !evidence.observationId || !evidence.observedAt) return reject();
  if (evidence.outcome !== 'EXECUTED') return reject();

  const finalized = Object.freeze({
    ...receipt,
    status: 'EXECUTION_VERIFIED',
    executionEvidence: 'VERIFIED',
    evidenceSource: evidence.source,
    observationId: evidence.observationId,
    observedAt: evidence.observedAt,
    evidenceOutcome: evidence.outcome,
  });

  return Object.freeze({
    status: 'FINALIZED',
    receipt: finalized,
  });
}
