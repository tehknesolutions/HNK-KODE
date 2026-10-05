import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};

function clamp(value,min,max){
  return {op:"CLAMP",args:[{value},{value:min},{value:max}]};
}

test("V2-25 CLAMP returns minimum when value is below range",()=>{
  assert.equal(evaluateFormula(clamp(-5,0,100),context).value,0);
});

test("V2-25 CLAMP preserves value inside range",()=>{
  assert.equal(evaluateFormula(clamp(42,0,100),context).value,42);
});

test("V2-25 CLAMP returns maximum when value is above range",()=>{
  assert.equal(evaluateFormula(clamp(150,0,100),context).value,100);
});

test("V2-25 CLAMP requires exactly three arguments",()=>{
  assert.throws(
    ()=>evaluateFormula({op:"CLAMP",args:[{value:1},{value:0}]},context),
    /HAKODAN_DERIVED_FORMULA_INVALID/
  );
  assert.throws(
    ()=>evaluateFormula({op:"CLAMP",args:[{value:1},{value:0},{value:2},{value:3}]},context),
    /HAKODAN_DERIVED_FORMULA_INVALID/
  );
});
