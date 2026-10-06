import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePortalProximityState } from "../src/portal-proximity-state.mjs";
import { toTargetEnvelope } from "../src/target-envelope.mjs";

const world={portal:{id:"portal-1",state:"closed",x:3,y:4},actor:{id:"alakazam",x:0,y:0},threshold:5};

test("wraps evaluated portal state in exact v1 envelope",()=>{
 const evaluated=evaluatePortalProximityState(world);
 assert.deepEqual(toTargetEnvelope(evaluated),{schema:"hnk.target-envelope.v1",target:"goodle-browser",kind:"portal-state",snapshot:{id:"portal-1",state:"open"}});
});

test("does not leak semantic inputs",()=>{
 const envelope=toTargetEnvelope(evaluatePortalProximityState(world));
 const json=JSON.stringify(envelope);
 for(const forbidden of ["actor","x","y","threshold","proximity","transition","distance","formula","callback"]) assert.equal(json.includes(`\"${forbidden}\"`),false);
});

test("returns fresh protocol objects",()=>{
 const evaluated=evaluatePortalProximityState(world);
 const envelope=toTargetEnvelope(evaluated);
 envelope.snapshot.state="closed";
 assert.equal(evaluated.portal.state,"open");
});

test("rejects malformed evaluated state",()=>{
 assert.throws(()=>toTargetEnvelope({portal:{id:"portal-1",state:"opening"}}),/HAKODAN_TARGET_ENVELOPE_INVALID/);
});
