import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeManifestationIntent,
  planManifestation,
} from '../src/manifestation-intent.mjs';

test('GoodProjeto manifestation is preserved as creator intent without inventing target details', () => {
  const intent = normalizeManifestationIntent({ manifestacao: 'visual' });

  assert.equal(intent.kind, 'visual');
  assert.equal(intent.status, 'INTENT_ONLY');
  assert.equal(intent.target, null);
  assert.equal(intent.format, null);
  assert.equal(intent.adapter, null);
  assert.equal(intent.artifact, null);
});

test('a manifestation plan is unresolved until target, format, adapter and artifact are explicit', () => {
  const result = planManifestation({
    manifestacao: 'interativa',
    target: 'web',
    format: 'html',
  });

  assert.equal(result.status, 'UNRESOLVED');
  assert.deepEqual(result.missing, ['adapter', 'artifact']);
  assert.equal(result.plan, null);
});

test('a complete explicit request can become a manifestation plan without identity drift', () => {
  const result = planManifestation({
    manifestacao: 'hibrida',
    semanticId: 'hnk:demo:001',
    target: 'web',
    format: 'html',
    adapter: 'hakodan:web',
    artifact: 'index.html',
  });

  assert.equal(result.status, 'PLANNED');
  assert.equal(result.plan.semanticId, 'hnk:demo:001');
  assert.equal(result.plan.intent.kind, 'hibrida');
  assert.equal(result.plan.target, 'web');
  assert.equal(result.plan.format, 'html');
  assert.equal(result.plan.adapter, 'hakodan:web');
  assert.equal(result.plan.artifact, 'index.html');
});

test('unknown Goodle manifestation kinds remain explicit instead of being guessed', () => {
  const intent = normalizeManifestationIntent({ manifestacao: 'imersiva' });

  assert.equal(intent.kind, 'imersiva');
  assert.equal(intent.status, 'UNMAPPED');
});
