import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
  buildRegistryFromInventory,
  resolveInventoryCapability,
} from '../src/index.mjs';

test('M8 repository seed registers declared haKodan runtime capability', () => {
  const registry = buildRegistryFromInventory(GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
  const result = resolveInventoryCapability(registry, {
    target: 'hakodan-runtime',
    format: 'hakodan-runtime-request',
    adapter: 'runtime-adapter-v1',
    artifact: 'demo.hakodan.json',
  });
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.capability.authority, 'haKodan');
  assert.equal(result.capability.maturity, 'DECLARED');
});

test('M8 repository seed never registers unresolved future target', () => {
  const registry = buildRegistryFromInventory(GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
  const result = resolveInventoryCapability(registry, {
    target: 'future-target',
    format: 'UNRESOLVED',
    adapter: 'UNRESOLVED',
    artifact: 'demo.unresolved',
  });
  assert.equal(result.status, 'UNSUPPORTED');
});
