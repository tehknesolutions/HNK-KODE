import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};

function normalize(value,min,max){
  return {op:"NORMALIZE",args:[{value},{value:min},{value:max}]};
}

test("V2-26 NORMALIZE maps an in-range value into zero-to-one",()=>{
  assert.equal(evaluateFormula(normalize(50,0,100),context).value,0.5);
});

test("V2-26 NORMALIZE requires exactly three arguments",()=>{
  assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:50},{value:0}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
  assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:50},{value:0},{value:100},{value:200}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-26 NORMALIZE clamps values below and above the source range",()=>{
  assert.equal(evaluateFormula(normalize(-10,0,100),context).value,0);
  assert.equal(evaluateFormula(normalize(110,0,100),context).value,1);
});

test("V2-26 NORMALIZE preserves exact normalized boundaries",()=>{
  assert.equal(evaluateFormula(normalize(0,0,100),context).value,0);
  assert.equal(evaluateFormula(normalize(100,0,100),context).value,1);
});

test("V2-26 NORMALIZE accepts derived stat operands and preserves evaluated evidence",()=>{
  const values={current:75,min:50,max:100};
  const result=evaluateFormula(
    {op:"NORMALIZE",args:[{stat:"current"},{stat:"min"},{stat:"max"}]},
    {resolveStat:stat=>values[stat]}
  );
  assert.equal(result.value,0.5);
  assert.deepEqual(result.expression,{op:"NORMALIZE",args:[{stat:"current"},{stat:"min"},{stat:"max"}]});
});
