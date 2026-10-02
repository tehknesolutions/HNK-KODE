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
    semanticId: 'semantic-integrity-11',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1));
}

const evidence = {
  semanticId: 'semantic-integrity-11',
  target: 'hakodan-manifestation',
  adapter: 'manifestation-bridge-v1',
  artifact: 'plan.hakodan.manifest.json',
  capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
  source: 'hakodan-runtime',
  authority: 'HAKODAN',
  observationId: 'obs-integrity-11',
  observedAt: '2026-10-02T11:30:00Z',
  outcome: 'EXECUTED',
};

test('M11.3 rejects mismatched target, adapter, artifact, or capability lineage', () => {
  for (const field of ['target', 'adapter', 'artifact', 'capabilityId']) {
    const bad = { ...evidence, [field]: 'mismatch-' + field };
    const result = submitExecutionEvidence(accepted(), bad);
    assert.equal(result.status, 'REJECTED');
    assert.equal(result.receipt, null);
  }
});

test('M11.4 final receipt preserves dispatch identity and execution observation separately', () => {
  const result = submitExecutionEvidence(accepted(), evidence);
  assert.equal(result.status, 'FINALIZED');
  assert.equal(result.receipt.status, 'EXECUTION_VERIFIED');
  assert.equal(result.receipt.executionEvidence, 'VERIFIED');
  assert.equal(result.receipt.semanticId, evidence.semanticId);
  assert.equal(result.receipt.evidenceSource, evidence.source);
  assert.equal(result.receipt.observationId, evidence.observationId);
  assert.equal(result.receipt.observedAt, evidence.observedAt);
});

test('M11.4 finalized receipt cannot be submitted again', () => {
  const first = submitExecutionEvidence(accepted(), evidence);
  const second = submitExecutionEvidence(first, evidence);
  assert.equal(second.status, 'REJECTED');
  assert.equal(second.receipt, null);
});