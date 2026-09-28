function validateCriteria(criteria) {
  if (!criteria?.version) {
    throw new Error('Interpretation criteria require a version');
  }
  if (criteria.calibratedWithHoldout === true) {
    throw new Error('Interpretation criteria cannot be calibrated with HOLDOUT outcomes');
  }
}

function holdoutN(curve) {
  return curve.reduce((sum, band) => sum + band.n, 0);
}

export function interpretAcquisition(metrics, criteria) {
  validateCriteria(criteria);
  const n = holdoutN(metrics.curve);

  let classification = 'MEMORIZATION_COMPATIBLE';
  if (n < criteria.minimumHoldoutN) {
    classification = 'INSUFFICIENT_EVIDENCE';
  } else if (
    metrics.PT >= criteria.productivePT
    && metrics.RPG <= criteria.maxRPG
  ) {
    classification = 'PRODUCTIVE_TRANSFER_OBSERVED';
  } else if (metrics.RT >= criteria.structuralRT) {
    classification = 'STRUCTURAL_TRANSFER_OBSERVED';
  }

  return Object.freeze({
    classification,
    criteriaVersion: criteria.version,
  });
}
