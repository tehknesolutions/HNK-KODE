import { exportVerifiedAnchorRegistrySealArchive } from './evidence-provenance-verified-anchor-registry-seal-archive.mjs';
import { importVerifiedAnchorRegistrySealArchive } from './evidence-provenance-verified-anchor-registry-seal-archive-import.mjs';

export function runVerifiedAnchorRegistrySealArchiveRoundTrip(result={}) {
  if(result?.status!=='ANCHOR_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT'||result?.evidenceClass!=='PROTOCOL_CONFORMANCE'||!result?.seal?.digest)return Object.freeze({status:'REJECTED',failedStage:'M58_INPUT',reason:'INVALID_M55_RESULT'});
  const exported=exportVerifiedAnchorRegistrySealArchive(result);
  if(exported.status!=='EXPORTED')return Object.freeze({status:'REJECTED',failedStage:'M56_EXPORT',reason:exported.reason??'ARCHIVE_EXPORT_FAILED'});
  const imported=importVerifiedAnchorRegistrySealArchive(JSON.parse(JSON.stringify(exported.archive)));
  if(imported.status!=='IMPORTED_VERIFIED')return Object.freeze({status:'REJECTED',failedStage:'M57_IMPORT',reason:imported.reason??'ARCHIVE_IMPORT_FAILED'});
  if(JSON.stringify(exported.archive)!==JSON.stringify(imported.archive))return Object.freeze({status:'REJECTED',failedStage:'M58_EQUIVALENCE',reason:'ARCHIVE_ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'ANCHOR_REGISTRY_SEAL_ARCHIVE_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M56:'PASS',M57:'PASS',M58:'PASS'}),digest:exported.archive.digest,sourceDigest:exported.archive.sourceDigest,archive:imported.archive,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
