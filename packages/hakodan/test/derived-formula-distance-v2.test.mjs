import test from "node:test";
import assert from "node:assert/strict";

import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};
const distance=(ax,ay,bx,by)=>({op:"DISTANCE",args:[{value:ax},{value:ay},{value:bx},{value:by}]});

test("V2-28 DISTANCE computes deterministic 2D Euclidean distance",()=>{
 assert.equal(evaluateFormula(distance(0,0,3,4),context).value,5);
});

test("V2-28 DISTANCE requires exactly four numeric coordinate operands",()=>{
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{value:3}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{value:3},{value:4},{value:5}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-28 DISTANCE accepts derived coordinate stats and preserves evaluated evidence",()=>{
 const values={alakazamX:2,alakazamY:3,portalX:5,portalY:7};
 const expression={op:"DISTANCE",args:[{stat:"alakazamX"},{stat:"alakazamY"},{stat:"portalX"},{stat:"portalY"}]};
 const result=evaluateFormula(expression,{resolveStat:stat=>values[stat]});
 assert.equal(result.value,5);
 assert.deepEqual(result.expression,expression);
});

test("V2-28 DISTANCE is symmetric and zero for identical positions",()=>{
 assert.equal(evaluateFormula(distance(2,-3,2,-3),context).value,0);
 assert.equal(evaluateFormula(distance(2,-3,8,5),context).value,evaluateFormula(distance(8,5,2,-3),context).value);
});

test("V2-28 DISTANCE rejects nonnumeric or nonfinite coordinates canonically",()=>{
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{stat:"x"},{value:4}]},{resolveStat:()=>"3"}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{stat:"x"},{value:4}]},{resolveStat:()=>Infinity}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});

test("V2-28 DISTANCE avoids intermediate overflow for widest finite coordinates",()=>{
 const result=evaluateFormula(distance(-Number.MAX_VALUE,0,Number.MAX_VALUE,0),context);
 assert.equal(result.value,Number.MAX_VALUE);
});

test("V2-28 DISTANCE never traverses a dormant nested IF branch",()=>{
 let touched=0; const dormant={};
 Object.defineProperty(dormant,"stat",{enumerable:true,get(){touched+=1;throw new Error("DISTANCE_DORMANT_BRANCH_TOUCHED");}});
 const selected={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:3},else:dormant};
 const result=evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},selected,{value:4}]},context);
 assert.equal(result.value,5); assert.equal(touched,0);
});

test("V2-28 DISTANCE preserves exact-key validation and arbitrary-execution prohibition",()=>{
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{value:3},{value:4}],callback:()=>1},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
 assert.throws(()=>evaluateFormula({op:"DISTANCE",args:[{value:0},{value:0},{value:3,callback:()=>1},{value:4}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});
