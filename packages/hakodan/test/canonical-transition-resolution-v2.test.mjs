import test from "node:test";
import assert from "node:assert/strict";
import {stepCanonicalInteraction} from "../src/canonical-interaction-step.mjs";

const intent={actorId:"alakazam",interaction:"enter",targetId:"portal-1"};
const eligible=()=>({worldRevision:3,actor:{id:"alakazam",x:3,y:0},portal:{id:"portal-1",state:"open",x:5,y:0},threshold:2});

test("accepted portal entry emits exact atomic V2-33 transition",()=>{
 const r=stepCanonicalInteraction(eligible(),intent);
 assert.deepEqual(Object.keys(r.transition).sort(),["actorId","kind","occurred","targetId","transitionRevision"]);
 assert.deepEqual(r.transition,{occurred:true,kind:"portal-entry",actorId:"alakazam",targetId:"portal-1",transitionRevision:4});
 assert.equal(r.interactionRevision,r.transitionRevision);
 assert.equal(r.transitionRevision,r.worldRevision);
 assert.equal(r.worldRevision,r.targetEnvelope.revision);
});

test("rejected interaction emits no transition and does not advance revision",()=>{
 const r=stepCanonicalInteraction({...eligible(),actor:{id:"alakazam",x:0,y:0}},intent);
 assert.equal(r.accepted,false);
 assert.equal(r.worldRevision,3);
 assert.equal("transition" in r,false);
 assert.equal("transitionRevision" in r,false);
});

test("accepted public result contains no destination-like authority",()=>{
 const r=stepCanonicalInteraction(eligible(),intent);
 const json=JSON.stringify(r);
 for(const key of ["destination","destinationId","worldId","sceneId","route","callback","spawn","teleport"])assert.equal(json.includes(`"${key}"`),false);
});

test("transition projection does not expose unrelated actor metadata",()=>{
 const w=eligible();
 w.actor.secret="hidden";
 const r=stepCanonicalInteraction(w,intent);
 assert.deepEqual(r.transition,{occurred:true,kind:"portal-entry",actorId:"alakazam",targetId:"portal-1",transitionRevision:4});
 assert.equal("secret" in r.transition,false);
});
