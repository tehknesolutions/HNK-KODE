import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";

function runtime(items, condition, actions) {
  return createWorldRuntime({ ir:"HNK-IR", version:"0.2.0", world:{ entities:[{id:"a",name:"Alakazam",properties:{inventory:{items}}}], rules:[{id:"inventory",trigger:"tick",condition,actions}] } });
}
const has = value => ({kind:"HAS",subject:"a",path:"inventory.items",value});

test("V2-15 registry exposes collection capabilities",()=>{const{conditions,actions}=createCanonicalRuntimeRegistries();for(const k of["HAS","COUNT"])assert.equal(conditions.has(k),true);for(const k of["PUSH","REMOVE"])assert.equal(actions.has(k),true);});

test("V2-15 HAS gates an inventory action",()=>{const r=runtime(["key"],has("key"),[{kind:"PUSH",subject:"a",path:"inventory.items",value:"gem"}]);r.tick();assert.deepEqual(r.entity("a").inventory.items,["key","gem"]);});

test("V2-15 REMOVE removes one matching item by default",()=>{const r=runtime(["coin","coin","key"],has("key"),[{kind:"REMOVE",subject:"a",path:"inventory.items",value:"coin"}]);r.tick();assert.deepEqual(r.entity("a").inventory.items,["coin","key"]);});

test("V2-15 REMOVE all removes every matching item",()=>{const r=runtime(["coin","coin","key"],has("key"),[{kind:"REMOVE",subject:"a",path:"inventory.items",value:"coin",all:true}]);r.tick();assert.deepEqual(r.entity("a").inventory.items,["key"]);});

test("V2-15 COUNT supports exact quantity rules",()=>{const r=runtime(["coin","coin"],{kind:"COUNT",subject:"a",path:"inventory.items",value:"coin",count:2},[{kind:"PUSH",subject:"a",path:"inventory.items",value:"key"}]);assert.equal(r.tick().length,1);assert.deepEqual(r.entity("a").inventory.items,["coin","coin","key"]);});

test("V2-15 collection capabilities require arrays",()=>{const r=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[{id:"a",name:"A",properties:{inventory:{items:{}}}}],rules:[{id:"r",trigger:"tick",condition:has("key"),actions:[]}]}});assert.throws(()=>r.tick(),/HAKODAN_COLLECTION_ARRAY_REQUIRED/);});
