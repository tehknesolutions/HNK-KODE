export const EXECUTION_EVIDENCE_STATES = Object.freeze({
  UNVERIFIED: "UNVERIFIED",
  EXECUTED: "EXECUTED",
  FAILED: "FAILED"
});

export function attachExecutionEvidence(artifact, executorResult) {
  if (!artifact || typeof artifact !== "object") {
    throw new Error("HAKODAN_EXECUTION_EVIDENCE_INVALID_ARTIFACT");
  }

  if (executorResult == null) {
    return Object.freeze({
      ...artifact,
      executionEvidence: EXECUTION_EVIDENCE_STATES.UNVERIFIED,
      execution: null
    });
  }

  if (typeof executorResult.ok !== "boolean" || !executorResult.executor) {
    throw new Error("HAKODAN_EXECUTION_EVIDENCE_INVALID");
  }

  return Object.freeze({
    ...artifact,
    executionEvidence: executorResult.ok
      ? EXECUTION_EVIDENCE_STATES.EXECUTED
      : EXECUTION_EVIDENCE_STATES.FAILED,
    execution: Object.freeze({ ...executorResult })
  });
}