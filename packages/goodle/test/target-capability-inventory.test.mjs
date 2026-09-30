import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TARGET_CAPABILITY_INVENTORY,
  executableInventoryEntries,
  buildRegistryFromInventory,
} from '../src/target-capability-inventory.mjs';
import { resolveTargetCapability } from '../src/target-capability-registry.mjs';

test('M8 inventory classifies every discovered target candidate explicitly', () => {
  const allowed = new Set(['EXECUTABLE', 'DECLARED', 'PLANNED', 'UNRESOLVED']);
  assert.ok(TARGET_CAPABILITY_INVENTORY.length > 0);
  for (const entry of TARGET_CAPABILITY_INVENTORY) {
    assert.ok(allowed.has(entry.status));
    assert.ok(entry.source?.repository);
    assert.ok(entry.source?.path);
  }
});

test('M8 only promotes EXECUTABLE entries into the runtime registry', () => {
  const executable = executableInventoryEntries();
  assert.ok(executable.length > 0);
  assert.ok(executable.every((entry) => entry.status === 'EXECUTABLE'));

  const registry = buildRegistryFromInventory();
  assert.equal(Object.keys(registry.entries).length, executable.length);
});

test('HNK-VERSE reference avatar renderer is registered from executable source evidence', () => {
  const registry = buildRegistryFromInventory();
  const result = resolveTargetCapability(registry, {
    target: 'hnk-verse-reference-avatar',
    format: 'runtime-frame',
    adapter: 'hnk-verse:reference-avatar',
    artifact: 'reference-avatar.frame',
  });
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.capability.authority, 'HAKODAN');
});

test('declared or unresolved ecosystem targets are not advertised as executable', () => {
  const registry = buildRegistryFromInventory();
  for (const entry of TARGET_CAPABILITY_INVENTORY.filter((item) => item.status !== 'EXECUTABLE')) {
    const result = resolveTargetCapability(registry, entry.capability);
    assert.equal(result.status, 'UNSUPPORTED');
  }
});
