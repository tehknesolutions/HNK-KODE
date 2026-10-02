const EVIDENCE_CLASS='PROTOCOL_CONFORMANCE';

function canonical(value) { return JSON.stringify(value); }

function toEntry(result) {
  const certificate=result.certificate;
  return Object.freeze({digest:certificate.digest,sourceDigest:certificate.sourceDigest,protocol:certificate.protocol,evidenceClass:EVIDENCE_CLASS,stages:Object.freeze({...certificate.stages}),certificate:Object.freeze({...certificate,stages:Object.freeze({...certificate.stages})})});
}

function valid(result = {}) {
  return result?.status==='CERTIFICATE_ROUND_TRIP_CONFORMANT' && result?.evidenceClass===EVIDENCE_CLASS && result?.certificate?.evidenceClass===EVIDENCE_CLASS && !!result?.certificate?.digest && result.digest===result.certificate.digest;
}

export function createVerifiedCertificateRegistry() {
  const entries=new Map();
  return Object.freeze({
    register(result = {}) {
      if(!valid(result)) return Object.freeze({status:'REJECTED',reason:'INVALID_M42_CERTIFICATE'});
      const entry=toEntry(result); const existing=entries.get(entry.digest);
      if(existing) return Object.freeze(canonical(existing)===canonical(entry)?{status:'ALREADY_REGISTERED',entry:existing}:{status:'REGISTRY_CONFLICT',reason:'DIGEST_CONTENT_CONFLICT',existing});
      entries.set(entry.digest,entry); return Object.freeze({status:'REGISTERED',entry});
    },
    get(digest) { return entries.get(digest) ?? null; },
    snapshot() { return Object.freeze({evidenceClass:EVIDENCE_CLASS,entries:Object.freeze([...entries.values()])}); }
  });
}
