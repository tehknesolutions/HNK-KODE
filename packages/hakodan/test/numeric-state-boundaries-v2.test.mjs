import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";

function fires(kind, current, expected) {
  const runtime = createWorldRuntime({ ir: "HNK-IR", version: "0.2.0", world: {
    entities: [{ id: "e", name: "Entity", properties: { value: current, count: 0 } }],
    rules: [{ id: "r", trigger: "tick", condition: { kind, subject: "e", path: "value", value: expected }, actions: [{ kind: "ADD", subject: "e", path: "count", value: 1 }] }]
  }});
  runtime.tick();
  return runtime.entity("e").count === 1;
}

test("V2-13 comparison boundaries are exact", () => {
  assert.equal(fires("GT", 5, 5), false);
  assert.equal(fires("GTE", 5, 5), true);
  assert.equal(fires("LT", 5, 5), false);
  assert.equal(fires("LTE", 5, 5), true);
});
