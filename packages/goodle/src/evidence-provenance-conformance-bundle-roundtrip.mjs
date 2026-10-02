import { createProvenanceConformanceBundle } from './evidence-provenance-conformance-bundle.mjs';
import { importProvenanceConformanceBundle } from './evidence-provenance-conformance-bundle-import.mjs';

export function runConformanceBundleRoundTrip(input = {}, metadata = {}) {
  const created=createProvenanceConformanceBundle(input,metadata);
  if(created.status!=='CREATED') return Object.freeze({status:'REJECTED',failedStage:'M34_CREATE',reason:created.reason});
  const imported=importProvenanceConformanceBundle(JSON.parse(created.serialized));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M35_IMPORT',reason:imported.reason});
  const equivalent=JSON.stringify(created.bundle)===JSON.stringify(imported.bundle);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M36_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'CONFORMANT_ROUND_TRIP',stages:Object.freeze({M34:'PASS',M35:'PASS'}),digest:created.bundle.digest,bundle:imported.bundle});
}