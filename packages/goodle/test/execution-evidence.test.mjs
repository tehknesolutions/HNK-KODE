import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchTargetManifestation,
  submitExecutionEvidence,
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

function accepted() {
  const routed = routeTargetManifestation({
    semanticId: 'semantic-evidence-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
  return dispatchTargetManifestation(routed);
}

test('M11.1 submits explicit execution evidence against an accepted receipt', () => {
  const result = submitExecutionEvidence(accepted(), {
    semanticId: 'semantic-evidence-1',
    target: 'hakodan-manifestation',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
    capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
    source: 'hakodan-runtime',
    observationId: 'obs-001',
    observedAt: '2026-10-02T11:20:00Z',
    outcome: 'EXECUTED',
  });

  assert.equal(result.status, 'FINALIZED');
  assert.equal(result.receipt.executionEvidence, 'VERIFIED');
  assert.equal(result.receipt.observationId, 'obs-001');
  assert.ok(Object.isFrozen(result.receipt));
});

test('M11.3 rejects mismatched execution lineage', () => {
  const result = submitExecutionEvidence(accepted(), {
    semanticId: 'different',
    target: 'hakodan-manifestation',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
    capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
    source: 'hakodan-runtime',
    observationId: 'obs-002',
    observedAt: '2026-10-02T11:20:00Z',
    outcome: 'EXECUTED',
  });

  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});

test('M11.4 raw intent cannot submit execution evidence', () => {
  const result = submitExecutionEvidence({ status: 'ACCEPTED', receipt: null }, {
    semanticId: 'raw',
    source: 'unknown',
    observationId: 'obs-003',
    observedAt: '2026-10-02T11:20:00Z',
    outcome: 'EXECUTED',
  });

  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});
