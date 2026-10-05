import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};
function clamp(value,min,max){return {op:"CLAMP",args:[{value},{value:min},{value:max}]};}

test("V2-25 CLAMP returns minimum when value is below range",()=>assert.equal(evaluateFormula(clamp(-5,0,100),context).value,0));
test("V2-25 CLAMP preserves value inside range",()=>assert.equal(evaluateFormula(clamp(42,0,100),context).value,42));
test("V2-25 CLAMP returns maximum when value is above range",()=>assert.equal(evaluateFormula(clamp(150,0,100),context).value,100));
test("V2-25 CLAMP preserves exact boundaries",()=>{assert.equal(evaluateFormula(clamp(0,0,100),context).value,0);assert.equal(evaluateFormula(clamp(100,0,100),context).value,100);});

test("V2-25 CLAMP requires exactly three arguments",()=>{
 assert.throws(()=>evaluateFormula({op:"CLAMP",args:[{value:1},{value:0}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
 assert.throws(()=>evaluateFormula({op:"CLAMP",args:[{value:1},{value:0},{value:2},{value:3}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-25 CLAMP accepts derived stat operands",()=>{
 const values={current:150,min:10,max:90};
 const result=evaluateFormula({op:"CLAMP",args:[{stat:"current"},{stat:"min"},{stat:"max"}]},{resolveStat:stat=>values[stat]});
 assert.equal(result.value,90);
 assert.deepEqual(result.expression,{op:"CLAMP",args:[{stat:"current"},{stat:"min"},{stat:"max"}]});
});

test("V2-25 CLAMP rejects nonnumeric operands canonically",()=>{
 assert.throws(()=>evaluateFormula({op:"CLAMP",args:[{value:1},{stat:"bad"},{value:10}]},{resolveStat:()=>"0"}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});

test("V2-25 CLAMP rejects non-finite operands canonically",()=>{
 assert.throws(()=>evaluateFormula({op:"CLAMP",args:[{value:1},{stat:"bad"},{value:10}]},{resolveStat:()=>Infinity}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});

test("V2-25 CLAMP rejects inverted ranges canonically",()=>{
 assert.throws(()=>evaluateFormula(clamp(5,10,0),context),/HAKODAN_DERIVED_FORMULA_INVALID_RANGE/);
});

test("V2-25 CLAMP never traverses dormant nested IF accessor",()=>{
 let touched=0;
 const dormant={};
 Object.defineProperty(dormant,"stat",{enumerable:true,get(){touched+=1;throw new Error("CLAMP_DORMANT_BRANCH_TOUCHED");}});
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:150},else:dormant};
 const result=evaluateFormula({op:"CLAMP",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,100);
 assert.equal(touched,0);
 assert.deepEqual(result.expression,{op:"CLAMP",args:[{op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:150}},{value:0},{value:100}]});
});

test("V2-25 CLAMP tolerates uncloneable dormant nested IF values",()=>{
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:-5},else:{stat:"unused",callback:()=>99}};
 const result=evaluateFormula({op:"CLAMP",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,0);
 assert.equal(result.operands[0].selected,"then");
});
