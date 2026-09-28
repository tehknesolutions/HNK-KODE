const secrets = new WeakMap();

function requireExpectedResponse(stimulus) {
  if (!stimulus || !('expectedResponse' in stimulus)) {
    throw new Error('HOLDOUT stimulus requires expectedResponse');
  }
}

export function recordHoldoutRecognition(stimulus, response) {
  requireExpectedResponse(stimulus);
  const publicStimulus = Object.freeze({ stimulusId: stimulus.stimulusId });
  const secret = Object.freeze({
    answerKey: stimulus.expectedResponse,
    recognitionResponse: response.response,
  });
  secrets.set(publicStimulus, secret);
  return Object.freeze({
    phase: 'RECOGNITION_TRANSFER',
    stimulus: publicStimulus,
    recognition: Object.freeze({ ...response }),
  });
}

export function openHoldoutProduction(state) {
  if (state?.phase !== 'RECOGNITION_TRANSFER' || !secrets.has(state.stimulus)) {
    throw new Error('Production requires completed recognition');
  }
  const publicStimulus = Object.freeze({ ...state.stimulus });
  secrets.set(publicStimulus, secrets.get(state.stimulus));
  return Object.freeze({
    phase: 'PRODUCTION_TRANSFER',
    stimulus: publicStimulus,
  });
}

export function revealHoldoutFeedback(state) {
  if (state?.phase !== 'PRODUCTION_TRANSFER' || !state.production) {
    throw new Error('Feedback requires completed production response');
  }
  const secret = secrets.get(state.stimulus);
  if (!secret) throw new Error('Production state lacks HOLDOUT secret');
  return Object.freeze({
    phase: 'FEEDBACK',
    recognitionCorrect: secret.recognitionResponse === secret.answerKey,
    productionCorrect: state.production.response === secret.answerKey,
  });
}
