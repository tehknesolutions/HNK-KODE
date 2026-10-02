import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildTargetCapabilityInventory,
  buildRegistryFromInventory,
  resolveInventoryCapability,
} from '../src/target-capability-inventory.mjs';

const supported = {
  id: 'goodle.target.example.v1',
  target: 'example-runtime',
  format: 'module',
  adapter: 'example-adapter-v1',
  artifactPattern: '*.mjs',
  authority: 'HNK-KODE',
  source: 'packages/goodle/test/target-capability-inventory.test.mjs',
  maturity: 'DECLARED',
};

const unresolved = {
  id: 'goodle.target.future.v1',
  target: 'future-runtime',
  format: 'unknown',
  adapter: 'UNRESOLVED',
  artifactPattern: '*.future',
  authority: 'HNK-KODE',
  source: 'roadmap',
  maturity: 'UNRESOLVED',
};

test('M8 inventory preserves explicit provenance and maturity', () => {
  const inventory = buildTargetCapabilityInventory([supported, unresolved]);
  assert.equal(inventory.kind, 'TargetCapabilityInventory');
  assert.equal(inventory.entries.length, 2);
  assert.equal(inventory.entries[0].source, supported.source);
  assert.equal(inventory.entries[1].maturity, 'UNRESOLVED');
});

test('M8 registers only executable inventory entries', () => {
  const inventory = buildTargetCapabilityInventory([supported, unresolved]);
  const registry = buildRegistryFromInventory(inventory);
  const result = resolveInventoryCapability(registry, {
    target: supported.target,
    format: supported.format,
    adapter: supported.adapter,
    artifact: 'game.mjs',
  });
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(Object.keys(registry.entries).length, 1);
});

test('M8 unresolved target remains unsupported', () => {
  const inventory = buildTargetCapabilityInventory([supported, unresolved]);
  const registry = buildRegistryFromInventory(inventory);
  const result = resolveInventoryCapability(registry, {
    target: unresolved.target,
    format: unresolved.format,
    adapter: unresolved.adapter,
    artifact: 'game.future',
  });
  assert.deepEqual(result, { status: 'UNSUPPORTED', capability: null });
});

test('M8 rejects conflicting duplicate ids', () => {
  assert.throws(
    () => buildTargetCapabilityInventory([
      supported,
      { ...supported, target: 'different-runtime' },
    ]),
    /GOODLE_TARGET_INVENTORY_CONFLICT/,
  );
});
