import test from 'node:test';
import assert from 'node:assert/strict';

import { computeGeneralizationCurve } from '../src/acquisition-generalization-curve.mjs';

const versions = Object.freeze({
  protocolVersion: 'ASP-V1', dataVersion: 'FEC-V1',
});
const observations = Object.freeze([
  Object.freeze({ structuralDistance: 1, recognitionCorrect: 1, productionExact: 1 }),
  Object.freeze({ structuralDistance: 3, recognitionCorrect: 1, productionExact: 0 }),
]);

test('G(d) result identifies protocol and data versions', () => {
  const result = computeGeneralizationCurve(observations, versions);
  assert.equal(result.protocolVersion, versions.protocolVersion);
  assert.equal(result.dataVersion, versions.dataVersion);
  assert.deepEqual(result.curve.map(x => x.distance), [1, 3]);
});

test('versioned G(d) result and curve remain immutable', () => {
  const result = computeGeneralizationCurve(observations, versions);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.curve), true);
  assert.ok(result.curve.every(Object.isFrozen));
});
