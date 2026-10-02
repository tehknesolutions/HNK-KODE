export function observeConcreteExecution(dispatch = {}, observation = {}) {
  const receipt = dispatch?.receipt;
  if (dispatch?.status !== 'ACCEPTED' || !receipt) {
    return Object.freeze({ status: 'REJECTED', evidence: null });
  }
  if (!observation.source || !observation.authority) {
    return Object.freeze({ status: 'REJECTED', evidence: null });
  }
  if (observation.authority !== receipt.authority) {
    return Object.freeze({ status: 'REJECTED', evidence: null });
  }
  if (!['NO_EVIDENCE', 'OBSERVED_EXECUTION', 'OBSERVED_FAILURE'].includes(observation.outcome)) {
    return Object.freeze({ status: 'REJECTED', evidence: null });
  }
  if (observation.outcome === 'NO_EVIDENCE') return Object.freeze({ status: 'NO_EVIDENCE', evidence: null });
  if (!observation.observationId || !observation.observedAt) return Object.freeze({ status: 'REJECTED', evidence: null });
  if (observation.outcome === 'OBSERVED_FAILURE') return Object.freeze({ status: 'OBSERVED_FAILURE', evidence: null });
  return Object.freeze({
    status: 'OBSERVED_EXECUTION',
    evidence: Object.freeze({
      semanticId: receipt.semanticId, target: receipt.target, adapter: receipt.adapter,
      artifact: receipt.artifact, capabilityId: receipt.capabilityId,
      source: observation.source, authority: observation.authority,
      observationId: observation.observationId, observedAt: observation.observedAt,
      outcome: 'OBSERVED_EXECUTION',
    }),
  });
}