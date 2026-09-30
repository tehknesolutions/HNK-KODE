const FLOW_STEPS = new Set([
  "WHEN", "IF", "OTHERWISE", "EACH", "WHILE", "UNTIL",
  "THEN", "PARALLEL", "SEQUENCE", "RETURN", "EMIT", "MANIFEST"
]);

function normalizeStep(step) {
  if (!step || !FLOW_STEPS.has(step.semanticId)) {
    throw new Error(`HAKODAN_V09_UNKNOWN_FLOW_STEP: ${step?.semanticId ?? "EMPTY"}`);
  }
  return Object.freeze({ ...step });
}

export function createFlowNode(name, steps = []) {
  if (!name) throw new Error("HAKODAN_V09_FLOW_NAME_REQUIRED");
  return Object.freeze({
    kind: "NarrativeFlow",
    semanticId: `FLOW.${name}`,
    name,
    steps: Object.freeze(steps.map(normalizeStep))
  });
}
