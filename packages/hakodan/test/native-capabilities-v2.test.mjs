import test from "node:test";
import assert from "node:assert/strict";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-9 canonical registry expands without changing World Runtime", () => {
  const { conditions, actions } = createCanonicalRuntimeRegistries();
  assert.deepEqual(conditions.kinds(), ["NEAR", "EQUALS"]);
  assert.deepEqual(actions.kinds(), ["SET", "MOVE"]);
});

test("V2-9 EQUALS condition and MOVE action execute through registry dispatch", () => {
  const ir = {
    ir: "HNK-IR", version: "0.2.0",
    world: {
      entities: [{ id: "alakazam", name: "Alakazam", properties: { ready: true, x: 0, y: 0 } }],
      rules: [{
        id: "move-when-ready", trigger: "tick",
        condition: { kind: "EQUALS", subject: "alakazam", path: "ready", value: true },
        actions: [{ kind: "MOVE", subject: "alakazam", dx: 3, dy: -1 }]
      }]
    }
  };

  const runtime = createWorldRuntime(ir);
  const changes = runtime.tick();
  assert.deepEqual(runtime.entity("alakazam").position, { x: 3, y: -1 });
  assert.deepEqual(changes, [{
    ruleId: "move-when-ready", action: "MOVE", subject: "alakazam", path: "position",
    before: { x: 0, y: 0 }, after: { x: 3, y: -1 }
  }]);
});

test("V2-9 EQUALS false keeps MOVE inert", () => {
  const ir = {
    ir: "HNK-IR", version: "0.2.0",
    world: {
      entities: [{ id: "alakazam", name: "Alakazam", properties: { ready: false, x: 0, y: 0 } }],
      rules: [{ id: "r", trigger: "tick", condition: { kind: "EQUALS", subject: "alakazam", path: "ready", value: true }, actions: [{ kind: "MOVE", subject: "alakazam", dx: 3, dy: 0 }] }]
    }
  };
  const runtime = createWorldRuntime(ir);
  assert.deepEqual(runtime.tick(), []);
  assert.deepEqual(runtime.entity("alakazam").position, { x: 0, y: 0 });
});
