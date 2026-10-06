import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePortalProximityState } from "../src/portal-proximity-state.mjs";

const base={
 portal:{id:"portal-1",state:"closed",x:3,y:4},
 actor:{id:"alakazam",x:0,y:0},
 threshold:5
};

test("V2-29 portal opens when Alakazam is inside the canonical proximity threshold",()=>{
 const result=evaluatePortalProximityState(base);
 assert.equal(result.portal.state,"open");
 assert.equal(result.transition.from,"closed");
 assert.equal(result.transition.to,"open");
 assert.equal(result.evidence.distance,5);
 assert.equal(result.evidence.threshold,5);
 assert.equal(result.evidence.proximity,true);
});

test("V2-29 portal remains closed outside the canonical proximity threshold",()=>{
 const result=evaluatePortalProximityState({...base,threshold:4});
 assert.equal(result.portal.state,"closed");
 assert.equal(result.transition,null);
 assert.equal(result.evidence.proximity,false);
});

test("V2-29 portal opening is idempotent once already open",()=>{
 const result=evaluatePortalProximityState({...base,portal:{...base.portal,state:"open"}});
 assert.equal(result.portal.state,"open");
 assert.equal(result.transition,null);
 assert.equal(result.evidence.proximity,true);
});

test("V2-29 state transition is immutable and does not mutate caller-owned objects",()=>{
 const input=structuredClone(base);
 const before=structuredClone(input);
 const result=evaluatePortalProximityState(input);
 assert.deepEqual(input,before);
 assert.notEqual(result.portal,input.portal);
 assert.equal(result.portal.state,"open");
});

test("V2-29 rejects invalid portal state or threshold canonically",()=>{
 assert.throws(()=>evaluatePortalProximityState({...base,portal:{...base.portal,state:"broken"}}),/HAKODAN_PORTAL_PROXIMITY_INVALID/);
 assert.throws(()=>evaluatePortalProximityState({...base,threshold:-1}),/HAKODAN_PORTAL_PROXIMITY_INVALID/);
});
