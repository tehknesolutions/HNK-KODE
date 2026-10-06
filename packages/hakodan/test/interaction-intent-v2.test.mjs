import test from "node:test";
import assert from "node:assert/strict";
import {readInteractionIntent} from "../src/interaction-intent.mjs";

const valid={actorId:"alakazam",interaction:"enter",targetId:"portal-1"};

test("accepts the exact portal entry intent",()=>assert.deepEqual(readInteractionIntent(valid,"alakazam","portal-1"),valid));
test("rejects non-string actor identities",()=>{assert.throws(()=>readInteractionIntent({...valid,actorId:42},"alakazam","portal-1"),/HAKODAN_INTERACTION_INTENT_INVALID/);assert.throws(()=>readInteractionIntent({...valid,actorId:""},"","portal-1"),/HAKODAN_INTERACTION_INTENT_INVALID/);});
test("rejects malformed, wrong actor, wrong target, unsupported interaction and extras",()=>{
 for(const value of [null,[],{}, {...valid,actorId:"other"}, {...valid,targetId:"portal-2"}, {...valid,interaction:"exit"}, {...valid,extra:true}])
  assert.throws(()=>readInteractionIntent(value,"alakazam","portal-1"),/HAKODAN_INTERACTION_INTENT_INVALID/);
});
test("rejects accessor-bearing extras without evaluating them",()=>{
 let touched=0;const value={...valid};Object.defineProperty(value,"callback",{enumerable:true,get(){touched++;throw new Error("EXECUTED");}});
 assert.throws(()=>readInteractionIntent(value,"alakazam","portal-1"),/HAKODAN_INTERACTION_INTENT_INVALID/);assert.equal(touched,0);
});
test("does not mutate caller input",()=>{const value={...valid};const before=structuredClone(value);readInteractionIntent(value,"alakazam","portal-1");assert.deepEqual(value,before);});
