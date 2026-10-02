function rejected() {
  return Object.freeze({ status: 'REJECTED', evidence: null });
}

export function observeExecutionEvidence(dispatch = {}, observation = {}) {
  const receipt = dispatch?.receipt;
  if (
    dispatch?.status !== 'ACCEPTED' ||
    !receipt ||
    receipt.status !== 'DISPATCH_ACCEPTED' ||
    receipt.executionEvidence !== 'UNVERIFIED'
  ) return rejected();

  if (!observation.source || !observation.authority) return rejected();
  if (observation.authority !== receipt.authority) return rejected();

  if (observation.outcome === 'NO_EVIDENCE') {
    return Object.freeze({ status: 'NO_EVIDENCE', evidence: null });
  }

  if (observation.outcome === 'OBSERVED_FAILURE') {
    return Object.freeze({ status: 'OBSERVED_FAILURE', evidence: null });
  }

  if (observation.outcome !== 'OBSERVED_EXECUTION') return rejected();
  if (!observation.observationId || !observation.observedAt) return rejected();

  const evidence = Object.freeze({
    semanticId: receipt.semanticId,
    target: receipt.target,
    adapter: receipt.adapter,
    artifact: receipt.artifact,
    capabilityId: receipt.capabilityId,
    source: observation.source,
    authority: observation.authority,
    observationId: observation.observationId,
    observedAt: observation.observedAt,
    outcome: 'OBSERVED_EXECUTION',
  });

  return Object.freeze({ status: 'OBSERVED_EXECUTION', evidence });
}