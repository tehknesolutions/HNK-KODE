import { createHash } from 'node:crypto';

export function createProvenanceConformanceBundle(conformance = {}, metadata = {}) {
  if (conformance?.status !== 'CONFORMANT' || !conformance.stages || !conformance.digest) return Object.freeze({ status:'REJECTED', bundle:null, reason:'NON_CONFORMANT_INPUT' });
  const payload={version:'m34-v1',kind:'GOODLE_PROVENANCE_CONFORMANCE_BUNDLE',protocol:'M29-M30-M31-M32-M33',stages:{...conformance.stages},sourceDigest:conformance.digest,ledger:metadata.ledger ?? 'M33',createdAt:metadata.createdAt ?? null};
  const serialized=JSON.stringify(payload);
  const digest=createHash('sha256').update(serialized).digest('hex');
  return Object.freeze({status:'CREATED',bundle:Object.freeze({...payload,digest}),serialized});
}

export function verifyProvenanceConformanceBundle(bundle = {}) {
  if (bundle?.version !== 'm34-v1' || bundle?.kind !== 'GOODLE_PROVENANCE_CONFORMANCE_BUNDLE' || !bundle.digest) return Object.freeze({valid:false,reason:'INVALID_BUNDLE'});
  const {digest,...payload}=bundle; const expected=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return Object.freeze({valid:digest===expected,reason:digest===expected?undefined:'DIGEST_MISMATCH'});
}