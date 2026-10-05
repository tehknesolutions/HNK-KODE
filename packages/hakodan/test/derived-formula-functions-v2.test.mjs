import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context = { resolveStat: stat => ({ negative: -4.6, positive: 4.6 }[stat]) };

test("V2-24 ABS resolves one numeric operand", () => {
  const result = evaluateFormula({ op: "ABS", args: [{ stat: "negative" }] }, context);
  assert.equal(result.value, 4.6);
  assert.equal(result.operands[0].value, -4.6);
});

test("V2-24 ROUND resolves one numeric operand", () => {
  assert.equal(evaluateFormula({ op: "ROUND", args: [{ stat: "positive" }] }, context).value, 5);
});

test("V2-24 FLOOR resolves one numeric operand", () => {
  assert.equal(evaluateFormula({ op: "FLOOR", args: [{ stat: "positive" }] }, context).value, 4);
});

test("V2-24 CEIL resolves one numeric operand", () => {
  assert.equal(evaluateFormula({ op: "CEIL", args: [{ stat: "positive" }] }, context).value, 5);
});

test("V2-24 unary functions compose inside existing arithmetic AST", () => {
  const result = evaluateFormula({
    op: "ADD",
    args: [
      { op: "ABS", args: [{ stat: "negative" }] },
      { op: "FLOOR", args: [{ stat: "positive" }] }
    ]
  }, context);
  assert.equal(result.value, 8.6);
});

test("V2-24 unary functions require exactly one operand", () => {
  assert.throws(() => evaluateFormula({ op: "ABS", args: [{ value: -1 }, { value: -2 }] }, context), /HAKODAN_DERIVED_FORMULA_INVALID/);
  assert.throws(() => evaluateFormula({ op: "ROUND", args: [] }, context), /HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-24 unsupported function-like operator remains explicit", () => {
  assert.throws(() => evaluateFormula({ op: "SQRT", args: [{ value: 4 }] }, context), /HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: SQRT/);
});

test("V2-24 unary function evidence preserves original expression", () => {
  const expression = { op: "CEIL", args: [{ stat: "positive" }] };
  const result = evaluateFormula(expression, context);
  assert.deepEqual(result.expression, expression);
  assert.deepEqual(result.operands.map(x => x.value), [4.6]);
});
