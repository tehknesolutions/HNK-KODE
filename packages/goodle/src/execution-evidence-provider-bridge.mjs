import { submitExecutionEvidence } from './execution-evidence.mjs';

export function finalizeObservedExecution(dispatch = {}, observationResult = {}) {
  if (observationResult?.status !== 'OBSERVED_EXECUTION' || !observationResult.evidence) {
    return Object.freeze({ status: 'NOT_FINALIZED', receipt: null });
  }

  const evidence = {
    ...observationResult.evidence,
    outcome: 'EXECUTED',
  };
  return submitExecutionEvidence(dispatch, evidence);
}