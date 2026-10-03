import test from "node:test";
import assert from "node:assert/strict";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

function makeRuntime(condition) {
  return createWorldRuntime({ ir: "HNK-IR", version: "0.2.0", world: {
    entities: [{ id: "a", name: "Alakazam", properties: { ready: true, powered: false, x: 0, y: 0 } }],
    rules: [{ id: "logic", trigger: "tick", condition, actions: [{ kind: "MOVE", subject: "a", dx: 1, dy: 0 }] }]
  }});
}
const eq = (path, value) => ({ kind: "EQUALS", subject: "a", path, value });

test("V2-11 canonical registry exposes AND OR NOT", () => {
  const { conditions } = createCanonicalRuntimeRegistries();
  assert.deepEqual(conditions.kinds(), ["NEAR", "EQUALS", "AND", "OR", "NOT"]);
});

test("V2-11 AND composes nested registered conditions", () => {
  const runtime = makeRuntime({ kind: "AND", conditions: [eq("ready", true), { kind: "NOT", condition: eq("powered", true) }] });
  assert.equal(runtime.tick().length, 1);
  assert.deepEqual(runtime.entity("a").position, { x: 1, y: 0 });
});

test("V2-11 OR succeeds when any nested condition succeeds", () => {
  const runtime = makeRuntime({ kind: "OR", conditions: [eq("powered", true), eq("ready", true)] });
  assert.equal(runtime.tick().length, 1);
});

test("V2-11 nested logic can remain inert", () => {
  const runtime = makeRuntime({ kind: "AND", conditions: [eq("ready", true), eq("powered", true)] });
  assert.deepEqual(runtime.tick(), []);
});

test("V2-11 malformed logical conditions fail explicitly", () => {
  assert.throws(() => makeRuntime({ kind: "AND", conditions: [] }).tick(), /HAKODAN_LOGIC_AND_REQUIRES_CONDITIONS/);
  assert.throws(() => makeRuntime({ kind: "NOT" }).tick(), /HAKODAN_LOGIC_NOT_REQUIRES_CONDITION/);
});
