import test from 'node:test';
import assert from 'node:assert/strict';

import { createHoldoutProgress, lockRecognition, lockProduction, revealFeedback } from '../src/acquisition-holdout-feedback-lock.mjs';

const ITEM = 'FEC-H-001';

test('recognition is locked without exposing correctness', () => {
  const state = lockRecognition(createHoldoutProgress(ITEM), 'same-family');
  assert.equal(state.recognitionResponse, 'same-family');
  assert.equal('recognitionCorrect' in state, false);
  assert.equal('feedback' in state, false);
});

test('production state cannot read recognition result or correction', () => {
  const recognized = lockRecognition(createHoldoutProgress(ITEM), 'same-family');
  const production = lockProduction(recognized, { path: ['A','B'] });
  assert.equal('recognitionResponse' in production, false);
  assert.equal('recognitionCorrect' in production, false);
  assert.equal('feedback' in production, false);
});

test('feedback is unavailable until recognition and production are both locked', () => {
  const empty = createHoldoutProgress(ITEM);
  assert.throws(() => revealFeedback(empty, { recognitionCorrect: true }), /both.*locked/i);
  const recognized = lockRecognition(empty, 'same-family');
  assert.throws(() => revealFeedback(recognized, { recognitionCorrect: true }), /both.*locked/i);
});

test('feedback can be revealed only after both responses are locked', () => {
  const recognized = lockRecognition(createHoldoutProgress(ITEM), 'same-family');
  const production = lockProduction(recognized, { path: ['A','B'] });
  const feedback = revealFeedback(production, {
    recognitionCorrect: true,
    productionExact: false,
  });
  assert.deepEqual(feedback.feedback, { recognitionCorrect: true, productionExact: false });
  assert.equal(Object.isFrozen(feedback), true);
  assert.equal(Object.isFrozen(feedback.feedback), true);
});
