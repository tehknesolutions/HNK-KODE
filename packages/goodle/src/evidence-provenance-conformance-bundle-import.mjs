import { verifyProvenanceConformanceBundle } from './evidence-provenance-conformance-bundle.mjs';

function validShape(bundle = {}) {
  return bundle?.version === 'm34-v1' && bundle?.kind === 'GOODLE_PROVENANCE_CONFORMANCE_BUNDLE' && bundle?.protocol === 'M29-M30-M31-M32-M33' && !!bundle.digest && !!bundle.sourceDigest && !!bundle.stages && bundle.stages.M30 === 'PASS' && bundle.stages.M31 === 'PASS' && bundle.stages.M32 === 'PASS';
}

export function importProvenanceConformanceBundle(bundle = {}) {
  if (!validShape(bundle)) return Object.freeze({ status:'REJECTED', bundle:null, reason:'INVALID_BUNDLE_SHAPE' });
  const verification = verifyProvenanceConformanceBundle(bundle);
  if (!verification.valid) return Object.freeze({ status:'REJECTED', bundle:null, reason:verification.reason });
  const imported = Object.freeze({ version:bundle.version, kind:bundle.kind, protocol:bundle.protocol, stages:Object.freeze({...bundle.stages}), sourceDigest:bundle.sourceDigest, ledger:bundle.ledger ?? null, createdAt:bundle.createdAt ?? null, digest:bundle.digest });
  return Object.freeze({ status:'IMPORTED_VERIFIED', bundle:imported, verification });
}