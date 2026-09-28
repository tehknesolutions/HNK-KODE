export const PHASES = Object.freeze([
  'BASELINE',
  'ACQUISITION',
  'CONTRAST',
  'RECOGNITION_TRANSFER',
  'PRODUCTION_TRANSFER',
  'FEEDBACK',
]);

export function createAcquisitionSession({ participantId, sessionId }) {
  return Object.freeze({
    participantId,
    sessionId,
    phase: PHASES[0],
  });
}

export function transitionAcquisitionSession(session, nextPhase) {
  const currentIndex = PHASES.indexOf(session.phase);
  const nextIndex = PHASES.indexOf(nextPhase);

  if (currentIndex < 0 || nextIndex !== currentIndex + 1) {
    throw new Error(`Invalid protocol transition: ${session.phase} -> ${nextPhase}`);
  }

  return Object.freeze({ ...session, phase: nextPhase });
}
