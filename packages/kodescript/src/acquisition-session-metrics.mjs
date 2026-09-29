function meanBinary(name, scores) {
  if (!Array.isArray(scores) || scores.length === 0) {
    throw new Error(`${name} scores must be non-empty`);
  }
  if (!scores.every((score) => score === 0 || score === 1)) {
    throw new Error(`${name} scores must be binary exact scores`);
  }
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function computeSessionMetrics(scores, versions) {
  const RT = meanBinary('recognition', scores?.recognition);
  const PT = meanBinary('production', scores?.production);
  const CA = meanBinary('contrast', scores?.contrast);

  return Object.freeze({
    RT,
    PT,
    RPG: RT - PT,
    CA,
    ...(versions ? {
      protocolVersion: versions.protocolVersion,
      dataVersion: versions.dataVersion,
    } : {}),
  });
}
