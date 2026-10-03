import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";

function runtime(value, action) {
  return createWorldRuntime({ ir: "HNK-IR", version: "0.2.0", world: {
    entities: [{ id: "a", name: "Alakazam", properties: { stats: { health: value } } }],
    rules: [{ id: "bounded", trigger: "tick", condition: { kind: "GTE", subject: "a", path: "stats.health", value: 0 }, actions: [action] }]
  }});
}

test("V2-14 registry exposes bounded numeric actions", () => {
  const { actions } = createCanonicalRuntimeRegistries();
  for (const kind of ["CLAMP", "ADD_CLAMPED", "SUBTRACT_CLAMPED"]) assert.equal(actions.has(kind), true);
});

test("V2-14 CLAMP restores an out-of-range value", () => {
  const r = runtime(140, { kind: "CLAMP", subject: "a", path: "stats.health", min: 0, max: 100 });
  assert.deepEqual(r.tick(), [{ ruleId: "bounded", action: "CLAMP", subject: "a", path: "stats.health", before: 140, after: 100 }]);
});

test("V2-14 SUBTRACT_CLAMPED prevents health below zero", () => {
  const r = runtime(20, { kind: "SUBTRACT_CLAMPED", subject: "a", path: "stats.health", value: 50, min: 0, max: 100 });
  r.tick();
  assert.equal(r.entity("a").stats.health, 0);
});

test("V2-14 ADD_CLAMPED prevents health above maximum", () => {
  const r = runtime(90, { kind: "ADD_CLAMPED", subject: "a", path: "stats.health", value: 50, min: 0, max: 100 });
  r.tick();
  assert.equal(r.entity("a").stats.health, 100);
});

test("V2-14 valid in-range CLAMP is inert", () => {
  const r = runtime(50, { kind: "CLAMP", subject: "a", path: "stats.health", min: 0, max: 100 });
  assert.deepEqual(r.tick(), []);
});

test("V2-14 rejects inverted bounds", () => {
  const r = runtime(50, { kind: "CLAMP", subject: "a", path: "stats.health", min: 100, max: 0 });
  assert.throws(() => r.tick(), /HAKODAN_NUMERIC_INVALID_BOUNDS/);
});
