import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const context={resolveStat(){throw new Error("UNEXPECTED_STAT_RESOLUTION");}};

test("V2-27 unsupported operators reject before traversing hostile args",()=>{
 let touched=0;
 const payload={};
 Object.defineProperty(payload,"value",{enumerable:true,get(){touched+=1;throw new Error("UNSUPPORTED_PAYLOAD_TOUCHED");}});
 assert.throws(()=>evaluateFormula({op:"EVIL",args:[payload,{value:0},{value:100}]},context),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: EVIL/);
 assert.equal(touched,0);
});
