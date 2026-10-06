import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePortalProximityState } from "../src/portal-proximity-state.mjs";
import { toTargetEnvelope } from "../src/target-envelope.mjs";

const world={portal:{id:"portal-1",state:"closed",x:3,y:4},actor:{id:"alakazam",x:0,y:0},threshold:5};

test("wraps evaluated portal state in exact live v1 envelope",()=>{
 const evaluated=evaluatePortalProximityState(world);
 assert.deepEqual(toTargetEnvelope(evaluated,3),{schema:"hnk.target-envelope.v1",target:"goodle-browser",kind:"portal-state",revision:3,snapshot:{id:"portal-1",state:"open"}});
});

test("rejects invalid live revisions",()=>{
 const evaluated=evaluatePortalProximityState(world);
 for(const revision of [undefined,0,-1,1.5,Number.MAX_SAFE_INTEGER+1,"3"]){
  assert.throws(()=>toTargetEnvelope(evaluated,revision),/HAKODAN_TARGET_ENVELOPE_INVALID/);
 }
});

test("does not leak semantic inputs",()=>{
 const envelope=toTargetEnvelope(evaluatePortalProximityState(world),3);
 const json=JSON.stringify(envelope);
 for(const forbidden of ["actor","x","y","threshold","proximity","transition","distance","formula","callback"]) assert.equal(json.includes(`\"${forbidden}\"`),false);
});

test("returns fresh protocol objects",()=>{
 const evaluated=evaluatePortalProximityState(world);
 const envelope=toTargetEnvelope(evaluated,3);
 envelope.snapshot.state="closed";
 assert.equal(evaluated.portal.state,"open");
});

test("rejects malformed evaluated state",()=>{
 assert.throws(()=>toTargetEnvelope({portal:{id:"portal-1",state:"opening"}},3),/HAKODAN_TARGET_ENVELOPE_INVALID/);
});
