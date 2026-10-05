import test from "node:test";
import assert from "node:assert/strict";

import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};
function denormalize(value,min,max){return {op:"DENORMALIZE",args:[{value},{value:min},{value:max}]};}

test("V2-27 DENORMALIZE maps an in-range normalized value into the source range",()=>assert.equal(evaluateFormula(denormalize(0.5,0,100),context).value,50));
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
test("V2-27 DENORMALIZE rejects equal source bounds canonically",()=>assert.throws(()=>evaluateFormula(denormalize(0.5,5,5),context),/HAKODAN_DERIVED_FORMULA_INVALID_RANGE/));
test("V2-27 DENORMALIZE rejects inverted source ranges canonically",()=>assert.throws(()=>evaluateFormula(denormalize(0.5,60,20),context),/HAKODAN_DERIVED_FORMULA_INVALID_RANGE/));
test("V2-27 DENORMALIZE rejects nonnumeric operands canonically",()=>assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{stat:"min"},{value:100}]},{resolveStat:()=>"20"}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));
test("V2-27 DENORMALIZE rejects non-finite operands canonically",()=>assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{stat:"min"},{value:100}]},{resolveStat:()=>Infinity}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));
test("V2-27 DENORMALIZE never traverses dormant nested IF accessor",()=>{
 let touched=0; const dormant={};
 Object.defineProperty(dormant,"stat",{enumerable:true,get(){touched+=1;throw new Error("DENORMALIZE_DORMANT_BRANCH_TOUCHED");}});
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:0.25},else:dormant};
 const result=evaluateFormula({op:"DENORMALIZE",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,25); assert.equal(touched,0);
 assert.deepEqual(result.expression,{op:"DENORMALIZE",args:[{op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:0.25}},{value:0},{value:100}]});
});
test("V2-27 DENORMALIZE tolerates uncloneable dormant nested IF values",()=>{
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:0.75},else:{stat:"unused",callback:()=>99}};
 const result=evaluateFormula({op:"DENORMALIZE",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,75); assert.equal(result.operands[0].selected,"then");
});
test("V2-27 DENORMALIZE maps the widest finite range without intermediate overflow",()=>{
 const min=-Number.MAX_VALUE,max=Number.MAX_VALUE;
 assert.equal(evaluateFormula(denormalize(0,min,max),context).value,min);
 assert.equal(evaluateFormula(denormalize(0.5,min,max),context).value,0);
 assert.equal(evaluateFormula(denormalize(1,min,max),context).value,max);
});
test("V2-27 DENORMALIZE maps interior points of the widest finite range without overflow",()=>{
 const min=-Number.MAX_VALUE,max=Number.MAX_VALUE;
 assert.equal(evaluateFormula(denormalize(0.25,min,max),context).value,-Number.MAX_VALUE/2);
 assert.equal(evaluateFormula(denormalize(0.75,min,max),context).value,Number.MAX_VALUE/2);
});

test("V2-27 DENORMALIZE preserves exact-key AST validation",()=>{
 assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{value:0},{value:100}],extra:"forbidden"},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});
test("V2-27 DENORMALIZE rejects arbitrary callback-bearing operands",()=>{
 assert.throws(()=>evaluateFormula({op:"DENORMALIZE",args:[{value:0.5},{value:0},{value:100,callback:()=>1}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});
test("V2-27 DENORMALIZE rejects unsupported operators without executing payload",()=>{
 let touched=0;
 const payload={}; Object.defineProperty(payload,"value",{enumerable:true,get(){touched+=1;throw new Error("UNSUPPORTED_PAYLOAD_TOUCHED");}});
 assert.throws(()=>evaluateFormula({op:"EVIL",args:[payload,{value:0},{value:100}]},context),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: EVIL/);
 assert.equal(touched,0);
});
test("V2-27 DENORMALIZE remains compatible with NORMALIZE round-trip on a bounded range",()=>{
 const normalized=evaluateFormula({op:"NORMALIZE",args:[{value:30},{value:20},{value:60}]},context).value;
 assert.equal(normalized,0.25);
 assert.equal(evaluateFormula(denormalize(normalized,20,60),context).value,30);
});
