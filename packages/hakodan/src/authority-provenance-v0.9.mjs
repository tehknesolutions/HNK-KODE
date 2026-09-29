const CAPABILITIES = new Set([
  "READ", "PROPOSE", "EDIT", "APPROVE", "CANONIZE",
  "LOCK", "EXECUTE", "MANIFEST", "PUBLISH"
]);

export function authorize(capability, actor, _node) {
  const id = actor?.id ?? "anonymous";
  const hasCapability = CAPABILITIES.has(capability) && actor?.capabilities?.includes(capability);
  if (hasCapability) return { allowed: true, diagnostic: null };
  return { allowed: false, diagnostic: `HAKODAN_V09_AUTHORITY_DENIED: ${id} lacks ${capability}` };
}

export function attachProvenance(node, event) {
  const snapshot = Object.freeze({
    source: event.source ?? null,
    origin: event.origin ?? null,
    actor: event.actor ?? null,
    operation: event.operation ?? null
  });
  return { ...node, provenance: Object.freeze([...(node.provenance ?? []), snapshot]) };
}

export function traceProvenance(node) {
  return [...(node.provenance ?? [])];
}

import { transitionDiscovery } from "./discovery-state-v0.9.mjs";

const TRANSITION_CAPABILITY = Object.freeze({
  PROPOSE: "PROPOSE",
  APPROVE: "APPROVE",
  CANONIZE: "CANONIZE",
  REJECT: "EDIT",
  WATCH: "EDIT",
  CONFLICT: "EDIT",
  CANDIDATE: "EDIT"
});

export function governedTransition(node, operation, actor) {
  const capability = TRANSITION_CAPABILITY[operation] ?? "EDIT";
  const permission = authorize(capability, actor, node);
  if (!permission.allowed) throw new Error(permission.diagnostic);
  const transitioned = transitionDiscovery(node, operation, actor);
  return attachProvenance(transitioned, {
    source: "AUTHORITY_GATE",
    origin: node.origin ?? null,
    actor: actor?.id ?? null,
    operation
  });
}
