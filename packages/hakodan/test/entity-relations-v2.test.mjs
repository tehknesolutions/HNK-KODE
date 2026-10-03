import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";
import { createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";

function world(condition, actions) {
  return createWorldRuntime({ ir:"HNK-IR", version:"0.2.0", world:{
    entities:[
      {id:"hero",name:"Hero",properties:{ready:true}},
      {id:"companion",name:"Companion",properties:{active:true}}
    ],
    rules:[{id:"relation-rule",trigger:"tick",condition,actions}]
  }});
}
const ready={kind:"EQUALS",subject:"hero",path:"ready",value:true};

test("V2-16 registry exposes relationship capabilities",()=>{
  const {conditions,actions}=createCanonicalRuntimeRegistries();
  assert.equal(conditions.has("RELATED"),true);
  assert.equal(actions.has("RELATE"),true);
  assert.equal(actions.has("UNRELATE"),true);
});

test("V2-16 RELATE creates a typed entity reference",()=>{
  const r=world(ready,[{kind:"RELATE",subject:"hero",type:"companion",target:"companion"}]);
  const changes=r.tick();
  assert.equal(r.relations.has("hero","companion","companion"),true);
  assert.deepEqual(changes,[{ruleId:"relation-rule",action:"RELATE",subject:"hero",type:"companion",target:"companion",before:false,after:true}]);
});

test("V2-16 RELATED can gate behavior",()=>{
  const r=world({kind:"RELATED",subject:"hero",type:"companion",target:"companion"},[{kind:"SET",subject:"companion",path:"active",value:false}]);
  assert.deepEqual(r.tick(),[]);
  r.relations.add("hero","companion","companion");
  assert.equal(r.tick().length,1);
  assert.equal(r.entity("companion").active,false);
});

test("V2-16 UNRELATE removes only the typed relation",()=>{
  const r=world(ready,[{kind:"UNRELATE",subject:"hero",type:"owner",target:"companion"}]);
  r.relations.add("hero","owner","companion");
  r.relations.add("hero","ally","companion");
  r.tick();
  assert.equal(r.relations.has("hero","owner","companion"),false);
  assert.equal(r.relations.has("hero","ally","companion"),true);
});

test("V2-16 duplicate RELATE is idempotent",()=>{
  const r=world(ready,[{kind:"RELATE",subject:"hero",type:"ally",target:"companion"}]);
  assert.equal(r.tick().length,1);
  assert.deepEqual(r.tick(),[]);
});

test("V2-16 rejects dangling entity references",()=>{
  const r=world(ready,[{kind:"RELATE",subject:"hero",type:"target",target:"missing"}]);
  assert.throws(()=>r.tick(),/HAKODAN_RELATION_ENTITY_NOT_FOUND/);
});
