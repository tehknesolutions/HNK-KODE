import { createCertificateRegistrySeal, verifyCertificateRegistrySeal } from './evidence-provenance-verified-certificate-registry-seal.mjs';

const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';

function reject(reason, stage) {
  return Object.freeze({status:'CERTIFICATE_REGISTRY_SEAL_ROUND_TRIP_REJECTED',reason,failedStage:stage,evidenceClass:EVIDENCE_CLASS});
}

function canonicalSnapshot(snapshot={}) {
  return JSON.stringify({evidenceClass:snapshot.evidenceClass,entries:[...(snapshot.entries ?? [])].sort((a,b)=>a.digest.localeCompare(b.digest))});
}

export function verifyCertificateRegistrySealRoundTrip(snapshot = {}) {
  if(snapshot?.evidenceClass!==EVIDENCE_CLASS || !Array.isArray(snapshot.entries)) return reject('INVALID_REGISTRY_SNAPSHOT','M44_SEAL');
  const created=createCertificateRegistrySeal(snapshot);
  if(created.status!=='SEALED' || !created.seal) return reject(created.reason ?? 'REGISTRY_SEAL_CREATE_FAILED','M44_SEAL');
  const verified=verifyCertificateRegistrySeal(JSON.parse(JSON.stringify(created.seal)));
  if(verified.valid!==true) return reject(verified.reason ?? 'REGISTRY_SEAL_VERIFY_FAILED','M44_VERIFY');
  if(canonicalSnapshot(snapshot)!==canonicalSnapshot({evidenceClass:created.seal.evidenceClass,entries:created.seal.entries})) return reject('REGISTRY_SNAPSHOT_MISMATCH','M45_EQUIVALENCE');
  return Object.freeze({status:'CERTIFICATE_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT',evidenceClass:EVIDENCE_CLASS,registryDigest:created.seal.digest,entryCount:created.seal.entryCount,certificateDigests:Object.freeze(created.seal.entries.map(entry=>entry.digest)),protocol:created.seal.protocol,stages:Object.freeze({M44_SEAL:'PASS',M44_VERIFY:'PASS',M45_EQUIVALENCE:'PASS'}),seal:created.seal});
}

export const createCertificateRegistrySealRoundTrip = verifyCertificateRegistrySealRoundTrip;
