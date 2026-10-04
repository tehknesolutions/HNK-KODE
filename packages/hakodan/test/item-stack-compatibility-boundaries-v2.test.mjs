import test from "node:test";
import assert from "node:assert/strict";
import { itemStacksCompatible } from "../src/item-stack-state.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-18 metadata arrays are ordered sequences",()=>{
  const left={id:"potion",quantity:1,tags:["holy","red"]};
  const right={id:"potion",quantity:9,tags:["red","holy"]};
  assert.equal(itemStacksCompatible(left,right),false);
});

test("V2-18 nested object key order is irrelevant while nested array order remains significant",()=>{
  const a={id:"rune",quantity:1,meta:{school:"light",steps:[{x:1,y:2},{x:3,y:4}]}};
  const b={id:"rune",quantity:7,meta:{steps:[{y:2,x:1},{y:4,x:3}],school:"light"}};
  const c={id:"rune",quantity:7,meta:{steps:[{y:4,x:3},{y:2,x:1}],school:"light"}};
  assert.equal(itemStacksCompatible(a,b),true);
  assert.equal(itemStacksCompatible(a,c),false);
});

test("V2-18 runtime ADD_ITEM creates canonical metadata and emits evidence",()=>{
  const runtime=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[
    {id:"alakazam",name:"Alakazam",properties:{inventory:{items:[]}}}
  ],rules:[{id:"grant-potion",trigger:"tick",actions:[{
    kind:"ADD_ITEM",subject:"alakazam",path:"inventory.items",id:"potion",quantity:2,
    metadata:{tier:1,effect:"heal",tags:["holy","red"]}
  }]}]}});
  const [evidence]=runtime.tick();
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[{id:"potion",quantity:2,effect:"heal",tags:["holy","red"],tier:1}]);
  assert.equal(evidence.action,"ADD_ITEM");
  assert.deepEqual(evidence.after,[{id:"potion",quantity:2,effect:"heal",tags:["holy","red"],tier:1}]);
});

test("V2-18 runtime ADD_ITEM rejects incompatible metadata atomically",()=>{
  const runtime=createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[
    {id:"alakazam",name:"Alakazam",properties:{inventory:{items:[{id:"potion",quantity:1,effect:"heal"}]}}}
  ],rules:[{id:"poison-collision",trigger:"tick",actions:[{
    kind:"ADD_ITEM",subject:"alakazam",path:"inventory.items",id:"potion",quantity:1,metadata:{effect:"poison"}
  }]}]}});
  assert.throws(()=>runtime.tick(),/HAKODAN_ITEM_STACK_INCOMPATIBLE/);
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[{id:"potion",quantity:1,effect:"heal"}]);
  assert.deepEqual(runtime.changes,[]);
});
