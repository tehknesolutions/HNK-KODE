import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildAcquisitionMaterials } from '../src/acquisition-fec-integration.mjs';

const corpus = JSON.parse(fs.readFileSync(
  new URL('../../../data/acquisition/hnk-family-expansion-corpus.v1.json', import.meta.url),
));
const contrasts = JSON.parse(fs.readFileSync(
  new URL('../../../data/acquisition/hnk-family-expansion-contrasts.v1.json', import.meta.url),
));

test('integration consumes the real FEC V1 split cardinalities and 32 contrasts', () => {
  const materials = buildAcquisitionMaterials(corpus, contrasts);
  assert.equal(materials.train.length, 72);
  assert.equal(materials.holdout.length, 24);
  assert.equal(materials.contrasts.length, 32);
});

test('training material never contains a HOLDOUT identity', () => {
  const materials = buildAcquisitionMaterials(corpus, contrasts);
  const holdoutIds = new Set(materials.holdout.map((item) => item.identityId));
  assert.ok(materials.train.every((item) => !holdoutIds.has(item.identityId)));
});

test('all contrast endpoints resolve to corpus identities', () => {
  const materials = buildAcquisitionMaterials(corpus, contrasts);
  const corpusIds = new Set([
    ...materials.train.map((item) => item.identityId),
    ...materials.holdout.map((item) => item.identityId),
  ]);
  assert.ok(materials.contrasts.every(({ a, b }) => corpusIds.has(a) && corpusIds.has(b)));
});

test('integration preserves structural-only authority and zero semantic bindings', () => {
  const materials = buildAcquisitionMaterials(corpus, contrasts);
  assert.equal(materials.semanticBindings, 0);
  assert.ok([...materials.train, ...materials.holdout]
    .every((item) => item.authority === 'STRUCTURAL_ONLY' && item.semanticBinding === null));
});

test('integration output is immutable and does not mutate source artifacts', () => {
  const beforeCorpus = JSON.stringify(corpus);
  const beforeContrasts = JSON.stringify(contrasts);
  const materials = buildAcquisitionMaterials(corpus, contrasts);
  assert.equal(JSON.stringify(corpus), beforeCorpus);
  assert.equal(JSON.stringify(contrasts), beforeContrasts);
  assert.equal(Object.isFrozen(materials), true);
  assert.equal(Object.isFrozen(materials.train), true);
  assert.equal(Object.isFrozen(materials.holdout), true);
  assert.equal(Object.isFrozen(materials.contrasts), true);
});
