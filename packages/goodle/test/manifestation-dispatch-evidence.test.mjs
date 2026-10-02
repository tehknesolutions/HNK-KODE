import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchTargetManifestation,
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

const routed = () => routeTargetManifestation({
  semanticId: 'semantic-evidence-1',
  target: 'hakodan-manifestation',
  format: 'manifestation-plan-v0.9',
  adapter: 'manifestation-bridge-v1',
  artifact: 'plan.hakodan.manifest.json',
}, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

test('M10.5 accepted dispatch has explicit non-execution evidence state', () => {
  const result = dispatchTargetManifestation(routed());
  assert.equal(result.status, 'ACCEPTED');
  assert.equal(result.receipt.status, 'DISPATCH_ACCEPTED');
  assert.equal(result.receipt.executionEvidence, 'UNVERIFIED');
});

test('M10.5 receipt cannot be interpreted as execution success', () => {
  const result = dispatchTargetManifestation(routed());
  assert.notEqual(result.receipt.status, 'EXECUTED');
  assert.notEqual(result.receipt.executionEvidence, 'VERIFIED_PASS');
});
