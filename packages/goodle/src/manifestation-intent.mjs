const GOODLE_MANIFESTATION_KINDS = new Set([
  'visual',
  'interativa',
  'sistema',
  'hibrida',
]);

export function normalizeManifestationIntent(input = {}) {
  const kind = input.manifestacao ?? null;
  const mapped = GOODLE_MANIFESTATION_KINDS.has(kind);

  return {
    kind,
    status: mapped ? 'INTENT_ONLY' : 'UNMAPPED',
    target: input.target ?? null,
    format: input.format ?? null,
    adapter: input.adapter ?? null,
    artifact: input.artifact ?? null,
  };
}

export function planManifestation(input = {}) {
  const intent = normalizeManifestationIntent(input);
  if (intent.status === 'UNMAPPED') {
    return {
      status: 'UNMAPPED',
      missing: [],
      intent,
      plan: null,
    };
  }

  const required = ['target', 'format', 'adapter', 'artifact'];
  const missing = required.filter((field) => !input[field]);

  if (missing.length > 0) {
    return {
      status: 'UNRESOLVED',
      missing,
      intent,
      plan: null,
    };
  }

  return {
    status: 'PLANNED',
    missing: [],
    intent,
    plan: {
      semanticId: input.semanticId ?? null,
      intent,
      target: input.target,
      format: input.format,
      adapter: input.adapter,
      artifact: input.artifact,
    },
  };
}

export { GOODLE_MANIFESTATION_KINDS };
