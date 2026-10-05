import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const subject = () => ({ stats: { base: { attack: 10, strength: 4 }, definitions: {} }, equipment: { main_hand: null } });
const resolve = (s) => (stat) => { if (!Object.prototype.hasOwnProperty.call(s.stats.base, stat)) throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: ${stat}`); return s.stats.base[stat]; };

test("V2-23 literal formula returns finite numeric value without mutation",()=>{const s=subject(),before=structuredClone(s);assert.equal(evaluateFormula({value:7},{resolveStat:resolve(s)}).value,7);assert.deepEqual(s,before);});
test("V2-23 stat reference resolves through explicit resolver",()=>{const s=subject(),r=evaluateFormula({stat:"attack"},{resolveStat:resolve(s)});assert.equal(r.value,10);assert.deepEqual(r.expression,{stat:"attack"});});
test("V2-23 ADD composes ordered operands",()=>{const r=evaluateFormula({op:"ADD",args:[{stat:"attack"},{value:2}]},{resolveStat:resolve(subject())});assert.equal(r.value,12);assert.deepEqual(r.operands.map(x=>x.value),[10,2]);});
test("V2-23 SUBTRACT preserves operand order",()=>{const r=evaluateFormula({op:"SUBTRACT",args:[{stat:"attack"},{stat:"strength"}]},{resolveStat:resolve(subject())});assert.equal(r.value,6);assert.deepEqual(r.operands.map(x=>x.value),[10,4]);});
test("V2-23 malformed formula rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"ADD"},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_INVALID/));
test("V2-23 unsupported operator rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"POWER",args:[{value:2},{value:3}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: POWER/));
test("V2-23 nonnumeric literal rejects explicitly",()=>assert.throws(()=>evaluateFormula({value:"7"},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));

test("V2-23 nested MULTIPLY composes formula operands",()=>{const r=evaluateFormula({op:"ADD",args:[{stat:"attack"},{op:"MULTIPLY",args:[{stat:"strength"},{value:2}]}]},{resolveStat:resolve(subject())});assert.equal(r.value,18);assert.equal(r.operands[1].value,8);});
test("V2-23 DIVIDE preserves operand order",()=>{const r=evaluateFormula({op:"DIVIDE",args:[{stat:"attack"},{value:2}]},{resolveStat:resolve(subject())});assert.equal(r.value,5);assert.deepEqual(r.operands.map(x=>x.value),[10,2]);});
test("V2-23 MIN and MAX resolve nested numeric operands",()=>{const ctx={resolveStat:resolve(subject())};assert.equal(evaluateFormula({op:"MIN",args:[{stat:"attack"},{stat:"strength"},{value:7}]},ctx).value,4);assert.equal(evaluateFormula({op:"MAX",args:[{stat:"attack"},{stat:"strength"},{value:7}]},ctx).value,10);});
test("V2-23 division by zero rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"DIVIDE",args:[{value:10},{value:0}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_DIVIDE_BY_ZERO/));
test("V2-23 nested evidence preserves expression tree and resolved values",()=>{const r=evaluateFormula({op:"MULTIPLY",args:[{op:"ADD",args:[{stat:"strength"},{value:1}]},{value:3}]},{resolveStat:resolve(subject())});assert.equal(r.value,15);assert.equal(r.operands[0].value,5);assert.equal(r.operands[0].operands[0].value,4);assert.deepEqual(r.expression,{op:"MULTIPLY",args:[{op:"ADD",args:[{stat:"strength"},{value:1}]},{value:3}]});});
test("V2-23 every resolved result remains finite",()=>assert.throws(()=>evaluateFormula({op:"MULTIPLY",args:[{value:Number.MAX_VALUE},{value:2}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));
