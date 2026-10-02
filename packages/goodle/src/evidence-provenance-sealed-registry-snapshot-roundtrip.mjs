import { exportSealedRegistrySnapshot, importSealedRegistrySnapshot } from './evidence-provenance-sealed-registry-snapshot.mjs';

export function runSealedRegistrySnapshotRoundTrip(input = {}) {
  const exported=exportSealedRegistrySnapshot(input);
  if(exported.status!=='EXPORTED') return Object.freeze({status:'REJECTED',failedStage:'M47_EXPORT',reason:exported.reason ?? 'SNAPSHOT_EXPORT_FAILED'});
  const imported=importSealedRegistrySnapshot(JSON.parse(JSON.stringify(exported.envelope)));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M47_IMPORT',reason:imported.reason ?? 'SNAPSHOT_IMPORT_FAILED'});
  const equivalent=JSON.stringify(exported.snapshot)===JSON.stringify(imported.snapshot);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M48_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'SEALED_SNAPSHOT_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M47_EXPORT:'PASS',M47_IMPORT:'PASS'}),digest:exported.envelope.digest,snapshot:imported.snapshot,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
