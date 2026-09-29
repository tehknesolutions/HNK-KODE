function assertObservation(observation) {
  if (!Number.isFinite(observation?.structuralDistance)
      || observation.structuralDistance < 0) {
    throw new Error('Structural distance must be finite and non-negative');
  }
  for (const field of ['recognitionCorrect', 'productionExact']) {
    if (observation[field] !== 0 && observation[field] !== 1) {
      throw new Error('Transfer scores must be binary exact scores');
    }
  }
}

export function computeGeneralizationCurve(observations, versions) {
  if (!Array.isArray(observations) || observations.length === 0) {
    throw new Error('Generalization curve requires observations');
  }

  const bands = new Map();
  for (const observation of observations) {
    assertObservation(observation);
    const distance = observation.structuralDistance;
    const band = bands.get(distance) ?? { n: 0, recognition: 0, production: 0 };
    band.n += 1;
    band.recognition += observation.recognitionCorrect;
    band.production += observation.productionExact;
    bands.set(distance, band);
  }

  const curve = [...bands.entries()]
    .sort(([a], [b]) => a - b)
    .map(([distance, band]) => Object.freeze({
      distance,
      n: band.n,
      RT: band.recognition / band.n,
      PT: band.production / band.n,
    }));

  const frozenCurve = Object.freeze(curve);
  if (!versions) return frozenCurve;

  return Object.freeze({
    protocolVersion: versions.protocolVersion,
    dataVersion: versions.dataVersion,
    curve: frozenCurve,
  });
}
