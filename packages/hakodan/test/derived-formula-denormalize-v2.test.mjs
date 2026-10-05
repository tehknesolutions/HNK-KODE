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

test("V2-27 DENORMALIZE clamps normalized values below zero and above one",()=>{
 assert.equal(evaluateFormula(denormalize(-1,0,100),context).value,0);
 assert.equal(evaluateFormula(denormalize(2,0,100),context).value,100);
});

test("V2-27 DENORMALIZE preserves exact normalized boundaries",()=>{
 assert.equal(evaluateFormula(denormalize(0,20,60),context).value,20);
 assert.equal(evaluateFormula(denormalize(1,20,60),context).value,60);
});

test("V2-27 DENORMALIZE accepts derived stat operands and preserves evaluated evidence",()=>{
 const values={progress:0.25,min:20,max:60};
 const result=evaluateFormula({op:"DENORMALIZE",args:[{stat:"progress"},{stat:"min"},{stat:"max"}]},{resolveStat:stat=>values[stat]});
 assert.equal(result.value,30);
 assert.deepEqual(result.expression,{op:"DENORMALIZE",args:[{stat:"progress"},{stat:"min"},{stat:"max"}]});
});
