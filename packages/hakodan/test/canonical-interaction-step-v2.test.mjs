import test from "node:test";
import assert from "node:assert/strict";
import {stepCanonicalInteraction} from "../src/canonical-interaction-step.mjs";
const intent={actorId:"alakazam",interaction:"enter",targetId:"portal-1"};
const eligible=()=>({worldRevision:3,actor:{id:"alakazam",x:3,y:0},portal:{id:"portal-1",state:"open",x:5,y:0},threshold:2});
test("accepted interaction advances and aligns revisions",()=>{const r=stepCanonicalInteraction(eligible(),intent);assert.equal(r.accepted,true);assert.equal(r.interactionRevision,4);assert.equal(r.worldRevision,4);assert.equal(r.targetEnvelope.revision,4);assert.equal(r.targetEnvelope.snapshot.state,"open");});
test("rejected interaction is atomic and has no target transition",()=>{const w={...eligible(),actor:{id:"alakazam",x:0,y:0}};const r=stepCanonicalInteraction(w,intent);assert.equal(r.accepted,false);assert.equal(r.worldRevision,3);assert.equal(r.interactionRevision,3);assert.equal(r.targetEnvelope,undefined);});
test("target-safe accepted output does not leak derivation fields",()=>{const r=stepCanonicalInteraction(eligible(),intent);const json=JSON.stringify(r);for(const key of ["threshold","distance","formula","proximity","destination","callback"])assert.equal(json.includes(`"${key}"`),false);});
