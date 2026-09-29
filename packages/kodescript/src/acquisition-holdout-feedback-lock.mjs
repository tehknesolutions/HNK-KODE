const freeze = value => Object.freeze(value);

export function createHoldoutProgress(stimulusId) {
  if (!stimulusId) throw new Error('stimulusId is required');
  return freeze({ stimulusId, recognitionLocked: false, productionLocked: false });
}

export function lockRecognition(state, response) {
  if (state.recognitionLocked) throw new Error('recognition already locked');
  return freeze({
    stimulusId: state.stimulusId,
    recognitionLocked: true,
    productionLocked: false,
    recognitionResponse: response,
  });
}

export function lockProduction(state, response) {
  if (!state.recognitionLocked) throw new Error('recognition must be locked first');
  if (state.productionLocked) throw new Error('production already locked');
  return freeze({
    stimulusId: state.stimulusId,
    recognitionLocked: true,
    productionLocked: true,
    productionResponse: freeze({ ...response }),
  });
}

export function revealFeedback(state, feedback) {
  if (!state.recognitionLocked || !state.productionLocked) {
    throw new Error('both recognition and production must be locked before feedback');
  }
  if ('feedback' in state) throw new Error('feedback already revealed');
  return freeze({
    ...state,
    feedback: freeze({ ...feedback }),
  });
}
