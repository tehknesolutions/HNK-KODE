import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchTargetManifestation,
  submitExecutionEvidence,
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

function accepted() {
  return dispatchTargetManifestation(routeTargetManifestation({
    semanticId: 'semantic-authority-11',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1));
}

test('M11 rejects execution evidence from an authority different from the receipt', () => {
  const result = submitExecutionEvidence(accepted(), {
    semanticId: 'semantic-authority-11',
    target: 'hakodan-manifestation',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
    capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
    source: 'goodle',
    authority: 'GOODLE',
    observationId: 'obs-authority-11',
    observedAt: '2026-10-02T11:40:00Z',
    outcome: 'EXECUTED',
  });

  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});
