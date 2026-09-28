import test from 'node:test';
import assert from 'node:assert/strict';

import {
  scoreRecognition,
  scoreProduction,
} from '../src/acquisition-exact-scoring.mjs';

test('recognition scoring is exact binary correctness', () => {
  assert.deepEqual(scoreRecognition('same-family', 'same-family'), {
    recognitionCorrect: 1,
  });
  assert.deepEqual(scoreRecognition('different-family', 'same-family'), {
    recognitionCorrect: 0,
  });
});

test('production exact score remains zero when only structural parts match', () => {
  const score = scoreProduction(
    { family: 'MF', radial: 'R2', angular: 'A7' },
    { family: 'MF', radial: 'R2', angular: 'A3' },
  );
  assert.equal(score.productionExact, 0);
  assert.equal(score.structuralMatched, 2);
  assert.equal(score.structuralTotal, 3);
});

test('production exact score is one only for a complete structural match', () => {
  const expected = { family: 'CR:D', radial: 'R4', angular: 'A1' };
  const score = scoreProduction(expected, { ...expected });
  assert.deepEqual(score, {
    productionExact: 1,
    structuralMatched: 3,
    structuralTotal: 3,
  });
});

test('partial structural evidence never promotes productionExact', () => {
  const score = scoreProduction(
    { family: 'MF+CG', radial: 'R1', angular: 'A2' },
    { family: 'MF+CG', radial: 'R9', angular: 'A2' },
  );
  assert.equal(score.productionExact, 0);
  assert.ok(score.structuralMatched > 0);
});

test('production scoring rejects mismatched structural schemas', () => {
  assert.throws(
    () => scoreProduction({ family: 'MF', radial: 'R1' }, { family: 'MF' }),
    /structural/i,
  );
});
