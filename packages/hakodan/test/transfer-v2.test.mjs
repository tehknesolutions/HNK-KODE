import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";

function runtime(sourceItems, targetItems, action = {}) {
  return createWorldRuntime({ ir:"HNK-IR", version:"0.2.0", world:{
    entities:[
      {id:"world",name:"Abra's Island Chest",properties:{inventory:{items:sourceItems}}},
      {id:"alakazam",name:"Alakazam",properties:{inventory:{items:targetItems}}}
    ],
    rules:[{id:"loot",trigger:"tick",condition:{kind:"HAS",subject:"world",path:"inventory.items",value:"key"},actions:[{kind:"TRANSFER",subject:"world",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",value:"key",...action}]}]
  }});
}

test("V2-16 registry exposes TRANSFER",()=>{const{actions}=createCanonicalRuntimeRegistries();assert.equal(actions.has("TRANSFER"),true);});
test("V2-16 transfers one matching item by default",()=>{const r=runtime(["key","key","coin"],[]);const [e]=r.tick();assert.deepEqual(r.entity("world").inventory.items,["key","coin"]);assert.deepEqual(r.entity("alakazam").inventory.items,["key"]);assert.deepEqual(e.source,{before:["key","key","coin"],after:["key","coin"]});assert.deepEqual(e.targetState,{before:[],after:["key"]});});
test("V2-16 transfers all matching items",()=>{const r=runtime(["key","key","coin"],["gem"],{all:true});r.tick();assert.deepEqual(r.entity("world").inventory.items,["coin"]);assert.deepEqual(r.entity("alakazam").inventory.items,["gem","key","key"]);});
test("V2-16 missing item is inert",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:["coin"]}}},{id:"b",name:"B",properties:{inventory:{items:[]}}}],rules:[{id:"r",trigger:"tick",condition:{kind:"GTE",subject:"a",path:"position.x",value:0},actions:[{kind:"TRANSFER",subject:"a",path:"inventory.items",target:"b",targetPath:"inventory.items",value:"key"}]}]}});assert.deepEqual(r.tick(),[]);assert.deepEqual(r.entity("a").inventory.items,["coin"]);assert.deepEqual(r.entity("b").inventory.items,[]);});
test("V2-16 rejects non-array source without mutating target",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:{}}}},{id:"b",name:"B",properties:{inventory:{items:[]}}}],rules:[{id:"r",trigger:"tick",condition:{kind:"GTE",subject:"a",path:"position.x",value:0},actions:[{kind:"TRANSFER",subject:"a",path:"inventory.items",target:"b",targetPath:"inventory.items",value:"key"}]}]}});assert.throws(()=>r.tick(),/HAKODAN_COLLECTION_ARRAY_REQUIRED/);assert.deepEqual(r.entity("b").inventory.items,[]);});
test("V2-16 rejects non-array target before source mutation",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:["key"]}}},{id:"b",name:"B",properties:{inventory:{items:{}}}}],rules:[{id:"r",trigger:"tick",condition:{kind:"HAS",subject:"a",path:"inventory.items",value:"key"},actions:[{kind:"TRANSFER",subject:"a",path:"inventory.items",target:"b",targetPath:"inventory.items",value:"key"}]}]}});assert.throws(()=>r.tick(),/HAKODAN_COLLECTION_ARRAY_REQUIRED/);assert.deepEqual(r.entity("a").inventory.items,["key"]);});
test("V2-16 rejects unreadable write path before source mutation",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:["key"]}}},{id:"b",name:"B",properties:{bags:[{items:[]}]}}],rules:[{id:"r",trigger:"tick",condition:{kind:"HAS",subject:"a",path:"inventory.items",value:"key"},actions:[{kind:"TRANSFER",subject:"a",path:"inventory.items",target:"b",targetPath:"bags.0.items",value:"key"}]}]}});assert.throws(()=>r.tick(),/HAKODAN_STATE_PATH_NOT_OBJECT/);assert.deepEqual(r.entity("a").inventory.items,["key"]);});
test("V2-16 same collection self-transfer is inert",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:["key","coin"]}}}],rules:[{id:"r",trigger:"tick",condition:{kind:"HAS",subject:"a",path:"inventory.items",value:"key"},actions:[{kind:"TRANSFER",subject:"a",path:"inventory.items",target:"a",targetPath:"inventory.items",value:"key"}]}]}});assert.deepEqual(r.tick(),[]);assert.deepEqual(r.entity("a").inventory.items,["key","coin"]);});
