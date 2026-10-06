import test from "node:test";
import assert from "node:assert/strict";
import {readMovementIntent} from "../src/movement-intent.mjs";

for(const direction of ["left","right","up","down"]){test(`accepts ${direction}`,()=>assert.deepEqual(readMovementIntent({actorId:"alakazam",direction},"alakazam"),{actorId:"alakazam",direction}));}
test("rejects malformed or unsupported intents",()=>{for(const value of [null,[],{}, {actorId:"other",direction:"right"},{actorId:"alakazam",direction:"jump"},{actorId:"alakazam",direction:"right",extra:true}]) assert.throws(()=>readMovementIntent(value,"alakazam"),/HAKODAN_MOVEMENT_INTENT_INVALID/);});
test("rejects extra accessor without evaluating it",()=>{let touched=0;const value={actorId:"alakazam",direction:"right"};Object.defineProperty(value,"callback",{enumerable:true,get(){touched++;throw new Error("EXECUTED");}});assert.throws(()=>readMovementIntent(value,"alakazam"),/HAKODAN_MOVEMENT_INTENT_INVALID/);assert.equal(touched,0);});
test("does not mutate caller input",()=>{const value={actorId:"alakazam",direction:"right"};const before=structuredClone(value);readMovementIntent(value,"alakazam");assert.deepEqual(value,before);});
