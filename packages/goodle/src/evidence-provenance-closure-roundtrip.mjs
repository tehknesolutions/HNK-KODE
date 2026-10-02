import { createProvenanceClosureArtifact, verifyProvenanceClosureArtifact } from './evidence-provenance-closure-artifact.mjs';
import { importProvenanceClosureArtifact } from './evidence-provenance-closure-artifact-import.mjs';

export function roundTripProvenanceClosure(input = {}) {
  const created = createProvenanceClosureArtifact(input);
  if (created.status !== 'CREATED') return Object.freeze({ status:'REJECTED', reason:'CREATE_FAILED' });
  const parsed = JSON.parse(created.serialized);
  const imported = importProvenanceClosureArtifact(parsed);
  if (imported.status !== 'IMPORTED_VERIFIED') return Object.freeze({ status:'REJECTED', reason:imported.reason ?? 'IMPORT_FAILED' });
  const verification = verifyProvenanceClosureArtifact(parsed);
  const equivalent = JSON.stringify(parsed) === JSON.stringify(imported.artifact);
  if (!verification.valid || !equivalent) return Object.freeze({ status:'REJECTED', reason:'ROUND_TRIP_MISMATCH' });
  return Object.freeze({ status:'ROUND_TRIP_VERIFIED', artifact:imported.artifact, serialized:created.serialized, verification });
}