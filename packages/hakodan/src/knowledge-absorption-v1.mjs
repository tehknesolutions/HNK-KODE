import { governedTransition, attachProvenance } from "./authority-provenance-v0.9.mjs";

export const HAKODAN_AUTHORITY_CHAIN = Object.freeze([
  "HNK",
  "HNK-KODE",
  "haKodan",
  "vibeHaKodin",
  "Goodle"
]);

const SOURCE_PRECEDENCE = new Map(HAKODAN_AUTHORITY_CHAIN.map((name, index) => [name, index]));

export function sourcePrecedence(source) {
  return SOURCE_PRECEDENCE.has(source) ? SOURCE_PRECEDENCE.get(source) : Number.POSITIVE_INFINITY;
}

export function createAbsorptionDiscovery({ id, concept, source, evidence = [], metadata = {} }) {
  if (!id || !concept || !source) throw new Error("HAKODAN_ABSORPTION_INVALID_DISCOVERY");
  return Object.freeze({
    id,
    kind: "KNOWLEDGE_ABSORPTION",
    concept,
    source,
    origin: source,
    evidence: Object.freeze([...evidence]),
    metadata: Object.freeze({ ...metadata }),
    state: "DISCOVERY",
    history: Object.freeze([]),
    provenance: Object.freeze([])
  });
}

export function compareAbsorptionSources(a, b) {
  const ap = sourcePrecedence(a?.source);
  const bp = sourcePrecedence(b?.source);
  if (ap === bp) return { preferred: null, reason: "EQUAL_PRECEDENCE_REQUIRES_EVIDENCE_REVIEW" };
  const preferred = ap < bp ? a : b;
  const subordinate = preferred === a ? b : a;
  return {
    preferred,
    subordinate,
    reason: `HNK_AUTHORITY_PRECEDENCE:${preferred.source}>${subordinate.source}`
  };
}

export function proposeAbsorption(discovery, actor) {
  return governedTransition(discovery, "PROPOSE", actor);
}

export function promoteAbsorptionCandidate(proposed, actor, comparison = null) {
  const candidate = governedTransition(proposed, "CANDIDATE", actor);
  return comparison ? attachProvenance(candidate, {
    source: "ABSORPTION_COMPARISON",
    origin: comparison.preferred?.source ?? null,
    actor: actor?.id ?? null,
    operation: comparison.reason
  }) : candidate;
}

export function approveAbsorption(candidate, actor, validation) {
  if (!validation?.passed) throw new Error("HAKODAN_ABSORPTION_VALIDATION_REQUIRED");
  const approved = governedTransition(candidate, "APPROVE", actor);
  return attachProvenance(approved, {
    source: "ABSORPTION_VALIDATION",
    origin: candidate.source,
    actor: actor?.id ?? null,
    operation: validation.id ?? "VALIDATED"
  });
}

export function canonizeAbsorption(approved, actor) {
  return governedTransition(approved, "CANONIZE", actor);
}

export function absorbValidatedKnowledge({ discovery, actor, validation, comparison = null }) {
  const proposed = proposeAbsorption(discovery, actor);
  const candidate = promoteAbsorptionCandidate(proposed, actor, comparison);
  const approved = approveAbsorption(candidate, actor, validation);
  return canonizeAbsorption(approved, actor);
}
