import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchTargetManifestation,
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

const input = {
  semanticId: 'semantic-integrity-1',
  target: 'hakodan-manifestation',
  format: 'manifestation-plan-v0.9',
  adapter: 'manifestation-bridge-v1',
  artifact: 'plan.hakodan.manifest.json',
};

function routed() {
  return routeTargetManifestation(
    input,
    { roles: ['CREATOR'] },
    GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
  );
}

test('M10.3 rejects provenance when capability is not CONFORMANT', () => {
  const value = routed();
  value.capability = { ...value.capability, maturity: 'DECLARED' };
  const result = dispatchTargetManifestation(value);
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});

test('M10.3 rejects a plan whose semantic identity drifts from the route', () => {
  const value = routed();
  value.plan = { ...value.plan, semanticId: 'different-semantic' };
  const result = dispatchTargetManifestation(value);
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});

test('M10.4 receipt authority and capability lineage come from immutable routing provenance', () => {
  const result = dispatchTargetManifestation(routed());
  assert.equal(result.receipt.authority, 'HAKODAN');
  assert.equal(result.receipt.capabilityId, 'goodle.target.hakodan-manifestation-plan.v1');
  assert.equal(result.receipt.capabilitySource, 'packages/hakodan/src/manifestation-graph-v0.9.mjs');
  assert.equal(result.receipt.executionEvidence, 'UNVERIFIED');
});
