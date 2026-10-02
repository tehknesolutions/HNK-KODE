import { createHash } from 'node:crypto';

function canonicalSource(source = {}) {
  return { id: source.id ?? null, sealDigest: source.sealDigest ?? null, semanticId: source.semanticId ?? null };
}

export function createArtifactProvenance(input = {}) {
  if (!input.derivedArtifactId || !Array.isArray(input.sources) || input.sources.length === 0 || !input.planFingerprint) return Object.freeze({ status: 'REJECTED', provenance: null, reason: 'INVALID_PROVENANCE_INPUT' });
  const seen = new Set();
  const sources = [];
  for (const source of input.sources) {
    const normalized = canonicalSource(source);
    if (!normalized.id || seen.has(normalized.id) || normalized.id === input.derivedArtifactId) return Object.freeze({ status: 'REJECTED', provenance: null, reason: 'AMBIGUOUS_SOURCE_LINEAGE' });
    seen.add(normalized.id); sources.push(Object.freeze(normalized));
  }
  sources.sort((a,b)=>a.id.localeCompare(b.id));
  const canonical = JSON.stringify({ derivedArtifactId: input.derivedArtifactId, planFingerprint: input.planFingerprint, sources });
  const fingerprint = createHash('sha256').update(canonical).digest('hex');
  return Object.freeze({ status: 'READY', provenance: Object.freeze({ version:'m25-v1', derivedArtifactId:input.derivedArtifactId, planFingerprint:input.planFingerprint, sources:Object.freeze(sources), fingerprint }) });
}

export function verifyArtifactProvenance(provenance = {}, graph = []) {
  if (provenance?.version !== 'm25-v1' || !provenance.fingerprint || !provenance.derivedArtifactId) return Object.freeze({ valid:false, reason:'INVALID_PROVENANCE' });
  const ids = new Set();
  for (const node of graph) {
    if (!node?.id || ids.has(node.id)) return Object.freeze({ valid:false, reason:'AMBIGUOUS_GRAPH' });
    ids.add(node.id);
  }
  if (ids.has(provenance.derivedArtifactId)) return Object.freeze({ valid:false, reason:'SELF_REFERENCE' });
  return Object.freeze({ valid:true, fingerprint:provenance.fingerprint, sourceCount:provenance.sources?.length ?? 0 });
}