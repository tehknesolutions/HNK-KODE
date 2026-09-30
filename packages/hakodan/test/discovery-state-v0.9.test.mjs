import test from "node:test";
import assert from "node:assert/strict";
import { transitionDiscovery, validateDiscoveryTransition } from "../src/discovery-state-v0.9.mjs";

const actor = { id: "creator" };

test("formalization follows the canonical progressive path", () => {
  let node = { semanticId: "RULE.PortalKey", state: "DISCOVERY", origin: "SOURCE" };
  for (const operation of ["PROPOSE", "CANDIDATE", "APPROVE", "CANONIZE"]) {
    node = transitionDiscovery(node, operation, actor);
  }
  assert.equal(node.state, "CANON");
  assert.equal(node.history.length, 4);
});

test("lateral states WATCH REJECTED and CONFLICT are explicit", () => {
  assert.equal(transitionDiscovery({ state: "DISCOVERY" }, "WATCH", actor).state, "WATCH");
  assert.equal(transitionDiscovery({ state: "PROPOSED" }, "REJECT", actor).state, "REJECTED");
  assert.equal(transitionDiscovery({ state: "CANDIDATE" }, "CONFLICT", actor).state, "CONFLICT");
});

test("inferred discovery cannot jump directly to CANON", () => {
  const result = validateDiscoveryTransition({ state: "DISCOVERY", origin: "INFERRED" }, "CANONIZE");
  assert.deepEqual(result, { valid: false, diagnostic: "HAKODAN_V09_INVALID_DISCOVERY_TRANSITION: DISCOVERY + CANONIZE" });
  assert.throws(() => transitionDiscovery({ state: "DISCOVERY", origin: "INFERRED" }, "CANONIZE", actor), /INVALID_DISCOVERY_TRANSITION/);
});
