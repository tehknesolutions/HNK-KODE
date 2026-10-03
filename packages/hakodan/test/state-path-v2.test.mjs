import test from "node:test";
import assert from "node:assert/strict";
import { getStatePath, setStatePath } from "../src/state-path.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-12 state paths read and write nested state", () => {
  const state = { stats: { energy: 7 }, portal: { state: { open: false } } };
  assert.equal(getStatePath(state, "stats.energy"), 7);
  const change = setStatePath(state, "portal.state.open", true);
  assert.deepEqual(change, { before: false, after: true });
  assert.equal(state.portal.state.open, true);
});

test("V2-12 SET creates safe missing object branches", () => {
  const state = {};
  setStatePath(state, "inventory.key.owned", true);
  assert.deepEqual(state, { inventory: { key: { owned: true } } });
});

test("V2-12 unsafe paths are rejected", () => {
  assert.throws(() => setStatePath({}, "__proto__.polluted", true), /HAKODAN_STATE_PATH_UNSAFE/);
  assert.throws(() => getStatePath({}, "constructor.prototype"), /HAKODAN_STATE_PATH_UNSAFE/);
});

test("V2-12 EQUALS and SET operate on nested paths through runtime registries", () => {
  const ir = { ir: "HNK-IR", version: "0.2.0", world: {
    entities: [{ id: "portal", name: "Portal", properties: { state: { locked: false, open: false } } }],
    rules: [{ id: "open", trigger: "tick", condition: { kind: "EQUALS", subject: "portal", path: "state.locked", value: false }, actions: [{ kind: "SET", subject: "portal", path: "state.open", value: true }] }]
  }};
  const runtime = createWorldRuntime(ir);
  const changes = runtime.tick();
  assert.equal(runtime.entity("portal").state.open, true);
  assert.deepEqual(changes, [{ ruleId: "open", action: "SET", subject: "portal", path: "state.open", before: false, after: true }]);
});

test("V2-12 flat paths remain backward compatible", () => {
  const state = { open: false };
  assert.equal(getStatePath(state, "open"), false);
  setStatePath(state, "open", true);
  assert.equal(state.open, true);
});
