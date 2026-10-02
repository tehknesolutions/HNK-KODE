import test from 'node:test';
import assert from 'node:assert/strict';

import {
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

test('M9.1 routes a conformant manifestation target through its declared adapter', () => {
  const result = routeTargetManifestation({
    semanticId: 'semantic-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(result.status, 'ROUTED');
  assert.equal(result.capability.maturity, 'CONFORMANT');
  assert.equal(result.capability.authority, 'HAKODAN');
  assert.equal(result.request.semanticId, 'semantic-1');
  assert.equal(result.plan.semanticId, 'semantic-1');
  assert.equal(result.plan.target, result.request.target);
  assert.equal(result.plan.format, result.request.format);
  assert.equal(result.plan.adapter, result.request.adapter);
  assert.equal(result.plan.artifact, result.request.artifact);
});

test('M9.1 refuses unsupported target before adapter invocation', () => {
  const result = routeTargetManifestation({
    semanticId: 'semantic-1',
    target: 'unknown-target',
    format: 'unknown-format',
    adapter: 'unknown-adapter',
    artifact: 'unknown.bin',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.deepEqual(result, {
    status: 'UNSUPPORTED',
    capability: null,
    request: null,
    plan: null,
    provenance: null,
  });
});

test('M9.1 refuses unresolved inventory entry before adapter invocation', () => {
  const result = routeTargetManifestation({
    semanticId: 'semantic-1',
    target: 'future-target',
    format: 'UNRESOLVED',
    adapter: 'UNRESOLVED',
    artifact: 'demo.unresolved',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(result.status, 'UNSUPPORTED');
  assert.equal(result.plan, null);
  assert.equal(result.provenance, null);
});
