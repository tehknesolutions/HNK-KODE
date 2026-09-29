import {
  createAcquisitionSession,
  transitionAcquisitionSession,
} from './acquisition-session-protocol.mjs';

const materialForPhase = (phase, materials) => {
  if (phase === 'ACQUISITION') return materials.train;
  if (phase === 'CONTRAST') return materials.contrasts;
  if (phase === 'RECOGNITION_TRANSFER' || phase === 'PRODUCTION_TRANSFER') {
    return materials.holdout;
  }
  return undefined;
};

export function createAcquisitionRun({ participantId, sessionId, materials, versions }) {
  const session = createAcquisitionSession({ participantId, sessionId });
  return Object.freeze({
    ...session,
    ...(versions ? { versions: Object.freeze({ ...versions }) } : {}),
    materialCounts: Object.freeze({
      train: materials.train.length,
      contrasts: materials.contrasts.length,
      holdout: materials.holdout.length,
    }),
    _materials: materials,
  });
}

export function advanceAcquisitionRun(run, nextPhase) {
  const session = transitionAcquisitionSession(run, nextPhase);
  const materials = run._materials;
  const phaseMaterials = materialForPhase(nextPhase, materials);

  const next = {
    ...session,
    materialCounts: run.materialCounts,
    ...(run.versions ? { versions: run.versions } : {}),
    _materials: materials,
  };
  if (phaseMaterials !== undefined) next.materials = phaseMaterials;

  return Object.freeze(next);
}
