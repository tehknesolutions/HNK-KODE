import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertRootFamilyGate, MORA_KODIN_V06 } from "../src/mora-kodin-v0.6.mjs";
const data=JSON.parse(await readFile(new URL("../../../data/lexicon/haKodan-mora-kodin-root-families-v0.6.json",import.meta.url),"utf8"));

test("v0.6 assigns all 122 provisional concepts to 26 root families",()=>{
  assert.equal(assertRootFamilyGate(data),true);
  assert.equal(new Set(data.items.map(x=>x.semanticId)).size,122);
});
test("v0.6 produces exactly three discovery candidates per concept",()=>{
  assert.equal(data.items.flatMap(x=>x.candidates).length,366);
});
test("v0.6 root families do not promote lexical canon",()=>{
  assert.equal(data.canonPromotions,0);
  assert.ok(data.items.every(x=>x.canon===false&&x.status==="DISCOVERY_CANDIDATE"));
});
test("v0.6 family hypotheses are explicit and unique",()=>{
  assert.equal(data.familyHypotheses.length,26);
  assert.equal(new Set(data.familyHypotheses.map(x=>x.root)).size,26);
});
