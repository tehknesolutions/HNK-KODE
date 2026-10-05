import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";
import { deriveStat, deriveStats } from "../src/derived-dependency-state.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

const subject=()=>({stats:{base:{attack:10,strength:4},definitions:{},derived:{}},equipment:{main_hand:null}});
const resolve=s=>stat=>{if(!Object.prototype.hasOwnProperty.call(s.stats.base,stat))throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: ${stat}`);return s.stats.base[stat];};

test("V2-23 literal formula returns finite numeric value without mutation",()=>{const s=subject(),before=structuredClone(s);assert.equal(evaluateFormula({value:7},{resolveStat:resolve(s)}).value,7);assert.deepEqual(s,before);});
test("V2-23 stat reference resolves through explicit resolver",()=>assert.equal(evaluateFormula({stat:"attack"},{resolveStat:resolve(subject())}).value,10));
test("V2-23 ADD composes ordered operands",()=>assert.equal(evaluateFormula({op:"ADD",args:[{stat:"attack"},{value:2}]},{resolveStat:resolve(subject())}).value,12));
test("V2-23 SUBTRACT preserves operand order",()=>assert.equal(evaluateFormula({op:"SUBTRACT",args:[{stat:"attack"},{stat:"strength"}]},{resolveStat:resolve(subject())}).value,6));
test("V2-23 malformed formula rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"ADD"},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_INVALID/));
test("V2-23 unsupported operator rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"POWER",args:[{value:2},{value:3}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: POWER/));
test("V2-23 nonnumeric literal rejects explicitly",()=>assert.throws(()=>evaluateFormula({value:"7"},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));
test("V2-23 nested MULTIPLY composes formula operands",()=>assert.equal(evaluateFormula({op:"ADD",args:[{stat:"attack"},{op:"MULTIPLY",args:[{stat:"strength"},{value:2}]}]},{resolveStat:resolve(subject())}).value,18));
test("V2-23 DIVIDE preserves operand order",()=>assert.equal(evaluateFormula({op:"DIVIDE",args:[{stat:"attack"},{value:2}]},{resolveStat:resolve(subject())}).value,5));
test("V2-23 MIN and MAX resolve nested numeric operands",()=>{const ctx={resolveStat:resolve(subject())};assert.equal(evaluateFormula({op:"MIN",args:[{stat:"attack"},{stat:"strength"},{value:7}]},ctx).value,4);assert.equal(evaluateFormula({op:"MAX",args:[{stat:"attack"},{stat:"strength"},{value:7}]},ctx).value,10);});
test("V2-23 division by zero rejects explicitly",()=>assert.throws(()=>evaluateFormula({op:"DIVIDE",args:[{value:10},{value:0}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_DIVIDE_BY_ZERO/));
test("V2-23 every resolved result remains finite",()=>assert.throws(()=>evaluateFormula({op:"MULTIPLY",args:[{value:Number.MAX_VALUE},{value:2}]},{resolveStat:()=>1}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));

test("V2-23 derived definition may use formula over base stats",()=>{const s=subject();s.stats.definitions.power={formula:{op:"ADD",args:[{stat:"attack"},{op:"MULTIPLY",args:[{stat:"strength"},{value:2}]}]}};const r=deriveStat(s,"stats.base","stats.definitions","equipment","power");assert.equal(r.value,18);assert.equal(r.formula.value,18);});
test("V2-23 formula may reference another formula-derived stat",()=>{const s=subject();s.stats.definitions={power:{formula:{op:"ADD",args:[{stat:"attack"},{value:2}]}},combat:{formula:{op:"MULTIPLY",args:[{stat:"power"},{value:2}]}}};assert.equal(deriveStat(s,"stats.base","stats.definitions","equipment","combat").value,24);});
test("V2-23 formula cycle reuses canonical derived cycle error",()=>{const s=subject();s.stats.definitions={power:{formula:{stat:"combat"}},combat:{formula:{stat:"power"}}};assert.throws(()=>deriveStat(s,"stats.base","stats.definitions","equipment","power"),/HAKODAN_DERIVED_CYCLE: power->combat->power/);});
test("V2-23 dependsOn remains backward compatible beside formula definitions",()=>{const s=subject();s.stats.definitions={legacy:{dependsOn:[{stat:"attack"},{stat:"strength"}]},power:{formula:{op:"ADD",args:[{stat:"attack"},{value:2}]}}};const all=deriveStats(s,"stats.base","stats.definitions","equipment");assert.equal(all.legacy.value,14);assert.equal(all.power.value,12);});

test("V2-23 rejects ambiguous definition containing formula and dependsOn",()=>{const s=subject();s.stats.definitions.power={formula:{stat:"attack"},dependsOn:[{stat:"strength"}]};assert.throws(()=>deriveStat(s,"stats.base","stats.definitions","equipment","power"),/HAKODAN_DERIVED_DEPENDENCY_INVALID/);});
test("V2-23 formula nodes reject extra executable or ambiguous fields",()=>{const ctx={resolveStat:()=>1};assert.throws(()=>evaluateFormula({value:1,run:"alert"},ctx),/HAKODAN_DERIVED_FORMULA_INVALID/);assert.throws(()=>evaluateFormula({stat:"attack",callback:()=>1},ctx),/HAKODAN_DERIVED_FORMULA_INVALID/);assert.throws(()=>evaluateFormula({op:"ADD",args:[{value:1},{value:2}],script:"return 99"},ctx),/HAKODAN_DERIVED_FORMULA_INVALID/);});
test("V2-23 formula context rejects non-function resolver",()=>assert.throws(()=>evaluateFormula({value:1},{resolveStat:"attack"}),/HAKODAN_DERIVED_FORMULA_INVALID/));
test("V2-23 stat resolver result must remain finite",()=>assert.throws(()=>evaluateFormula({stat:"attack"},{resolveStat:()=>Infinity}),/HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED/));

function runtime(condition,actions){return createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"alakazam",properties:subject()}],rules:[{id:"formula-rule",trigger:"tick",condition,actions}]}});}
test("V2-23 DERIVED_GTE evaluates formula-derived stat without mutation",()=>{const r=runtime({kind:"DERIVED_GTE",subject:"alakazam",basePath:"stats.base",definitionsPath:"stats.definitions",equipmentPath:"equipment",stat:"power",value:18},[]);const s=r.entity("alakazam");s.stats.definitions.power={formula:{op:"ADD",args:[{stat:"attack"},{op:"MULTIPLY",args:[{stat:"strength"},{value:2}]}]}};const before=structuredClone(s.stats);assert.deepEqual(r.tick(),[]);assert.deepEqual(s.stats,before);});
test("V2-23 SYNC_DERIVED_STATS materializes formula final value and evidence",()=>{const r=runtime({kind:"EQUALS",subject:"alakazam",path:"stats.base.attack",value:10},[{kind:"SYNC_DERIVED_STATS",subject:"alakazam",basePath:"stats.base",definitionsPath:"stats.definitions",equipmentPath:"equipment",derivedPath:"stats.derived"}]);const s=r.entity("alakazam");s.stats.definitions.power={formula:{op:"ADD",args:[{stat:"attack"},{op:"MULTIPLY",args:[{stat:"strength"},{value:2}]}]}};const[e]=r.tick();assert.equal(s.stats.derived.power,18);assert.equal(e.derived.power.formula.value,18);assert.equal(e.derived.power.formula.operands[1].value,8);});
