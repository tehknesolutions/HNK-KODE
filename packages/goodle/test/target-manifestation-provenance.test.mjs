import test from 'node:test';
import assert from 'node:assert/strict';

import {
  routeTargetManifestation,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

test('M9.4 routed manifestation exposes immutable routing provenance', () => {
  const result = routeTargetManifestation({
    semanticId: 'semantic-provenance-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(result.status, 'ROUTED');
  assert.deepEqual(result.provenance, {
    semanticId: 'semantic-provenance-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
    authority: 'HAKODAN',
    capabilityId: 'goodle.target.hakodan-manifestation-plan.v1',
    capabilitySource: 'packages/hakodan/src/manifestation-graph-v0.9.mjs',
  });
  assert.ok(Object.isFrozen(result.provenance));
});

test('M9.4 unsupported routing emits no fabricated provenance', () => {
  const result = routeTargetManifestation({
    semanticId: 'semantic-provenance-2',
    target: 'unknown',
    format: 'unknown',
    adapter: 'unknown',
    artifact: 'unknown.bin',
  }, { roles: ['CREATOR'] }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(result.status, 'UNSUPPORTED');
  assert.equal(result.provenance, null);
});
