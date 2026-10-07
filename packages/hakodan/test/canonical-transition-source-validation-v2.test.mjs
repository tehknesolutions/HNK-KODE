import test from "node:test";
import assert from "node:assert/strict";
import {stepCanonicalInteraction} from "../src/canonical-interaction-step.mjs";
import {toCanonicalPortalTransition} from "../src/canonical-transition-resolution.mjs";
const intent={actorId:"alakazam",interaction:"enter",targetId:"portal-1"};
const world=()=>({worldRevision:3,actor:{id:"alakazam",x:3,y:0},portal:{id:"portal-1",state:"open",x:5,y:0},threshold:2});
test("source exact-key validation rejects destination and metadata",()=>{
 const r=stepCanonicalInteraction(world(),intent);
 const {transition,transitionRevision,...base}=r;
 for(const value of [{...base,destinationId:"invented"},{...base,actor:{...base.actor,secret:"x"}},{...base,interaction:{...base.interaction,extra:true}},{...base,targetEnvelope:{revision:4}}]){
  assert.throws(()=>toCanonicalPortalTransition(value),/HAKODAN_CANONICAL_TRANSITION_INVALID/);
 }
});
test("source exact-key validation does not evaluate unrelated accessors",()=>{
 const r=stepCanonicalInteraction(world(),intent);
 const {transition,transitionRevision,...base}=r;
 let reads=0;
 Object.defineProperty(base,"destinationId",{enumerable:true,get(){reads++;throw Error("UNSAFE");}});
 assert.throws(()=>toCanonicalPortalTransition(base),/HAKODAN_CANONICAL_TRANSITION_INVALID/);
 assert.equal(reads,0);
});
