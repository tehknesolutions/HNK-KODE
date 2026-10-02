import { verifyProvenanceClosureArtifact } from './evidence-provenance-closure-artifact.mjs';

function validShape(artifact = {}) {
  return artifact?.version === 'm30-v1' && artifact?.kind === 'GOODLE_PROVENANCE_CLOSURE_ARTIFACT' && !!artifact.digest && !!artifact.summary && !!artifact.diff?.direct && !!artifact.diff?.ancestors && !!artifact.impact;
}

export function importProvenanceClosureArtifact(artifact = {}) {
  if (!validShape(artifact)) return Object.freeze({ status:'REJECTED', artifact:null, reason:'INVALID_ARTIFACT_SHAPE' });
  const verification = verifyProvenanceClosureArtifact(artifact);
  if (!verification.valid) return Object.freeze({ status:'REJECTED', artifact:null, reason:verification.reason });
  const imported = Object.freeze({
    version: artifact.version, kind: artifact.kind,
    summary: Object.freeze({ ...artifact.summary }),
    diff: Object.freeze({ direct:Object.freeze({ ...artifact.diff.direct }), ancestors:Object.freeze({ ...artifact.diff.ancestors }) }),
    impact: Object.freeze({ ...artifact.impact }),
    digest: artifact.digest,
  });
  return Object.freeze({ status:'IMPORTED_VERIFIED', artifact:imported, verification });
}