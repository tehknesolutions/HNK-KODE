import test from "node:test";
import assert from "node:assert/strict";
import { createArtifactRef, deriveArtifact } from "../src/provenance-lineage.mjs";

test("M4 artifact records retain authority and source lineage", () => {
  const source = createArtifactRef({ id: "intent:1", type: "IntentEnvelope", authority: "CREATOR" });
  const derived = deriveArtifact(source, { id: "ir:1", type: "GoodleIR", authority: "GOODLE" });
  assert.equal(derived.provenance.parents[0], "intent:1");
  assert.equal(derived.authority, "GOODLE");
});

test("M4 derivation does not mutate source authority", () => {
  const source = createArtifactRef({ id: "intent:1", type: "IntentEnvelope", authority: "CREATOR" });
  deriveArtifact(source, { id: "plan:1", type: "ExecutionPlan", authority: "GOODLE" });
  assert.equal(source.authority, "CREATOR");
});
