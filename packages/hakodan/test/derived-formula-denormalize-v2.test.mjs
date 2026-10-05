import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};

function denormalize(value,min,max){return {op:"DENORMALIZE",args:[{value},{value:min},{value:max}]};}

test("V2-27 DENORMALIZE maps an in-range normalized value into the source range",()=>{
 assert.equal(evaluateFormula(denormalize(0.5,0,100),context).value,50);
});

test("V2-27 DENORMALIZE requires exactly three arguments",()=>{
 assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{value:0}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
 assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{value:0},{value:100},{value:200}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});
