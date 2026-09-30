export function requestCapability({ sessionId, capability, context = {} } = {}) {
  if (!sessionId || !capability) throw new Error("GOODLE_CAPABILITY_REQUEST_REQUIRED");
  return {
    kind: "CapabilityRequest",
    sessionId,
    capability,
    context: structuredClone(context),
    status: "REQUESTED",
    granted: false,
    provenance: { sourceLayer: "GOODLE", adapter: "HNK-KODE:M4" }
  };
}

export function grantCapability(request, { authority, scope } = {}) {
  if (!request || request.kind !== "CapabilityRequest") throw new Error("GOODLE_CAPABILITY_REQUEST_REQUIRED");
  if (!authority || !Array.isArray(scope) || scope.length === 0) {
    throw new Error("GOODLE_CAPABILITY_EXPLICIT_GRANT_REQUIRED");
  }
  return {
    kind: "CapabilityGrant",
    request: structuredClone(request),
    authority,
    scope: structuredClone(scope),
    status: "GRANTED",
    granted: true,
    provenance: { sourceLayer: "GOODLE", adapter: "HNK-KODE:M4" }
  };
}
