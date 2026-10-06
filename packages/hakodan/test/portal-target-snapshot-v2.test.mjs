import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePortalProximityState } from "../src/portal-proximity-state.mjs";
import { toPortalTargetSnapshot } from "../src/portal-target-snapshot.mjs";

const world={portal:{id:"portal-1",state:"closed",x:3,y:4},actor:{id:"alakazam",x:0,y:0},threshold:5};

test("V2-29 exports the evaluated portal state as the minimal target snapshot",()=>{
 const evaluated=evaluatePortalProximityState(world);
 assert.deepEqual(toPortalTargetSnapshot(evaluated),{id:"portal-1",state:"open"});
});

test("V2-29 target snapshot contains no proximity authority or coordinates",()=>{
 const evaluated=evaluatePortalProximityState({...world,threshold:4});
 const snapshot=toPortalTargetSnapshot(evaluated);
 assert.deepEqual(snapshot,{id:"portal-1",state:"closed"});
 assert.equal("x" in snapshot,false);
 assert.equal("y" in snapshot,false);
 assert.equal("threshold" in snapshot,false);
 assert.equal("proximity" in snapshot,false);
});

test("V2-29 rejects malformed evaluated state at the target boundary",()=>{
 assert.throws(()=>toPortalTargetSnapshot({portal:{id:"portal-1",state:"opening"}}),/HAKODAN_PORTAL_TARGET_SNAPSHOT_INVALID/);
});
