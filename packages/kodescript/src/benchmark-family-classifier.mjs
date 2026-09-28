import { extractGlyphFeatureVector } from './glyph-feature-vector.mjs';

export function classifyHybridBenchmark(hybridArtifact) {
  if (!hybridArtifact || !Array.isArray(hybridArtifact.records) || hybridArtifact.records.length !== 40) {
    throw new Error('HNK40 benchmark requires exactly 40 hybrid records');
  }

  const records = hybridArtifact.records.map(record => {
    const glyphId = record.legacyIdentity?.glyphId;
    const candidates = record.projectionSet.map(projection => ({
      projectionId: projection.projectionId,
      featureVector: extractGlyphFeatureVector({
        identityId: projection.projectionId,
        canonicalRepresentativeId: projection.projectionId,
        path: projection.path
      })
    }));

    const keyAgreement = {};
    for (const key of ['coarse', 'topological', 'radialAngular']) {
      const values = [...new Set(candidates.map(c => c.featureVector.familyKeys[key]))];
      keyAgreement[key] = { stable: values.length <= 1, values };
    }

    return {
      glyphId,
      resolutionStatus: record.resolutionStatus,
      preferredProjectionId: record.preferredProjectionId,
      candidateCount: candidates.length,
      candidates,
      familyAgreement: keyAgreement,
      authority: 'STRUCTURAL_ONLY'
    };
  });

  const allCandidates = records.flatMap(r => r.candidates);
  const familyCardinality = Object.fromEntries(
    ['coarse', 'topological', 'radialAngular'].map(key => [
      key,
      new Set(allCandidates.map(c => c.featureVector.familyKeys[key])).size
    ])
  );

  return {
    schemaVersion: '1.0.0',
    source: {
      schemaVersion: hybridArtifact.schemaVersion,
      derivationRule: hybridArtifact.derivationRule
    },
    summary: {
      glyphRecords: records.length,
      projectionCandidates: allCandidates.length,
      direct: records.filter(r => r.resolutionStatus === 'DIRECT').length,
      derivedUnique: records.filter(r => r.resolutionStatus === 'DERIVED_UNIQUE').length,
      derivedAmbiguous: records.filter(r => r.resolutionStatus === 'DERIVED_AMBIGUOUS').length,
      familyCardinality
    },
    records,
    authority: 'STRUCTURAL_ONLY'
  };
}
