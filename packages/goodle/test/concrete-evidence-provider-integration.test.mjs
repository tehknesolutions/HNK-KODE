import test from 'node:test';
import assert from 'node:assert/strict';

import {
  observeConcreteExecution,
  observeExecutionEvidence,
} from '../src/index.mjs';

const dispatch = {
  status: 'ACCEPTED',
  receipt: {
    status: 'DISPATCH_ACCEPTED',
    executionEvidence: 'UNVERIFIED',
    semanticId: 'm13-integration',
    target: 'hakodan-manifestation',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
    capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
    authority: 'HAKODAN',
  },
};

test('M13.5 concrete adapter delegates to the M12 provider contract', () => {
  const observation = {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    observationId: 'obs-m13-integration',
    observedAt: '2026-10-02T12:30:00Z',
    outcome: 'OBSERVED_EXECUTION',
  };
  assert.deepEqual(
    observeConcreteExecution(dispatch, observation),
    observeExecutionEvidence(dispatch, observation),
  );
});
