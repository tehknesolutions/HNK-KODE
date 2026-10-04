import test from "node:test";
import assert from "node:assert/strict";
import { createWorldRuntime } from "../src/world-runtime.mjs";

function ir(actions, condition = { kind:"HAS_ITEM", subject:"chest", path:"inventory.items", id:"potion", minimum:2 }) {
  return { ir:"HNK-IR", version:"0.2.0", world:{ entities:[
    { id:"chest", name:"Abra's Island Chest", properties:{ inventory:{ items:[{ id:"potion", quantity:5, effect:"heal" }] } } },
    { id:"alakazam", name:"Alakazam", properties:{ inventory:{ items:[] } } }
  ], rules:[{ id:"abra-loot", trigger:"tick", condition, actions }] } };
}

test("V2-17 world runtime transfers stack quantity and emits deterministic evidence",()=>{
  const runtime=createWorldRuntime(ir([{kind:"TRANSFER_ITEM",subject:"chest",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",id:"potion",quantity:2}]));
  const evidence=runtime.tick();
  assert.deepEqual(runtime.entity("chest").inventory.items,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[{id:"potion",quantity:2,effect:"heal"}]);
  assert.equal(evidence.length,1);
  assert.equal(evidence[0].ruleId,"abra-loot");
  assert.equal(evidence[0].action,"TRANSFER_ITEM");
  assert.equal(evidence[0].id,"potion");
  assert.equal(evidence[0].quantity,2);
  assert.deepEqual(evidence[0].source.before,[{id:"potion",quantity:5,effect:"heal"}]);
  assert.deepEqual(evidence[0].source.after,[{id:"potion",quantity:3,effect:"heal"}]);
  assert.deepEqual(evidence[0].targetState.before,[]);
  assert.deepEqual(evidence[0].targetState.after,[{id:"potion",quantity:2,effect:"heal"}]);
  assert.deepEqual(runtime.changes,evidence);
});

test("V2-17 HAS_ITEM gates world-runtime actions by minimum quantity",()=>{
  const runtime=createWorldRuntime(ir([{kind:"TRANSFER_ITEM",subject:"chest",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",id:"potion",quantity:2}],{kind:"HAS_ITEM",subject:"chest",path:"inventory.items",id:"potion",minimum:6}));
  assert.deepEqual(runtime.tick(),[]);
  assert.deepEqual(runtime.entity("chest").inventory.items,[{id:"potion",quantity:5,effect:"heal"}]);
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[]);
});

test("V2-17 ITEM_COUNT participates in canonical condition execution",()=>{
  const runtime=createWorldRuntime(ir([{kind:"ADD_ITEM",subject:"alakazam",path:"inventory.items",id:"gem",quantity:1}],{kind:"ITEM_COUNT",subject:"chest",path:"inventory.items",id:"potion",count:5}));
  const [evidence]=runtime.tick();
  assert.equal(evidence.action,"ADD_ITEM");
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[{id:"gem",quantity:1}]);
});

test("V2-17 runtime failed transfer is atomic and emits no evidence",()=>{
  const runtime=createWorldRuntime(ir([{kind:"TRANSFER_ITEM",subject:"chest",path:"inventory.items",target:"alakazam",targetPath:"inventory.items",id:"potion",quantity:6}],{kind:"HAS_ITEM",subject:"chest",path:"inventory.items",id:"potion",minimum:1}));
  assert.throws(()=>runtime.tick(),/HAKODAN_ITEM_INSUFFICIENT_QUANTITY/);
  assert.deepEqual(runtime.entity("chest").inventory.items,[{id:"potion",quantity:5,effect:"heal"}]);
  assert.deepEqual(runtime.entity("alakazam").inventory.items,[]);
  assert.deepEqual(runtime.changes,[]);
});
