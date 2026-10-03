import test from "node:test";
import assert from "node:assert/strict";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

function runtime(condition, actions, stats = { health: 100, energy: 10 }) {
  return createWorldRuntime({ ir: "HNK-IR", version: "0.2.0", world: {
    entities: [{ id: "a", name: "Alakazam", properties: { stats } }],
    rules: [{ id: "numeric", trigger: "tick", condition, actions }]
  }});
}
const cmp = (kind, path, value) => ({ kind, subject: "a", path, value });

test("V2-13 registry exposes numeric comparisons and mutations", () => {
  const { conditions, actions } = createCanonicalRuntimeRegistries();
  for (const kind of ["GT", "GTE", "LT", "LTE"]) assert.equal(conditions.has(kind), true);
  for (const kind of ["ADD", "SUBTRACT"]) assert.equal(actions.has(kind), true);
});

test("V2-13 SUBTRACT applies damage through nested state path", () => {
  const r = runtime(cmp("GT", "stats.health", 0), [{ kind: "SUBTRACT", subject: "a", path: "stats.health", value: 25 }]);
  assert.deepEqual(r.tick(), [{ ruleId: "numeric", action: "SUBTRACT", subject: "a", path: "stats.health", before: 100, after: 75 }]);
  assert.equal(r.entity("a").stats.health, 75);
});

test("V2-13 ADD restores a numeric resource", () => {
  const r = runtime(cmp("LTE", "stats.energy", 10), [{ kind: "ADD", subject: "a", path: "stats.energy", value: 5 }]);
  r.tick();
  assert.equal(r.entity("a").stats.energy, 15);
});

test("V2-13 comparisons compose with AND/OR/NOT", () => {
  const condition = { kind: "AND", conditions: [cmp("GTE", "stats.health", 50), cmp("LT", "stats.energy", 20)] };
  const r = runtime(condition, [{ kind: "ADD", subject: "a", path: "stats.energy", value: 1 }]);
  assert.equal(r.tick().length, 1);
});

test("V2-13 numeric capabilities reject non-finite/non-number state", () => {
  const r = runtime(cmp("GT", "stats.health", 0), [{ kind: "SUBTRACT", subject: "a", path: "stats.health", value: 1 }], { health: "100", energy: 10 });
  assert.throws(() => r.tick(), /HAKODAN_NUMERIC_VALUE_REQUIRED/);
});
