import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const values = { negative: -4.6, positive: 4.6, health: 75, attack: 12 };
const context = { resolveStat: stat => {
  if (!Object.prototype.hasOwnProperty.call(values, stat)) throw new Error(`UNEXPECTED_STAT_RESOLUTION: ${stat}`);
  return values[stat];
} };

test("V2-24 ABS resolves one numeric operand",()=>{const r=evaluateFormula({op:"ABS",args:[{stat:"negative"}]},context);assert.equal(r.value,4.6);assert.equal(r.operands[0].value,-4.6);});
test("V2-24 ROUND resolves one numeric operand",()=>assert.equal(evaluateFormula({op:"ROUND",args:[{stat:"positive"}]},context).value,5));
test("V2-24 FLOOR resolves one numeric operand",()=>assert.equal(evaluateFormula({op:"FLOOR",args:[{stat:"positive"}]},context).value,4));
test("V2-24 CEIL resolves one numeric operand",()=>assert.equal(evaluateFormula({op:"CEIL",args:[{stat:"positive"}]},context).value,5));
test("V2-24 unary functions compose inside existing arithmetic AST",()=>assert.equal(evaluateFormula({op:"ADD",args:[{op:"ABS",args:[{stat:"negative"}]},{op:"FLOOR",args:[{stat:"positive"}]}]},context).value,8.6));
test("V2-24 unary functions require exactly one operand",()=>{assert.throws(()=>evaluateFormula({op:"ABS",args:[{value:-1},{value:-2}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);assert.throws(()=>evaluateFormula({op:"ROUND",args:[]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);});
test("V2-24 unsupported function-like operator remains explicit",()=>assert.throws(()=>evaluateFormula({op:"SQRT",args:[{value:4}]},context),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: SQRT/));

for (const [op,left,right,expected] of [["GT",3,2,true],["GTE",2,2,true],["LT",2,3,true],["LTE",2,2,true],["EQ",2,2,true],["EQ",2,3,false]]) {
  test(`V2-24 ${op} comparison resolves declaratively`,()=>{const r=evaluateFormula({op:"IF",condition:{op,left:{value:left},right:{value:right}},then:{value:1},else:{value:0}},context);assert.equal(r.value,expected?1:0);assert.equal(r.condition.result,expected);});
}

test("V2-24 IF selects then branch when condition is true",()=>{const r=evaluateFormula({op:"IF",condition:{op:"GTE",left:{stat:"health"},right:{value:50}},then:{stat:"attack"},else:{value:0}},context);assert.equal(r.value,12);assert.equal(r.selected,"then");assert.equal(r.condition.left.value,75);assert.equal(r.condition.right.value,50);});
test("V2-24 IF selects else branch when condition is false",()=>{const r=evaluateFormula({op:"IF",condition:{op:"LT",left:{stat:"health"},right:{value:50}},then:{stat:"attack"},else:{value:3}},context);assert.equal(r.value,3);assert.equal(r.selected,"else");});
test("V2-24 IF is lazy and never resolves unselected then branch",()=>{const r=evaluateFormula({op:"IF",condition:{op:"EQ",left:{value:1},right:{value:0}},then:{stat:"must_not_resolve"},else:{value:7}},context);assert.equal(r.value,7);});
test("V2-24 IF is lazy and never resolves unselected else branch",()=>{const r=evaluateFormula({op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:7},else:{stat:"must_not_resolve"}},context);assert.equal(r.value,7);});
test("V2-24 malformed condition rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"IF",condition:{op:"GT",left:{value:1}},then:{value:1},else:{value:0}},context),/HAKODAN_DERIVED_CONDITION_INVALID/));
test("V2-24 unsupported comparison rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"IF",condition:{op:"NEQ",left:{value:1},right:{value:0}},then:{value:1},else:{value:0}},context),/HAKODAN_DERIVED_CONDITION_UNSUPPORTED_OP: NEQ/));
test("V2-24 IF exact-key validation rejects extra executable fields",()=>assert.throws(()=>evaluateFormula({op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:1},else:{value:0},script:"return 99"},context),/HAKODAN_DERIVED_FORMULA_INVALID/));
test("V2-24 condition exact-key validation rejects callback fields",()=>assert.throws(()=>evaluateFormula({op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1},callback:()=>true},then:{value:1},else:{value:0}},context),/HAKODAN_DERIVED_CONDITION_INVALID/));
test("V2-24 IF evidence contains only selected branch evaluation",()=>{const r=evaluateFormula({op:"IF",condition:{op:"GT",left:{stat:"health"},right:{value:50}},then:{op:"ROUND",args:[{stat:"positive"}]},else:{stat:"must_not_resolve"}},context);assert.equal(r.value,5);assert.equal(r.selected,"then");assert.equal(r.branch.value,5);assert.equal(r.branch.operands[0].value,4.6);assert.equal("operands" in r,false);});
