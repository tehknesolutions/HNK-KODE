import test from "node:test";
import assert from "node:assert/strict";
import { composeSemanticNode, validateScopeTree } from "../src/semantic-composition-v0.9.mjs";

test("semantic scopes compose typed children", () => {
  const world = composeSemanticNode({ kind: "WORLD", name: "Strangeverse" }, [
    composeSemanticNode({ kind: "ENTITY", name: "Garukan" }, [
      composeSemanticNode({ kind: "FLOW", name: "EnterPortal" }, [])
    ])
  ]);
  assert.equal(world.semanticId, "WORLD.Strangeverse");
  assert.equal(world.children[0].semanticId, "ENTITY.Garukan");
  assert.equal(world.children[0].children[0].semanticId, "FLOW.EnterPortal");
  assert.deepEqual(validateScopeTree(world), { valid: true, diagnostics: [] });
});

test("invalid parent relation produces deterministic diagnostic", () => {
  const property = composeSemanticNode({ kind: "PROPERTY", name: "Health" }, [
    composeSemanticNode({ kind: "WORLD", name: "NestedWorld" }, [])
  ]);
  assert.deepEqual(validateScopeTree(property), {
    valid: false,
    diagnostics: ["HAKODAN_V09_INVALID_PARENT: PROPERTY cannot contain WORLD"]
  });
});
