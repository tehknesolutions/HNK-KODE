import test from "node:test";
import assert from "node:assert/strict";
import { lowerRepresentation, liftRepresentation, REPRESENTATION_LEVELS } from "../src/transmutation-v0.9.mjs";

const source = { semanticId: "PROJECT.Strangeverse", level: "L7", payload: { intent: "CREATE" }, provenance: { origin: "SOURCE" } };

test("ULTM exposes the L7 through L0 representation ladder", () => {
  assert.deepEqual(Object.keys(REPRESENTATION_LEVELS), ["L7","L6","L5","L4","L3","L2","L1","L0"]);
});

test("lowering L7 to L3 preserves semantic identity and source provenance", () => {
  const lowered = lowerRepresentation(source, "L3");
  assert.equal(lowered.semanticId, "PROJECT.Strangeverse");
  assert.equal(lowered.level, "L3");
  assert.equal(lowered.provenance.origin, "SOURCE");
  assert.deepEqual(lowered.transmutation, { direction: "LOWER", from: "L7", to: "L3" });
});

test("lifting lower representation marks reconstruction as LIFTED or INFERRED", () => {
  const lifted = liftRepresentation({ semanticId: "PROJECT.Strangeverse", level: "L3", payload: {} }, "L6", { origin: "LIFTED" });
  assert.equal(lifted.provenance.origin, "LIFTED");
  assert.deepEqual(lifted.transmutation, { direction: "LIFT", from: "L3", to: "L6" });
});

test("lifting cannot claim SOURCE without source evidence", () => {
  assert.throws(
    () => liftRepresentation({ semanticId: "PROJECT.Strangeverse", level: "L3", payload: {} }, "L6", { origin: "SOURCE" }),
    /HAKODAN_V09_LIFT_SOURCE_EVIDENCE_REQUIRED/
  );
});

test("invalid direction is rejected deterministically", () => {
  assert.throws(() => lowerRepresentation(source, "L9"), /HAKODAN_V09_UNKNOWN_REPRESENTATION_LEVEL/);
  assert.throws(() => liftRepresentation({ ...source, level: "L3" }, "L2", { origin: "LIFTED" }), /HAKODAN_V09_INVALID_LIFT_DIRECTION/);
});
