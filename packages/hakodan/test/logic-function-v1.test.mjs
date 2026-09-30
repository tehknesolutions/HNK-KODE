import test from "node:test";
import assert from "node:assert/strict";
import { createLogicBlock, createFunctionBlock, appendFlowBlock, validateLogicFunctionGraph } from "../src/logic-function-v1.mjs";

test("IF block exposes typed condition and THEN/ELSE branches", () => {
  const block = createLogicBlock("IF", { condition: { type: "BOOL", value: true } });
  assert.equal(block.semanticId, "LOGIC.IF");
  assert.equal(block.inputs.condition.type, "BOOL");
  assert.deepEqual(Object.keys(block.branches), ["then", "else"]);
});

test("comparison blocks are typed and fail closed on invalid operators", () => {
  const eq = createLogicBlock("COMPARE", { operator: "EQ", left: { type: "NUMBER" }, right: { type: "NUMBER" } });
  assert.equal(eq.semanticId, "LOGIC.COMPARE.EQ");
  assert.throws(() => createLogicBlock("COMPARE", { operator: "BOGUS", left: { type: "NUMBER" }, right: { type: "NUMBER" } }), /LOGIC_V1_OPERATOR_INVALID/);
});

test("function block has typed parameters and return contract", () => {
  const fn = createFunctionBlock({ name: "sum", parameters: [{ name: "a", type: "NUMBER" }, { name: "b", type: "NUMBER" }], returnType: "NUMBER" });
  assert.equal(fn.semanticId, "FUNCTION.sum");
  assert.equal(fn.inputs.parameters.length, 2);
  assert.equal(fn.outputs.return.type, "NUMBER");
});

test("flow blocks append in deterministic order and RETURN matches function type", () => {
  let fn = createFunctionBlock({ name: "sum", parameters: [], returnType: "NUMBER" });
  fn = appendFlowBlock(fn, { kind: "RETURN", value: { type: "NUMBER" } });
  assert.equal(fn.body.length, 1);
  assert.equal(validateLogicFunctionGraph(fn).valid, true);
  fn = appendFlowBlock(fn, { kind: "RETURN", value: { type: "STRING" } });
  assert.equal(validateLogicFunctionGraph(fn).valid, false);
});

test("nested flow graph rejects cycles", () => {
  const ifBlock = createLogicBlock("IF", { condition: { type: "BOOL" } });
  ifBlock.branches.then.push(ifBlock);
  assert.equal(validateLogicFunctionGraph(ifBlock).valid, false);
});
