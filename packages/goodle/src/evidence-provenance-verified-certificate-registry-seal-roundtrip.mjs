import { createCertificateRegistrySeal } from './evidence-provenance-verified-certificate-registry-seal.mjs';
import { importCertificateRegistrySeal } from './evidence-provenance-verified-certificate-registry-seal-import.mjs';

export function createCertificateRegistrySealRoundTrip(snapshot = {}) {
  const created=createCertificateRegistrySeal(snapshot);
  if(created.status!=='SEALED') return Object.freeze({status:'REJECTED',failedStage:'M44_CREATE',reason:created.reason ?? 'REGISTRY_SEAL_CREATE_FAILED'});
  const imported=importCertificateRegistrySeal(JSON.parse(JSON.stringify(created.seal)));
  if(imported.status!=='IMPORTED_VERIFIED') return Object.freeze({status:'REJECTED',failedStage:'M45_IMPORT',reason:imported.reason ?? 'REGISTRY_SEAL_IMPORT_FAILED'});
  const equivalent=JSON.stringify(created.seal)===JSON.stringify(imported.seal);
  if(!equivalent) return Object.freeze({status:'REJECTED',failedStage:'M46_EQUIVALENCE',reason:'ROUND_TRIP_MISMATCH'});
  return Object.freeze({status:'REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',stages:Object.freeze({M44:'PASS',M45:'PASS'}),digest:created.seal.digest,seal:imported.seal,evidenceClass:'PROTOCOL_CONFORMANCE'});
}
