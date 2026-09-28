import test from 'node:test';
import assert from 'node:assert/strict';

import { computeSessionMetrics } from '../src/acquisition-session-metrics.mjs';

const SCORES = Object.freeze({
  recognition: Object.freeze([1, 1, 0, 1]),
  production: Object.freeze([1, 0, 0, 1]),
  contrast: Object.freeze([1, 1, 1, 0]),
});

test('session metrics derive RT, PT, RPG, and CA from exact scores', () => {
  assert.deepEqual(computeSessionMetrics(SCORES), {
    RT: 0.75,
    PT: 0.5,
    RPG: 0.25,
    CA: 0.75,
  });
});

test('metric derivation does not mutate source score arrays', () => {
  const before = JSON.stringify(SCORES);
  computeSessionMetrics(SCORES);
  assert.equal(JSON.stringify(SCORES), before);
});

test('session metrics reject missing or empty score channels', () => {
  assert.throws(
    () => computeSessionMetrics({ recognition: [], production: [1], contrast: [1] }),
    /recognition/i,
  );
  assert.throws(
    () => computeSessionMetrics({ recognition: [1], production: [], contrast: [1] }),
    /production/i,
  );
  assert.throws(
    () => computeSessionMetrics({ recognition: [1], production: [1], contrast: [] }),
    /contrast/i,
  );
});

test('session metrics accept only binary exact scores', () => {
  assert.throws(
    () => computeSessionMetrics({ ...SCORES, production: [1, 0.5] }),
    /binary/i,
  );
});

test('returned metrics are immutable', () => {
  assert.equal(Object.isFrozen(computeSessionMetrics(SCORES)), true);
});
