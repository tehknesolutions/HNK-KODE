import test from 'node:test';
import assert from 'node:assert/strict';

import {
  observeExecutionEvidence,
  finalizeObservedExecution,
  routeTargetManifestation,
  dispatchTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

function accepted() {
  return dispatchTargetManifestation(routeTargetManifestation({
    semanticId: 'semantic-bridge-12',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1));
}

test('M12.4 observed execution finalizes the M11 receipt', () => {
  const dispatch = accepted();
  const observation = observeExecutionEvidence(dispatch, {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    observationId: 'obs-bridge-12',
    observedAt: '2026-10-02T12:10:00Z',
    outcome: 'OBSERVED_EXECUTION',
  });
  const result = finalizeObservedExecution(dispatch, observation);
  assert.equal(result.status, 'FINALIZED');
  assert.equal(result.receipt.status, 'EXECUTION_VERIFIED');
  assert.equal(result.receipt.executionEvidence, 'VERIFIED');
});

test('M12.4 no evidence never finalizes a receipt', () => {
  const dispatch = accepted();
  const observation = observeExecutionEvidence(dispatch, {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    outcome: 'NO_EVIDENCE',
  });
  const result = finalizeObservedExecution(dispatch, observation);
  assert.equal(result.status, 'NOT_FINALIZED');
  assert.equal(result.receipt, null);
});

test('M12.4 observed failure never finalizes as verified execution', () => {
  const dispatch = accepted();
  const observation = observeExecutionEvidence(dispatch, {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    observationId: 'obs-failure-12',
    observedAt: '2026-10-02T12:10:00Z',
    outcome: 'OBSERVED_FAILURE',
  });
  const result = finalizeObservedExecution(dispatch, observation);
  assert.equal(result.status, 'NOT_FINALIZED');
  assert.equal(result.receipt, null);
});