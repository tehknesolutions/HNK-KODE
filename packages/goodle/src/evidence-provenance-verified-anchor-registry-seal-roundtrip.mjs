import { createVerifiedAnchorRegistrySeal } from './evidence-provenance-verified-anchor-registry-seal.mjs';
import { importVerifiedAnchorRegistrySeal } from './evidence-provenance-verified-anchor-registry-seal-import.mjs';

export function runVerifiedAnchorRegistrySealRoundTrip(snapshot={}) {
  const created=createVerifiedAnchorRegistrySeal(snapshot);
  if(created.status!=='SEALED')return Object.freeze({status:'REJECTED',failedStage:'M53_CREATE',reason:created.reason??'SEAL_CREATE_FAILED'});
  const imported=importVerifiedAnchorRegistrySeal(JSON.parse(JSON.stringify(created.seal)));
  if(imported.status!=='IMPORTED_VERIFIED')return Object.freeze({status:'REJECTED',failedStage:'M54_IMPORT',reason:imported.reason??'SEAL_IMPORT_FAILED'});
  if(JSON.stringify(created.seal)!==JSON.stringify(imported.seal))return Object.freeze({status:'REJECTED',failedStage:'M55_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'ANCHOR_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M53:'PASS',M54:'PASS'}),digest:created.seal.digest,seal:imported.seal,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
