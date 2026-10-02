function freezeEntry(bundle) {
  return Object.freeze({
    version: bundle.version,
    kind: bundle.kind,
    protocol: bundle.protocol,
    stages: Object.freeze({ ...bundle.stages }),
    sourceDigest: bundle.sourceDigest,
    ledger: bundle.ledger ?? null,
    createdAt: bundle.createdAt ?? null,
    digest: bundle.digest
  });
}

function sameEntry(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function createVerifiedBundleRegistry() {
  const entries = new Map();

  function register(importResult = {}) {
    if (importResult?.status !== 'IMPORTED_VERIFIED' || !importResult?.verification?.valid || !importResult?.bundle?.digest) {
      return Object.freeze({ status: 'REJECTED', reason: 'M35_VERIFIED_IMPORT_REQUIRED', digest: null, entry: null });
    }

    const candidate = freezeEntry(importResult.bundle);
    const existing = entries.get(candidate.digest);
    if (existing) {
      if (!sameEntry(existing, candidate)) {
        return Object.freeze({ status: 'REJECTED', reason: 'DIGEST_CONFLICT', digest: candidate.digest, entry: null });
      }
      return Object.freeze({ status: 'ALREADY_REGISTERED', digest: candidate.digest, entry: existing });
    }

    entries.set(candidate.digest, candidate);
    return Object.freeze({ status: 'REGISTERED', digest: candidate.digest, entry: candidate });
  }

  function get(digest) {
    return entries.get(digest) ?? null;
  }

  function snapshot() {
    return Object.freeze([...entries.values()]);
  }

  return Object.freeze({ register, get, snapshot, size: () => entries.size });
}
