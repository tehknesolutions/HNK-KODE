import { createHash } from 'node:crypto';

export function createProvenanceClosureArtifact(input = {}) {
  const { closure, diff, impact } = input;
  if (closure?.status !== 'CLOSED' || !closure.summary || !diff?.direct || !diff?.ancestors || impact?.status !== 'ANALYZED' || !impact.impact) return Object.freeze({ status:'REJECTED', artifact:null, reason:'INVALID_CLOSURE_INPUT' });
  const payload={version:'m30-v1',kind:'GOODLE_PROVENANCE_CLOSURE_ARTIFACT',summary:{...closure.summary},diff:{direct:{...diff.direct},ancestors:{...diff.ancestors}},impact:{...impact.impact}};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  const artifact=Object.freeze({ ...payload, digest });
  return Object.freeze({status:'CREATED',artifact,serialized});
}

export function verifyProvenanceClosureArtifact(artifact = {}) {
  if (artifact?.version !== 'm30-v1' || artifact?.kind !== 'GOODLE_PROVENANCE_CLOSURE_ARTIFACT' || !artifact.digest) return Object.freeze({valid:false,reason:'INVALID_ARTIFACT'});
  const {digest,...payload}=artifact; const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return Object.freeze({valid:digest===expected,reason:digest===expected?undefined:'DIGEST_MISMATCH'});
}