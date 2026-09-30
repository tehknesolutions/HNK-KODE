const RESPONSIBILITIES = Object.freeze({
  "execute-canonical-program": { owner: "HAKODAN", status: "ASSIGNED" },
  "evaluate-canonical-event": { owner: "HAKODAN", status: "ASSIGNED" },
  "canonical-memory-semantics": { owner: "HAKODAN", status: "ASSIGNED" },
  "creator-session": { owner: "GOODLE", status: "ASSIGNED" },
  "browser-capability-broker": { owner: "GOODLE", status: "ASSIGNED" },
  "creator-preview-orchestration": { owner: "GOODLE", status: "ASSIGNED" },
  "target-adapter-selection": { owner: "SHARED", status: "UNRESOLVED" },
  "runtime-persistence-binding": { owner: "SHARED", status: "UNRESOLVED" }
});

export function classifyRuntimeResponsibility(capability) {
  const found = RESPONSIBILITIES[capability];
  if (!found) {
    return {
      capability,
      owner: null,
      status: "UNRESOLVED",
      reason: "No authority assignment exists; do not duplicate runtime behavior."
    };
  }
  return { capability, ...found };
}

export function createGoodleRuntimeEnvelope({ projectId, sessionId, canonicalProgram = null } = {}) {
  if (!projectId || !sessionId) throw new Error("GOODLE_RUNTIME_SESSION_IDENTITY_REQUIRED");
  return {
    kind: "GoodleRuntimeEnvelope",
    projectId,
    sessionId,
    creatorAuthority: "GOODLE",
    executionAuthority: "HAKODAN",
    canonicalProgram,
    capabilities: [],
    provenance: {
      sourceLayer: "GOODLE",
      targetLayer: "HAKODAN",
      adapter: "HNK-KODE:M4"
    }
  };
}
