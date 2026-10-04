import test from "node:test";
import assert from "node:assert/strict";
import { getItemInstance, addItemInstance, transferItemInstance } from "../src/item-instance-state.mjs";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

const sword=(instanceId="excalibur-001")=>({id:"sword",instanceId,quantity:1,durability:87,enchantment:"light"});

test("V2-19 registry exposes instance capabilities",()=>{const{conditions,actions}=createCanonicalRuntimeRegistries();assert.equal(conditions.has("HAS_INSTANCE"),true);for(const k of ["ADD_INSTANCE","REMOVE_INSTANCE","TRANSFER_INSTANCE"])assert.equal(actions.has(k),true);});
test("V2-19 exact instance lookup is deterministic",()=>{const s={inventory:{items:[sword(),sword("sword-002")]}};assert.equal(getItemInstance(s,"inventory.items","excalibur-001").durability,87);});
test("V2-19 different instances of same id coexist",()=>{const s={inventory:{items:[sword()]}};addItemInstance(s,"inventory.items",sword("sword-002"));assert.equal(s.inventory.items.length,2);});
test("V2-19 duplicate instance id is rejected",()=>{const s={inventory:{items:[sword()]}};assert.throws(()=>addItemInstance(s,"inventory.items",sword()),/HAKODAN_ITEM_INSTANCE_DUPLICATE/);});
test("V2-19 instance quantity must equal one",()=>{const s={inventory:{items:[]}};assert.throws(()=>addItemInstance(s,"inventory.items",{...sword(),quantity:2}),/HAKODAN_ITEM_INSTANCE_QUANTITY_INVALID/);});
test("V2-19 transfer preserves exact instance metadata",()=>{const chest={inventory:{items:[sword()]}};const alakazam={inventory:{items:[]}};const e=transferItemInstance(chest,"inventory.items",alakazam,"inventory.items","excalibur-001");assert.deepEqual(chest.inventory.items,[]);assert.deepEqual(alakazam.inventory.items,[sword()]);assert.equal(e.instanceId,"excalibur-001");assert.deepEqual(e.item,sword());});
test("V2-19 target duplicate rejects before mutation",()=>{const chest={inventory:{items:[sword()]}};const alakazam={inventory:{items:[sword()]}};assert.throws(()=>transferItemInstance(chest,"inventory.items",alakazam,"inventory.items","excalibur-001"),/HAKODAN_ITEM_INSTANCE_DUPLICATE/);assert.deepEqual(chest.inventory.items,[sword()]);assert.deepEqual(alakazam.inventory.items,[sword()]);});

function runtime(targetItems=[],minimumCondition={kind:"HAS_INSTANCE",subject:"chest",path:"inventory.items",instanceId:"excalibur-001"}){return createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"chest",properties:{inventory:{items:[sword()]}}},{id:"alakazam",properties:{inventory:{items:targetItems}}}],rules:[{id:"claim-excalibur",trigger:"tick",condition:minimumCondition,actions:[{kind:"TRANSFER_INSTANCE",subject:"chest",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",instanceId:"excalibur-001"}]}]}});}

test("V2-19 world runtime transfers Excalibur and records ownership evidence",()=>{const r=runtime();const[e]=r.tick();assert.deepEqual(r.entity("chest").inventory.items,[]);assert.deepEqual(r.entity("alakazam").inventory.items,[sword()]);assert.equal(e.action,"TRANSFER_INSTANCE");assert.equal(e.instanceId,"excalibur-001");assert.deepEqual(e.item,sword());assert.deepEqual(e.source.before,[sword()]);assert.deepEqual(e.targetState.after,[sword()]);});
test("V2-19 HAS_INSTANCE gates runtime execution",()=>{const r=runtime([],{kind:"HAS_INSTANCE",subject:"chest",path:"inventory.items",instanceId:"missing"});assert.deepEqual(r.tick(),[]);assert.deepEqual(r.entity("chest").inventory.items,[sword()]);});
test("V2-19 runtime duplicate target is atomic and emits no evidence",()=>{const r=runtime([sword()]);assert.throws(()=>r.tick(),/HAKODAN_ITEM_INSTANCE_DUPLICATE/);assert.deepEqual(r.entity("chest").inventory.items,[sword()]);assert.deepEqual(r.entity("alakazam").inventory.items,[sword()]);assert.deepEqual(r.changes,[]);});
