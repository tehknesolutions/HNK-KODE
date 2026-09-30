import test from 'node:test';
import assert from 'node:assert/strict';
import { bridgeToHakodanManifestation } from '../src/manifestation-bridge.mjs';

test('M6 forwards an explicit Goodle plan to haKodan without semantic identity drift', () => {
  const result = bridgeToHakodanManifestation({
    manifestacao: 'hibrida',
    semanticId: 'hnk:demo:001',
    target: 'web',
    format: 'html',
    adapter: 'hakodan:web',
    artifact: 'index.html',
  }, { id: 'creator:tw', capabilities: ['MANIFEST'] });

  assert.equal(result.status, 'BRIDGED');
  assert.equal(result.plan.semanticId, 'hnk:demo:001');
  assert.equal(result.plan.stage, 'PLAN');
  assert.equal(result.plan.executed, false);
  assert.equal(result.plan.provenance.at(-1).source, 'MANIFESTATION_GRAPH');
});

test('M6 refuses incomplete manifestation details before calling haKodan', () => {
  const result = bridgeToHakodanManifestation({
    manifestacao: 'visual',
    semanticId: 'hnk:demo:002',
    target: 'web',
  }, { id: 'creator:tw', capabilities: ['MANIFEST'] });

  assert.equal(result.status, 'UNRESOLVED');
  assert.deepEqual(result.missing, ['format', 'adapter', 'artifact']);
  assert.equal(result.plan, null);
});

test('M6 preserves haKodan MANIFEST authority gate', () => {
  assert.throws(() => bridgeToHakodanManifestation({
    manifestacao: 'visual',
    semanticId: 'hnk:demo:003',
    target: 'web',
    format: 'html',
    adapter: 'hakodan:web',
    artifact: 'index.html',
  }, { id: 'viewer', capabilities: ['READ'] }), /HAKODAN_V09_AUTHORITY_DENIED/);
});

test('M6 refuses a planned manifestation without semantic identity', () => {
  const result = bridgeToHakodanManifestation({
    manifestacao: 'visual',
    target: 'web',
    format: 'html',
    adapter: 'hakodan:web',
    artifact: 'index.html',
  }, { id: 'creator:tw', capabilities: ['MANIFEST'] });

  assert.equal(result.status, 'UNRESOLVED');
  assert.deepEqual(result.missing, ['semanticId']);
  assert.equal(result.plan, null);
});
