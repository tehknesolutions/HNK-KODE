function assertArtifact(condition, message) {
  if (!condition) throw new TypeError(message);
}

function freezeRecord(record) {
  return Object.freeze({
    ...record,
    path: Object.freeze([...record.path]),
    familyKeys: Object.freeze({ ...record.familyKeys }),
  });
}

export function buildAcquisitionMaterials(corpus, contrastRegistry) {
  assertArtifact(corpus && Array.isArray(corpus.train), 'FEC corpus train must be an array');
  assertArtifact(Array.isArray(corpus.holdout), 'FEC corpus holdout must be an array');
  assertArtifact(contrastRegistry && Array.isArray(contrastRegistry.pairs), 'FEC contrasts pairs must be an array');

  const train = Object.freeze(corpus.train.map(freezeRecord));
  const holdout = Object.freeze(corpus.holdout.map(freezeRecord));
  const contrasts = Object.freeze(contrastRegistry.pairs.map((pair) => Object.freeze({
    ...pair,
    distance: Object.freeze({ ...pair.distance }),
  })));

  return Object.freeze({
    train,
    holdout,
    contrasts,
    semanticBindings: contrastRegistry.semanticBindings ?? 0,
  });
}
