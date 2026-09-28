import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildAcquisitionMaterials } from '../src/acquisition-fec-integration.mjs';
import { createAcquisitionRun, advanceAcquisitionRun } from '../src/acquisition-end-to-end.mjs';

const corpus = JSON.parse(fs.readFileSync(
  new URL('../../../data/acquisition/hnk-family-expansion-corpus.v1.json', import.meta.url),
));
const contrasts = JSON.parse(fs.readFileSync(
  new URL('../../../data/acquisition/hnk-family-expansion-contrasts.v1.json', import.meta.url),
));
const materials = buildAcquisitionMaterials(corpus, contrasts);

test('end-to-end run binds real FEC materials to BASELINE without exposing HOLDOUT', () => {
  const run = createAcquisitionRun({ participantId: 'P-001', sessionId: 'S-001', materials });
  assert.equal(run.phase, 'BASELINE');
  assert.equal(run.materialCounts.train, 72);
  assert.equal(run.materialCounts.contrasts, 32);
  assert.equal(run.materialCounts.holdout, 24);
  assert.equal('holdout' in run, false);
});

test('run follows the frozen protocol while exposing only phase-appropriate materials', () => {
  let run = createAcquisitionRun({ participantId: 'P-001', sessionId: 'S-001', materials });
  run = advanceAcquisitionRun(run, 'ACQUISITION');
  assert.equal(run.phase, 'ACQUISITION');
  assert.equal(run.materials.length, 72);

  run = advanceAcquisitionRun(run, 'CONTRAST');
  assert.equal(run.materials.length, 32);

  run = advanceAcquisitionRun(run, 'RECOGNITION_TRANSFER');
  assert.equal(run.materials.length, 24);
  assert.ok(run.materials.every((item) => !('semanticBinding' in item) || item.semanticBinding === null));

  run = advanceAcquisitionRun(run, 'PRODUCTION_TRANSFER');
  assert.equal(run.materials.length, 24);
  run = advanceAcquisitionRun(run, 'FEEDBACK');
  assert.equal(run.phase, 'FEEDBACK');
});

test('run cannot skip protocol phases', () => {
  const run = createAcquisitionRun({ participantId: 'P-001', sessionId: 'S-001', materials });
  assert.throws(() => advanceAcquisitionRun(run, 'CONTRAST'), /invalid protocol transition/i);
});
