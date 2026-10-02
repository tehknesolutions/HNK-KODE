import { observeExecutionEvidence } from './execution-evidence-provider.mjs';

export function observeConcreteExecution(dispatch = {}, observation = {}) {
  return observeExecutionEvidence(dispatch, observation);
}