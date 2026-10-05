import test from "node:test";
import assert from "node:assert/strict";
import { collectEquipmentEffects, deriveStat, deriveStats } from "../src/equipment-effects-state.mjs";

const excalibur=()=>({id:"sword",instanceId:"excalibur-001",quantity:1,slot:"main_hand",effects:[{stat:"attack",op:"ADD",value:7}]});
const subject=()=>({stats:{base:{attack:10,defense:4}},equipment:{main_hand:excalibur(),off_hand:null,head:null,body:null}});

test("V2-21 Excalibur derives attack 10 to 17 without mutating base stats",()=>{const s=subject();const before=structuredClone(s.stats.base);const result=deriveStat(s,"stats.base","equipment","attack");assert.equal(result.value,17);assert.equal(result.base,10);assert.deepEqual(s.stats.base,before);});
test("V2-21 unequipped item contributes no effects",()=>{const s=subject();s.equipment.main_hand=null;assert.equal(deriveStat(s,"stats.base","equipment","attack").value,10);});
test("V2-21 multiple equipped modifiers compose in deterministic slot order",()=>{const s=subject();s.equipment.off_hand={id:"focus",instanceId:"focus-001",quantity:1,slot:"off_hand",effects:[{stat:"attack",op:"ADD",value:3},{stat:"attack",op:"SUBTRACT",value:2}]};const result=deriveStat(s,"stats.base","equipment","attack");assert.equal(result.value,18);assert.deepEqual(result.modifiers.map(x=>[x.slot,x.op,x.value]),[["main_hand","ADD",7],["off_hand","ADD",3],["off_hand","SUBTRACT",2]]);});
test("V2-21 effect collection is deterministic and carries ownership evidence",()=>{const effects=collectEquipmentEffects(subject(),"equipment");assert.deepEqual(effects,[{slot:"main_hand",instanceId:"excalibur-001",id:"sword",effectIndex:0,stat:"attack",op:"ADD",value:7}]);});
test("V2-21 derives all numeric base stats while preserving unaffected stats",()=>{const result=deriveStats(subject(),"stats.base","equipment");assert.equal(result.attack.value,17);assert.equal(result.defense.value,4);});
test("V2-21 invalid numeric modifier rejects explicitly",()=>{const s=subject();s.equipment.main_hand.effects[0].value="7";assert.throws(()=>deriveStat(s,"stats.base","equipment","attack"),/HAKODAN_EFFECT_NUMERIC_VALUE_REQUIRED: attack/);});
test("V2-21 unsupported modifier operation rejects explicitly",()=>{const s=subject();s.equipment.main_hand.effects[0].op="MULTIPLY";assert.throws(()=>deriveStat(s,"stats.base","equipment","attack"),/HAKODAN_EFFECT_UNSUPPORTED_OP: MULTIPLY/);});
test("V2-21 missing base stat rejects explicitly",()=>{assert.throws(()=>deriveStat(subject(),"stats.base","equipment","magic"),/HAKODAN_BASE_STAT_NOT_FOUND: magic/);});
test("V2-21 nonnumeric base stat rejects explicitly",()=>{const s=subject();s.stats.base.attack="10";assert.throws(()=>deriveStat(s,"stats.base","equipment","attack"),/HAKODAN_BASE_STAT_NUMERIC_REQUIRED: attack/);});
