import test from "node:test";
import assert from "node:assert/strict";
import { createFlowNode } from "../src/narrative-flow-v0.9.mjs";

test("FLOW composes WHEN IF OTHERWISE EMIT MANIFEST relations", () => {
  const flow = createFlowNode("EnterPortal", [
    { semanticId: "WHEN", subject: "Garukan", relation: "ENTER", object: "Portal" },
    { semanticId: "IF", subject: "Garukan", relation: "HAS", object: "NexusKey" },
    { semanticId: "MANIFEST", object: "Nexus" },
    { semanticId: "OTHERWISE" },
    { semanticId: "EMIT", object: "NeedKey" }
  ]);
  assert.equal(flow.kind, "NarrativeFlow");
  assert.equal(flow.semanticId, "FLOW.EnterPortal");
  assert.deepEqual(flow.steps.map(step => step.semanticId), ["WHEN", "IF", "MANIFEST", "OTHERWISE", "EMIT"]);
});

test("FLOW identity is deterministic", () => {
  assert.deepEqual(createFlowNode("EnterPortal", []), createFlowNode("EnterPortal", []));
});
