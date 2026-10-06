import test from "node:test";
import assert from "node:assert/strict";
import {applyCanonicalPortalEntry} from "../src/canonical-portal-entry.mjs";
const intent={actorId:"alakazam",interaction:"enter",targetId:"portal-1"};
const world=()=>({worldRevision:3,actor:{id:"alakazam",x:3,y:0},portal:{id:"portal-1",state:"open",x:5,y:0},threshold:2});
test("accepts eligible entry without changing actor coordinates",()=>{const result=applyCanonicalPortalEntry(world(),intent);assert.equal(result.accepted,true);assert.equal(result.actor.id,"alakazam");assert.deepEqual(result.actor,{id:"alakazam",x:3,y:0});assert.equal(result.targetId,"portal-1");assert.equal(result.worldRevision,4);});
test("rejects wrong target atomically",()=>{const w=world(),before=structuredClone(w);assert.throws(()=>applyCanonicalPortalEntry(w,{...intent,targetId:"portal-2"}),/HAKODAN_INTERACTION_INTENT_INVALID/);assert.deepEqual(w,before);});
test("rejects ineligible entry without revision or mutation",()=>{const w={...world(),actor:{id:"alakazam",x:0,y:0}};const result=applyCanonicalPortalEntry(w,intent);assert.equal(result.accepted,false);assert.equal(result.worldRevision,3);assert.equal(result.reason,"ineligible");assert.deepEqual(w,{...w});});
