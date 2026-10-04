import test from "node:test";
import assert from "node:assert/strict";
import { canonicalItemMetadata, itemStacksCompatible, addItem, transferItem } from "../src/item-stack-state.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-18 canonical metadata ignores quantity and property insertion order",()=>{
  const a={id:"potion",quantity:2,effect:"heal",meta:{tier:1,tags:["holy","red"]}};
  const b={meta:{tags:["holy","red"],tier:1},effect:"heal",quantity:9,id:"potion"};
  assert.deepEqual(canonicalItemMetadata(a),canonicalItemMetadata(b));
  assert.equal(itemStacksCompatible(a,b),true);
});

test("V2-18 incompatible same-id metadata is explicit",()=>{
  const a={id:"potion",quantity:2,effect:"heal"};
  const b={id:"potion",quantity:1,effect:"poison"};
  assert.equal(itemStacksCompatible(a,b),false);
});

test("V2-18 compatible transfer merges quantities",()=>{
  const chest={inventory:{items:[{id:"potion",quantity:5,effect:"heal"}]}};
  const alakazam={inventory:{items:[{id:"potion",quantity:1,effect:"heal"}]}};
  transferItem(chest,"inventory.items",alakazam,"inventory.items","potion",2);
  assert.deepEqual(chest.inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.deepEqual(alakazam.inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
});

test("V2-18 incompatible transfer is atomic",()=>{
  const chest={inventory:{items:[{id:"potion",quantity:5,effect:"heal"}]}};
  const alakazam={inventory:{items:[{id:"potion",quantity:1,effect:"poison"}]}};
  assert.throws(()=>transferItem(chest,"inventory.items",alakazam,"inventory.items","potion",2),/HAKODAN_ITEM_STACK_INCOMPATIBLE/);
  assert.deepEqual(chest.inventory.items,[{id:"potion",quantity:5,effect:"heal"}]);
  assert.deepEqual(alakazam.inventory.items,[{id:"potion",quantity:1,effect:"poison"}]);
});

test("V2-18 ADD_ITEM validates supplied metadata against existing stack",()=>{
  const s={inventory:{items:[{id:"potion",quantity:1,effect:"heal"}]}};
  addItem(s,"inventory.items","potion",2,{effect:"heal"});
  assert.deepEqual(s.inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.throws(()=>addItem(s,"inventory.items","potion",1,{effect:"poison"}),/HAKODAN_ITEM_STACK_INCOMPATIBLE/);
  assert.deepEqual(s.inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
});

test("V2-18 rejects unsupported metadata values",()=>{
  const s={inventory:{items:[]}};
  assert.throws(()=>addItem(s,"inventory.items","potion",1,{effect:()=>"heal"}),/HAKODAN_ITEM_METADATA_INVALID/);
});

function runtime(targetEffect) {
  return createWorldRuntime({ir:"HNK-IR",version:"0.2.0",world:{entities:[
    {id:"chest",name:"Abra's Island Chest",properties:{inventory:{items:[{id:"potion",quantity:5,effect:"heal"}]}}},
    {id:"alakazam",name:"Alakazam",properties:{inventory:{items:[{id:"potion",quantity:1,effect:targetEffect}]}}}
  ],rules:[{id:"merge-potion",trigger:"tick",condition:{kind:"HAS_ITEM",subject:"chest",path:"inventory.items",id:"potion",minimum:2},actions:[{kind:"TRANSFER_ITEM",subject:"chest",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",id:"potion",quantity:2}]}]}});
}

test("V2-18 world runtime compatible merge emits deterministic evidence",()=>{
  const r=runtime("heal"); const [e]=r.tick();
  assert.deepEqual(r.entity("chest").inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.deepEqual(r.entity("alakazam").inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.equal(e.action,"TRANSFER_ITEM");
  assert.deepEqual(e.targetState.after,[{id:"potion",quantity:3,effect:"heal"}]);
});

test("V2-18 world runtime incompatible merge emits no evidence",()=>{
  const r=runtime("poison");
  assert.throws(()=>r.tick(),/HAKODAN_ITEM_STACK_INCOMPATIBLE/);
  assert.deepEqual(r.entity("chest").inventory.items,[{id:"potion",quantity:5,effect:"heal"}]);
  assert.deepEqual(r.entity("alakazam").inventory.items,[{id:"potion",quantity:1,effect:"poison"}]);
  assert.deepEqual(r.changes,[]);
});
