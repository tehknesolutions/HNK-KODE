import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchTargetManifestation,
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

function routed() {
  return routeTargetManifestation({
    semanticId: 'semantic-dispatch-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
}

test('M10.1 dispatch accepts only an authorized routed manifestation', () => {
  const result = dispatchTargetManifestation(routed());
  assert.equal(result.status, 'ACCEPTED');
  assert.equal(result.receipt.status, 'DISPATCH_ACCEPTED');
  assert.equal(result.receipt.semanticId, 'semantic-dispatch-1');
  assert.equal(result.receipt.target, 'hakodan-manifestation');
  assert.equal(result.receipt.adapter, 'manifestation-bridge-v1');
  assert.equal(result.receipt.authority, 'HAKODAN');
  assert.equal(result.receipt.capabilityId, 'goodle.target.hakodan-manifestation-plan.v1');
  assert.equal(result.receipt.executionEvidence, 'UNVERIFIED');
  assert.ok(Object.isFrozen(result.receipt));
});

test('M10.3 raw intent cannot create an execution receipt', () => {
  const result = dispatchTargetManifestation({
    semanticId: 'semantic-raw',
    target: 'hakodan-manifestation',
  });
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});

test('M10.3 unsupported routed result cannot create an execution receipt', () => {
  const result = dispatchTargetManifestation({
    status: 'UNSUPPORTED',
    capability: null,
    request: null,
    plan: null,
    provenance: null,
  });
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.receipt, null);
});

test('M10.5 receipt does not claim target execution', () => {
  const result = dispatchTargetManifestation(routed());
  assert.notEqual(result.receipt.status, 'EXECUTED');
  assert.equal(result.receipt.executionEvidence, 'UNVERIFIED');
});
