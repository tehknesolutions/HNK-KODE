import test from "node:test";
import assert from "node:assert/strict";
import { createTriggerRegistry, createCanonicalTriggerRegistry } from "../src/runtime-trigger-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-10 canonical trigger registry exposes tick", () => {
  assert.deepEqual(createCanonicalTriggerRegistry().kinds(), ["tick"]);
});

test("V2-10 trigger registry rejects duplicate and unsupported triggers", () => {
  const triggers = createTriggerRegistry().register("signal", () => true);
  assert.throws(() => triggers.register("signal", () => true), /HAKODAN_TRIGGER_REGISTRY_DUPLICATE/);
  assert.throws(() => triggers.resolve("unknown"), /HAKODAN_RUNTIME_UNSUPPORTED_TRIGGER/);
});

test("V2-10 runtime dispatches custom events without kernel trigger branches", () => {
  const triggers = createTriggerRegistry().register("signal", (rule, event) => event.type === "signal" && event.name === rule.signal);
  const ir = {
    ir: "HNK-IR", version: "0.2.0",
    world: {
      entities: [{ id: "portal", name: "Portal", properties: { open: false } }],
      rules: [{ id: "open-on-signal", trigger: "signal", signal: "OPEN_PORTAL", condition: { kind: "EQUALS", subject: "portal", path: "open", value: false }, actions: [{ kind: "SET", subject: "portal", path: "open", value: true }] }]
    }
  };
  const runtime = createWorldRuntime(ir, { triggers });
  assert.deepEqual(runtime.dispatch({ type: "signal", name: "OTHER" }), []);
  assert.equal(runtime.entity("portal").open, false);
  const changes = runtime.dispatch({ type: "signal", name: "OPEN_PORTAL" });
  assert.equal(runtime.entity("portal").open, true);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].ruleId, "open-on-signal");
});

test("V2-10 tick remains backward compatible", () => {
  const ir = { ir: "HNK-IR", version: "0.2.0", world: { entities: [{ id: "e", name: "E", properties: { ready: true, x: 0, y: 0 } }], rules: [{ id: "r", trigger: "tick", condition: { kind: "EQUALS", subject: "e", path: "ready", value: true }, actions: [{ kind: "MOVE", subject: "e", dx: 1, dy: 0 }] }] } };
  const runtime = createWorldRuntime(ir);
  runtime.tick();
  assert.deepEqual(runtime.entity("e").position, { x: 1, y: 0 });
});
