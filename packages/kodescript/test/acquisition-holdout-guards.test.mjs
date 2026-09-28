import test from 'node:test';
import assert from 'node:assert/strict';

import {
  recordHoldoutRecognition,
  openHoldoutProduction,
  revealHoldoutFeedback,
} from '../src/acquisition-holdout-guards.mjs';

const HOLDOUT = Object.freeze({
  stimulusId: 'FEC-H-001',
  expectedResponse: 'same-family',
});

const RECOGNITION = Object.freeze({
  participantId: 'P-001',
  sessionId: 'S-001',
  response: 'same-family',
  responseTimeMs: 1200,
  structuralDistance: 4,
});

test('recognition records a HOLDOUT response without correctness feedback', () => {
  const state = recordHoldoutRecognition(HOLDOUT, RECOGNITION);
  assert.equal(state.phase, 'RECOGNITION_TRANSFER');
  assert.equal(state.recognition.response, 'same-family');
  assert.equal('expectedResponse' in state.recognition, false);
  assert.equal('correct' in state.recognition, false);
});

test('production opens without recognition result or answer leakage', () => {
  const recognized = recordHoldoutRecognition(HOLDOUT, RECOGNITION);
  const production = openHoldoutProduction(recognized);
  assert.equal(production.phase, 'PRODUCTION_TRANSFER');
  assert.equal('recognition' in production, false);
  assert.equal('expectedResponse' in production, false);
  assert.deepEqual(production.stimulus, { stimulusId: 'FEC-H-001' });
});

test('feedback is blocked until production response exists', () => {
  const production = openHoldoutProduction(
    recordHoldoutRecognition(HOLDOUT, RECOGNITION),
  );
  assert.throws(() => revealHoldoutFeedback(production), /production/i);
});

test('feedback reveals scoring only after both responses are locked', () => {
  const recognized = recordHoldoutRecognition(HOLDOUT, RECOGNITION);
  const production = {
    ...openHoldoutProduction(recognized),
    production: Object.freeze({ response: 'same-family', responseTimeMs: 2100 }),
  };
  const feedback = revealHoldoutFeedback(production);
  assert.equal(feedback.phase, 'FEEDBACK');
  assert.equal(feedback.recognitionCorrect, true);
  assert.equal(feedback.productionCorrect, true);
});

test('holdout guard state is immutable across recognition and production', () => {
  const recognized = recordHoldoutRecognition(HOLDOUT, RECOGNITION);
  const production = openHoldoutProduction(recognized);
  assert.equal(Object.isFrozen(recognized), true);
  assert.equal(Object.isFrozen(recognized.recognition), true);
  assert.equal(Object.isFrozen(production), true);
  assert.equal(Object.isFrozen(production.stimulus), true);
});

test('recognition requires a HOLDOUT answer key but never exposes it', () => {
  assert.throws(
    () => recordHoldoutRecognition({ stimulusId: 'FEC-H-001' }, RECOGNITION),
    /expectedResponse/i,
  );
});

test('production phase cannot be opened from an arbitrary state', () => {
  assert.throws(
    () => openHoldoutProduction({ phase: 'CONTRAST' }),
    /recognition/i,
  );
});

test('feedback cannot be requested before production phase', () => {
  const recognized = recordHoldoutRecognition(HOLDOUT, RECOGNITION);
  assert.throws(() => revealHoldoutFeedback(recognized), /production/i);
});
