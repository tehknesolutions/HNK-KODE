export const REPRESENTATION_LEVELS = Object.freeze({
  L7: "INTENT",
  L6: "SEMANTIC",
  L5: "AST",
  L4: "HOM",
  L3: "HNK_IR",
  L2: "TARGET_IR",
  L1: "BYTECODE",
  L0: "MACHINE"
});

const ORDER = Object.keys(REPRESENTATION_LEVELS);

function rank(level) {
  const index = ORDER.indexOf(level);
  if (index < 0) throw new Error(`HAKODAN_V09_UNKNOWN_REPRESENTATION_LEVEL: ${level}`);
  return index;
}

function transform(node, target, direction, provenance) {
  return {
    ...node,
    level: target,
    provenance: { ...(node.provenance ?? {}), ...(provenance ?? {}) },
    transmutation: { direction, from: node.level, to: target }
  };
}

export function lowerRepresentation(node, targetLevel) {
  if (rank(targetLevel) <= rank(node.level)) {
    throw new Error(`HAKODAN_V09_INVALID_LOWER_DIRECTION: ${node.level} -> ${targetLevel}`);
  }
  return transform(node, targetLevel, "LOWER");
}

export function liftRepresentation(node, targetLevel, provenance = { origin: "INFERRED" }) {
  if (rank(targetLevel) >= rank(node.level)) {
    throw new Error(`HAKODAN_V09_INVALID_LIFT_DIRECTION: ${node.level} -> ${targetLevel}`);
  }
  if (provenance.origin === "SOURCE" && !provenance.sourceEvidence) {
    throw new Error("HAKODAN_V09_LIFT_SOURCE_EVIDENCE_REQUIRED");
  }
  const origin = provenance.origin === "SOURCE" ? "SOURCE" : (provenance.origin === "LIFTED" ? "LIFTED" : "INFERRED");
  return transform(node, targetLevel, "LIFT", { ...provenance, origin });
}
