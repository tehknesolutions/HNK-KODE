import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GOODLE_TARGET_CAPABILITY_INVENTORY_V1,
  buildRegistryFromInventory,
  resolveInventoryCapability,
} from '../src/index.mjs';
import { validateManifestation } from '../../hakodan/src/manifestation-graph-v0.9.mjs';

test('M8.2 inventory declares the haKodan manifestation graph target as conformant', () => {
  const entry = GOODLE_TARGET_CAPABILITY_INVENTORY_V1.entries.find(
    ({ id }) => id === 'goodle.target.hakodan-manifestation-plan.v1',
  );
  assert.ok(entry);
  assert.equal(entry.maturity, 'CONFORMANT');
  assert.equal(entry.authority, 'HAKODAN');
  assert.equal(entry.source, 'packages/hakodan/src/manifestation-graph-v0.9.mjs');
});

test('M8.2 manifestation target dimensions conform to haKodan validation contract', () => {
  const request = {
    semanticId: 'semantic-1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifact: 'plan.hakodan.manifest.json',
  };
  assert.deepEqual(validateManifestation(request), { valid: true, diagnostics: [] });

  const registry = buildRegistryFromInventory(GOODLE_TARGET_CAPABILITY_INVENTORY_V1);
  const result = resolveInventoryCapability(registry, request);
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.capability.maturity, 'CONFORMANT');
});
