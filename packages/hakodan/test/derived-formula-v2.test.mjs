import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const subject = () => ({
  stats: {
    base: { attack: 10, strength: 4 },
    definitions: {}
  },
  equipment: { main_hand: null }
});

const resolve = (s) => (stat) => {
  if (!Object.prototype.hasOwnProperty.call(s.stats.base, stat)) {
    throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: ${stat}`);
  }
  return s.stats.base[stat];
};

test("V2-23 literal formula returns finite numeric value without mutation", () => {
  const s = subject();
  const before = structuredClone(s);
  const result = evaluateFormula({ value: 7 }, { resolveStat: resolve(s) });
  assert.equal(result.value, 7);
  assert.deepEqual(s, before);
});

test("V2-23 stat reference resolves through explicit resolver", () => {
  const s = subject();
  const result = evaluateFormula({ stat: "attack" }, { resolveStat: resolve(s) });
  assert.equal(result.value, 10);
  assert.deepEqual(result.expression, { stat: "attack" });
});

test("V2-23 ADD composes ordered operands", () => {
  const s = subject();
  const result = evaluateFormula({ op: "ADD", args: [{ stat: "attack" }, { value: 2 }] }, { resolveStat: resolve(s) });
  assert.equal(result.value, 12);
  assert.deepEqual(result.operands.map(x => x.value), [10, 2]);
});

test("V2-23 SUBTRACT preserves operand order", () => {
  const s = subject();
  const result = evaluateFormula({ op: "SUBTRACT", args: [{ stat: "attack" }, { stat: "strength" }] }, { resolveStat: resolve(s) });
  assert.equal(result.value, 6);
  assert.deepEqual(result.operands.map(x => x.value), [10, 4]);
});

test("V2-23 malformed formula rejects explicitly", () => {
  assert.throws(() => evaluateFormula({ op: "ADD" }, { resolveStat: () => 1 }), /HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-23 unsupported operator rejects explicitly", () => {
  assert.throws(() => evaluateFormula({ op: "POWER", args: [{ value: 2 }, { value: 3 }] }, { resolveStat: () => 1 }), /HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: POWER/);
});

test("V2-23 nonnumeric literal rejects explicitly", () => {
  assert.throws(() => evaluateFormula({ value: "7" }, { resolveStat: () => 1 }), /HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});
