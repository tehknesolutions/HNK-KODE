import test from 'node:test';
import assert from 'node:assert/strict';

import { computeGeneralizationCurve } from '../src/acquisition-generalization-curve.mjs';

const OBSERVATIONS = Object.freeze([
  Object.freeze({ structuralDistance: 1, recognitionCorrect: 1, productionExact: 1 }),
  Object.freeze({ structuralDistance: 1, recognitionCorrect: 1, productionExact: 0 }),
  Object.freeze({ structuralDistance: 3, recognitionCorrect: 1, productionExact: 0 }),
  Object.freeze({ structuralDistance: 3, recognitionCorrect: 0, productionExact: 0 }),
  Object.freeze({ structuralDistance: 3, recognitionCorrect: 1, productionExact: 1 }),
]);

test('G(d) groups transfer performance by structural distance', () => {
  assert.deepEqual(computeGeneralizationCurve(OBSERVATIONS), [
    { distance: 1, n: 2, RT: 1, PT: 0.5 },
    { distance: 3, n: 3, RT: 2 / 3, PT: 1 / 3 },
  ]);
});

test('G(d) orders distance bands ascending regardless of input order', () => {
  const reversed = [...OBSERVATIONS].reverse();
  assert.deepEqual(
    computeGeneralizationCurve(reversed).map((band) => band.distance),
    [1, 3],
  );
});

test('G(d) preserves source observations and returns immutable bands', () => {
  const before = JSON.stringify(OBSERVATIONS);
  const curve = computeGeneralizationCurve(OBSERVATIONS);
  assert.equal(JSON.stringify(OBSERVATIONS), before);
  assert.equal(Object.isFrozen(curve), true);
  assert.ok(curve.every(Object.isFrozen));
});

test('G(d) accepts only finite non-negative distances and binary exact scores', () => {
  assert.throws(
    () => computeGeneralizationCurve([
      { structuralDistance: -1, recognitionCorrect: 1, productionExact: 1 },
    ]),
    /distance/i,
  );
  assert.throws(
    () => computeGeneralizationCurve([
      { structuralDistance: 2, recognitionCorrect: 0.5, productionExact: 1 },
    ]),
    /binary/i,
  );
});

test('G(d) rejects an empty observation set', () => {
  assert.throws(() => computeGeneralizationCurve([]), /observation/i);
});
