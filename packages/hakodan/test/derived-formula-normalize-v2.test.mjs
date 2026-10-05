import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};

function normalize(value,min,max){return {op:"NORMALIZE",args:[{value},{value:min},{value:max}]};}

test("V2-26 NORMALIZE maps an in-range value into zero-to-one",()=>assert.equal(evaluateFormula(normalize(50,0,100),context).value,0.5));

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
 const result=evaluateFormula({op:"NORMALIZE",args:[{stat:"current"},{stat:"min"},{stat:"max"}]},{resolveStat:stat=>values[stat]});
 assert.equal(result.value,0.5);
 assert.deepEqual(result.expression,{op:"NORMALIZE",args:[{stat:"current"},{stat:"min"},{stat:"max"}]});
});

test("V2-26 NORMALIZE rejects equal source bounds canonically",()=>{
 assert.throws(()=>evaluateFormula(normalize(5,5,5),context),/HAKODAN_DERIVED_FORMULA_INVALID_RANGE/);
});

test("V2-26 NORMALIZE rejects inverted source ranges canonically",()=>{
 assert.throws(()=>evaluateFormula(normalize(5,10,0),context),/HAKODAN_DERIVED_FORMULA_INVALID_RANGE/);
});

test("V2-26 NORMALIZE rejects nonnumeric operands canonically",()=>{
 assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:5},{stat:"bad"},{value:10}]},{resolveStat:()=>"0"}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});

test("V2-26 NORMALIZE rejects non-finite operands canonically",()=>{
 assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:5},{stat:"bad"},{value:10}]},{resolveStat:()=>Infinity}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/);
});

test("V2-26 NORMALIZE never traverses dormant nested IF accessor",()=>{
 let touched=0;
 const dormant={};
 Object.defineProperty(dormant,"stat",{enumerable:true,get(){touched+=1;throw new Error("NORMALIZE_DORMANT_BRANCH_TOUCHED");}});
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:75},else:dormant};
 const result=evaluateFormula({op:"NORMALIZE",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,0.75);
 assert.equal(touched,0);
 assert.deepEqual(result.expression,{op:"NORMALIZE",args:[{op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:75}},{value:0},{value:100}]});
});

test("V2-26 NORMALIZE tolerates uncloneable dormant nested IF values",()=>{
 const conditional={op:"IF",condition:{op:"EQ",left:{value:1},right:{value:1}},then:{value:25},else:{stat:"unused",callback:()=>99}};
 const result=evaluateFormula({op:"NORMALIZE",args:[conditional,{value:0},{value:100}]},context);
 assert.equal(result.value,0.25);
 assert.equal(result.operands[0].selected,"then");
});

test("V2-26 NORMALIZE rejects arbitrary callback-bearing operands",()=>{
 assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:50},{value:0},{value:100,callback:()=>1}]},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});

test("V2-26 NORMALIZE rejects unsupported operators without executing payload",()=>{
 assert.throws(()=>evaluateFormula({op:"EVIL",args:[{value:50},{value:0},{value:100,callback:()=>1}]},context),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: EVIL/);
});

test("V2-26 NORMALIZE preserves exact-key AST validation",()=>{
 assert.throws(()=>evaluateFormula({op:"NORMALIZE",args:[{value:50},{value:0},{value:100}],extra:"forbidden"},context),/HAKODAN_DERIVED_FORMULA_INVALID/);
});
