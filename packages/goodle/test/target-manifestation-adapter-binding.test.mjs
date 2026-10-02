import test from 'node:test';
import assert from 'node:assert/strict';

import {
  bindTargetAdapter,
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
} from '../src/index.mjs';

test('M9.2 binds only the adapter declared by a conformant capability', () => {
  const binding = bindTargetAdapter({
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(binding.status, 'BOUND');
  assert.equal(binding.capability.adapter, 'manifestation-bridge-v1');
  assert.equal(typeof binding.invoke, 'function');
});

test('M9.3 rejects an adapter not authorized by the resolved capability', () => {
  const binding = bindTargetAdapter({
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'runtime-adapter-v1',
    artifact: 'plan.hakodan.manifest.json',
  }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.deepEqual(binding, {
    status: 'UNSUPPORTED',
    capability: null,
    invoke: null,
  });
});

test('M9.3 unresolved target never produces an invokable binding', () => {
  const binding = bindTargetAdapter({
    target: 'future-target',
    format: 'UNRESOLVED',
    adapter: 'UNRESOLVED',
    artifact: 'demo.unresolved',
  }, GOODLE_TARGET_CAPABILITY_INVENTORY_V1);

  assert.equal(binding.status, 'UNSUPPORTED');
  assert.equal(binding.invoke, null);
});
