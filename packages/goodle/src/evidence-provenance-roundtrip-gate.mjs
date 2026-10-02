import { createProvenanceClosureArtifact } from './evidence-provenance-closure-artifact.mjs';
import { importProvenanceClosureArtifact } from './evidence-provenance-closure-artifact-import.mjs';
import { roundTripProvenanceClosure } from './evidence-provenance-closure-roundtrip.mjs';

export function runProvenanceRoundTripConformance(input = {}) {
  const created = createProvenanceClosureArtifact(input);
  if (created.status !== 'CREATED') return Object.freeze({ status:'REJECTED', failedStage:'M30_CREATE', reason:'CREATE_FAILED' });
  const imported = importProvenanceClosureArtifact(JSON.parse(created.serialized));
  if (imported.status !== 'IMPORTED_VERIFIED') return Object.freeze({ status:'REJECTED', failedStage:'M31_IMPORT', reason:imported.reason ?? 'IMPORT_FAILED' });
  const roundTrip = roundTripProvenanceClosure(input);
  if (roundTrip.status !== 'ROUND_TRIP_VERIFIED') return Object.freeze({ status:'REJECTED', failedStage:'M32_ROUNDTRIP', reason:roundTrip.reason ?? 'ROUNDTRIP_FAILED' });
  return Object.freeze({ status:'CONFORMANT', stages:Object.freeze({ M30:'PASS', M31:'PASS', M32:'PASS' }), digest:created.artifact.digest });
}