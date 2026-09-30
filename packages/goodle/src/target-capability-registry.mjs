function keyOf({ target, format, adapter }) {
  return `${target ?? ''}::${format ?? ''}::${adapter ?? ''}`;
}

function matchesArtifact(pattern, artifact) {
  if (!pattern || !artifact) return false;
  if (pattern.startsWith('*.')) return artifact.endsWith(pattern.slice(1));
  return pattern === artifact;
}

export function createTargetRegistry() {
  return Object.freeze({ kind: 'TargetCapabilityRegistry', entries: Object.freeze({}) });
}

export function registerTargetCapability(registry, capability) {
  for (const field of ['target', 'format', 'adapter', 'artifactPattern', 'authority']) {
    if (!capability?.[field]) throw new Error(`GOODLE_TARGET_CAPABILITY_MISSING:${field}`);
  }
  const key = keyOf(capability);
  return Object.freeze({
    kind: 'TargetCapabilityRegistry',
    entries: Object.freeze({
      ...(registry?.entries ?? {}),
      [key]: Object.freeze(structuredClone(capability)),
    }),
  });
}

export function resolveTargetCapability(registry, request) {
  const capability = registry?.entries?.[keyOf(request)] ?? null;
  if (!capability || !matchesArtifact(capability.artifactPattern, request?.artifact)) {
    return { status: 'UNSUPPORTED', capability: null };
  }
  return { status: 'SUPPORTED', capability };
}
