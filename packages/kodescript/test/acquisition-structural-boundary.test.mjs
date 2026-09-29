import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAcquisitionMaterials } from '../src/acquisition-fec-integration.mjs';

const corpus = { train: [], holdout: [] };
const pairs = [{ id: 'C-001', left: 'G01', right: 'G02', distance: { radial: 1, angular: 0 } }];

test('FEC integration rejects semantic bindings as structural acquisition inputs', () => {
  assert.throws(() => buildAcquisitionMaterials(corpus, {
    pairs,
    semanticBindings: [{ glyphId: 'G01', meaning: 'AMOR' }],
  }), /semantic.*structural|structural.*semantic/i);
});

test('FEC integration rejects phonological, grammatical, and canonical bindings', () => {
  for (const field of ['phonologicalBindings', 'grammaticalBindings', 'canonicalBindings']) {
    assert.throws(() => buildAcquisitionMaterials(corpus, {
      pairs,
      [field]: [{ glyphId: 'G01', value: 'X' }],
    }), new RegExp(field.replace('Bindings', ''), 'i'));
  }
});

