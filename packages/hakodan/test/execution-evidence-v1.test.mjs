import test from "node:test";
import assert from "node:assert/strict";
import { attachExecutionEvidence } from "../src/execution-evidence-v1.mjs";

const artifact = Object.freeze({
  target: "web",
  mediaType: "text/html",
  executionEvidence: "UNVERIFIED",
  content: "<!doctype html><title>haKodan</title>"
});

test("missing executor result remains UNVERIFIED", () => {
  const result = attachExecutionEvidence(artifact);
  assert.equal(result.executionEvidence, "UNVERIFIED");
  assert.equal(result.execution, null);
});

test("successful real executor result becomes EXECUTED", () => {
  const result = attachExecutionEvidence(artifact, {
    ok: true, executor: "browser", observed: { world: "AbraIsland" }
  });
  assert.equal(result.executionEvidence, "EXECUTED");
  assert.equal(result.execution.executor, "browser");
});
test("failed executor result becomes FAILED and preserves diagnostics", () => {
  const result = attachExecutionEvidence(artifact, {
    ok: false,
    executor: "browser",
    error: "HAKODAN_RUNTIME_FAILURE",
    diagnostics: { phase: "load" }
  });
  assert.equal(result.executionEvidence, "FAILED");
  assert.equal(result.execution.error, "HAKODAN_RUNTIME_FAILURE");
  assert.deepEqual(result.execution.diagnostics, { phase: "load" });
});

test("invalid executor result cannot claim execution", () => {
  assert.throws(
    () => attachExecutionEvidence(artifact, { ok: true }),
    /HAKODAN_EXECUTION_EVIDENCE_INVALID/
  );
});