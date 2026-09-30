import { authorize, attachProvenance } from "./authority-provenance-v0.9.mjs";

const DIMENSIONS = ["target", "format", "adapter", "artifact"];

export function validateManifestation(request) {
  const missing = DIMENSIONS.filter(key => !request?.[key]);
  return missing.length
    ? { valid: false, diagnostics: [`HAKODAN_V09_MANIFESTATION_MISSING: ${missing.map(x => x.toUpperCase()).join(",")}`] }
    : { valid: true, diagnostics: [] };
}

export function planManifestation(request, actor) {
  const validation = validateManifestation(request);
  if (!validation.valid) throw new Error(validation.diagnostics[0]);
  const permission = authorize("MANIFEST", actor, request);
  if (!permission.allowed) throw new Error(permission.diagnostic);
  const plan = {
    semanticId: request.semanticId,
    target: request.target,
    format: request.format,
    adapter: request.adapter,
    artifact: request.artifact,
    stage: "PLAN",
    executed: false
  };
  return attachProvenance(plan, { source: "MANIFESTATION_GRAPH", origin: "GENERATED", actor: actor?.id ?? null, operation: "MANIFEST" });
}

export function listDependents(plans, semanticId) {
  return plans.filter(plan => plan.semanticId === semanticId);
}
