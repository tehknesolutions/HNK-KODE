import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
  buildRegistryFromInventory,
  resolveInventoryCapability,
  createGoodleRuntimeEnvelope,
} from '../src/index.mjs';

test('M8.1 haKodan runtime inventory entry conforms to runtime authority envelope', () => {
  const entry = GOODLE_TARGET_CAPABILITY_INVENTORY_V1.entries.find(
    ({ id }) => id === 'goodle.target.hakodan-runtime.v1',
  );
  assert.ok(entry);
  assert.equal(entry.maturity, 'CONFORMANT');

  const envelope = createGoodleRuntimeEnvelope({
    projectId: 'project-1',
    sessionId: 'session-1',
    canonicalProgram: { kind: 'CanonicalProgram' },
  });

  assert.equal(envelope.creatorAuthority, 'GOODLE');
  assert.equal(envelope.executionAuthority, 'HAKODAN');
  assert.equal(entry.authority, envelope.executionAuthority);
  assert.equal(envelope.provenance.targetLayer, 'HAKODAN');
});

test('M8.1 conformant runtime entry remains registry-resolvable', () => {
  const registry = buildRegistryFromInventory(GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
  const result = resolveInventoryCapability(registry, {
    target: 'hakodan-runtime',
    format: 'hakodan-runtime-request',
    adapter: 'runtime-adapter-v1',
    artifact: 'project.hakodan.json',
  });
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.capability.maturity, 'CONFORMANT');
  assert.equal(result.capability.authority, 'HAKODAN');
});
