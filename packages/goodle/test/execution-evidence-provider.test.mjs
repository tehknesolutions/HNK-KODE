import test from 'node:test';
import assert from 'node:assert/strict';

import {
  observeExecutionEvidence,
  routeTargetManifestation,
  dispatchTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

function accepted() {
  return dispatchTargetManifestation(routeTargetManifestation({
    semanticId: 'semantic-provider-12',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1));
}

test('M12.1 provider returns NO_EVIDENCE without fabricating execution', () => {
  const result = observeExecutionEvidence(accepted(), {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    outcome: 'NO_EVIDENCE',
  });
  assert.equal(result.status, 'NO_EVIDENCE');
  assert.equal(result.evidence, null);
});

test('M12.2 provider returns an observation with preserved lineage', () => {
  const result = observeExecutionEvidence(accepted(), {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    observationId: 'obs-12-001',
    observedAt: '2026-10-02T12:00:00Z',
    outcome: 'OBSERVED_EXECUTION',
  });
  assert.equal(result.status, 'OBSERVED_EXECUTION');
  assert.equal(result.evidence.semanticId, 'semantic-provider-12');
  assert.equal(result.evidence.target, 'hakodan-manifestation');
  assert.equal(result.evidence.capabilityId, 'goodle.target.hakodan-manifestation-plan.v1');
  assert.equal(result.evidence.authority, 'HAKODAN');
});

test('M12.3 provider rejects authority mismatch', () => {
  const result = observeExecutionEvidence(accepted(), {
    source: 'goodle',
    authority: 'GOODLE',
    outcome: 'OBSERVED_EXECUTION',
  });
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.evidence, null);
});

test('M12.4 observed failure never becomes execution evidence', () => {
  const result = observeExecutionEvidence(accepted(), {
    source: 'hakodan-runtime',
    authority: 'HAKODAN',
    observationId: 'obs-12-fail',
    observedAt: '2026-10-02T12:00:00Z',
    outcome: 'OBSERVED_FAILURE',
  });
  assert.equal(result.status, 'OBSERVED_FAILURE');
  assert.equal(result.evidence, null);
});