import test from "node:test";
import assert from "node:assert/strict";
import { createStudioSession } from "../src/studio-session-v1.mjs";
const pt=`mundo AbraIsland { entidade Alakazam { propriedade vida = 100 } evento Despertar { ação despertar("Alakazam") } }`;
const en=`world AbraIsland { entity Alakazam { property vida = 100 } event Despertar { action despertar("Alakazam") } }`;
test("session validates and runs canonical source",()=>{const s=createStudioSession({source:pt,profile:"PT-BR"});assert.equal(s.state.status,"IDLE");assert.equal(s.validate().status,"VALID");const r=s.run();assert.equal(r.status,"ARTIFACT_GENERATED");assert.equal(r.artifact.executionEvidence,"UNVERIFIED");});
test("profile switching uses canonical profile",()=>{const s=createStudioSession({source:pt,profile:"PT-BR"});const a=s.run().artifact.content;s.setSource(en);s.setProfile("EN");assert.equal(s.run().artifact.content,a);});
test("failure clears stale artifact and exposes plain diagnostic",()=>{const s=createStudioSession({source:pt,profile:"PT-BR"});s.run();s.setSource("mundo Broken {}");const r=s.validate();assert.equal(r.status,"INVALID");assert.equal(r.artifact,null);assert.match(r.diagnostic,/HAKODAN_/);assert.throws(()=>s.run());assert.equal(s.state.artifact,null);});
