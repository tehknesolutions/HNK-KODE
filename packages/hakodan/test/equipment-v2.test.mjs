import test from "node:test";
import assert from "node:assert/strict";
import { equipItemInstance, unequipItemInstance, isInstanceEquipped, isEquipmentSlotEmpty } from "../src/equipment-state.mjs";

const sword=()=>({id:"sword",instanceId:"excalibur-001",quantity:1,slot:"main_hand",durability:87,enchantment:"light"});
const hero=()=>({inventory:{items:[sword()]},equipment:{main_hand:null,off_hand:null,head:null,body:null}});

test("V2-20 equips exact owned instance into compatible empty slot",()=>{const h=hero();const e=equipItemInstance(h,"inventory.items","equipment","excalibur-001","main_hand");assert.deepEqual(h.inventory.items,[]);assert.deepEqual(h.equipment.main_hand,sword());assert.equal(e.instanceId,"excalibur-001");});
test("V2-20 occupied slot rejects before mutation",()=>{const h=hero();h.equipment.main_hand={id:"dagger",instanceId:"dagger-001",quantity:1,slot:"main_hand"};const before=structuredClone(h);assert.throws(()=>equipItemInstance(h,"inventory.items","equipment","excalibur-001","main_hand"),/HAKODAN_EQUIPMENT_SLOT_OCCUPIED/);assert.deepEqual(h,before);});
test("V2-20 incompatible slot rejects before mutation",()=>{const h=hero();const before=structuredClone(h);assert.throws(()=>equipItemInstance(h,"inventory.items","equipment","excalibur-001","off_hand"),/HAKODAN_EQUIPMENT_SLOT_INCOMPATIBLE/);assert.deepEqual(h,before);});
test("V2-20 unequip returns exact instance with metadata preserved",()=>{const h=hero();equipItemInstance(h,"inventory.items","equipment","excalibur-001","main_hand");const e=unequipItemInstance(h,"equipment","main_hand","inventory.items");assert.deepEqual(h.inventory.items,[sword()]);assert.equal(h.equipment.main_hand,null);assert.deepEqual(e.item,sword());});
test("V2-20 equipment predicates are deterministic",()=>{const h=hero();assert.equal(isEquipmentSlotEmpty(h,"equipment","main_hand"),true);assert.equal(isInstanceEquipped(h,"equipment","excalibur-001"),false);equipItemInstance(h,"inventory.items","equipment","excalibur-001","main_hand");assert.equal(isEquipmentSlotEmpty(h,"equipment","main_hand"),false);assert.equal(isInstanceEquipped(h,"equipment","excalibur-001"),true);});
