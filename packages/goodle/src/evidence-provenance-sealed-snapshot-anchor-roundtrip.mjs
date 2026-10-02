import { createSealedSnapshotAnchor } from './evidence-provenance-sealed-snapshot-anchor.mjs';
import { importSealedSnapshotAnchor } from './evidence-provenance-sealed-snapshot-anchor-import.mjs';

export function runSealedSnapshotAnchorRoundTrip(input={}) {
  const created=createSealedSnapshotAnchor(input);
  if(created.status!=='ANCHORED') return Object.freeze({status:'REJECTED',failedStage:'M49_CREATE',reason:created.reason ?? 'ANCHOR_CREATE_FAILED'});
  const imported=importSealedSnapshotAnchor(JSON.parse(JSON.stringify(created.anchor)));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M50_IMPORT',reason:imported.reason ?? 'ANCHOR_IMPORT_FAILED'});
  const equivalent=JSON.stringify(created.anchor)===JSON.stringify(imported.anchor);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M51_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'ANCHOR_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M49:'PASS',M50:'PASS'}),digest:created.anchor.digest,anchor:imported.anchor,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
