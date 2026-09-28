const RESOLVED = new Set(['DIRECT','DERIVED_UNIQUE']);
const AMBIGUOUS = new Set(['DERIVED_AMBIGUOUS']);

function bindingReadiness(binding) {
  if (!binding) return 'NO_BINDING';
  if (binding.authority === 'HNK_CANON') return 'CANON_BINDING';
  if (binding.authority === 'HUMAN_REVIEW') return 'HUMAN_REVIEW_REQUIRED';
  if (binding.authority === 'HNK_CANDIDATE') return 'EXPERIMENTAL_BINDING_CANDIDATE';
  return 'NO_BINDING';
}

export function evaluateLanguageEligibility(record, {binding=null}={}) {
  const glyphId = record?.glyphId ?? record?.legacyIdentity?.glyphId;
  const resolutionStatus = record?.resolutionStatus;
  const candidateProjectionIds =
    record?.candidateProjectionIds ??
    record?.projectionSet?.map(p => p.projectionId) ??
    record?.candidates?.map(c => c.projectionId) ??
    [];

  if (!glyphId) throw new Error('Language Eligibility V1 requires glyph identity');

  const reasons = [];
  let structuralEligibility = 'BLOCKED_STRUCTURAL';

  if (RESOLVED.has(resolutionStatus) && candidateProjectionIds.length === 1) {
    structuralEligibility = 'STRUCTURAL_EXPERIMENT_READY';
    reasons.push('single_structural_projection_available');
  } else if (AMBIGUOUS.has(resolutionStatus) && candidateProjectionIds.length >= 2) {
    structuralEligibility = 'AMBIGUOUS_EXPERIMENT_SET';
    reasons.push('identity_ambiguity_preserved_as_candidate_set');
  } else {
    reasons.push('no_usable_structural_projection');
  }

  const readiness = bindingReadiness(binding);
  const namespace = binding?.namespace ?? 'EXPERIMENTAL';

  let canonicalBindingAllowed =
    structuralEligibility === 'STRUCTURAL_EXPERIMENT_READY' &&
    readiness === 'CANON_BINDING';

  if (readiness === 'CANON_BINDING') {
    const provenance = binding?.provenance;
    const linguistic = binding?.linguisticBinding;
    const hasProvenance = Boolean(provenance?.source && provenance?.decision && provenance?.version);
    const hasLinguisticPayload = Boolean(
      linguistic &&
      Object.values(linguistic).some(v => v !== null && v !== undefined && v !== '')
    );
    const safeNamespace = namespace !== 'EXPERIMENTAL' && namespace !== 'RESERVED';
    if (!hasProvenance) { canonicalBindingAllowed = false; reasons.push('canon_binding_missing_provenance'); }
    if (!hasLinguisticPayload) { canonicalBindingAllowed = false; reasons.push('canon_binding_missing_linguistic_payload'); }
    if (!safeNamespace) { canonicalBindingAllowed = false; reasons.push('canon_binding_namespace_not_promotable'); }
  }

  if (structuralEligibility === 'AMBIGUOUS_EXPERIMENT_SET') canonicalBindingAllowed = false;
  if (readiness === 'NO_BINDING') reasons.push('no_linguistic_binding_assigned');

  return {
    version:'LANG-ELIG-V1',
    identityId:glyphId,
    structuralEligibility,
    bindingReadiness:readiness,
    namespace,
    canonicalBindingAllowed,
    reasons,
    candidateProjectionIds:[...candidateProjectionIds]
  };
}

export function evaluateBenchmarkEligibility(acquisitionArtifact) {
  if (!acquisitionArtifact || !Array.isArray(acquisitionArtifact.records)) {
    throw new Error('Language Eligibility V1 requires acquisition records');
  }
  const records = acquisitionArtifact.records.map(record => evaluateLanguageEligibility(record));
  return {
    schemaVersion:'1.0.0',
    policy:'HNK-KODESCRIPT-LANGUAGE-ELIGIBILITY-V1',
    records,
    summary:{
      total:records.length,
      structuralExperimentReady:records.filter(r=>r.structuralEligibility==='STRUCTURAL_EXPERIMENT_READY').length,
      ambiguousExperimentSet:records.filter(r=>r.structuralEligibility==='AMBIGUOUS_EXPERIMENT_SET').length,
      blockedStructural:records.filter(r=>r.structuralEligibility==='BLOCKED_STRUCTURAL').length,
      canonicalBindings:records.filter(r=>r.canonicalBindingAllowed).length
    },
    automaticSemanticAssignments:0,
    authority:'STRUCTURAL_ONLY'
  };
}
