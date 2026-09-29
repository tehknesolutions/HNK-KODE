import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertPhonologicalGate } from "../src/mora-kodin-v0.7.mjs";
const data=JSON.parse(await readFile(new URL("../../../data/lexicon/haKodan-mora-kodin-phonological-v0.7.json",import.meta.url),"utf8"));
test("v0.7 preserves 122 unique non-canon selections",()=>assert.equal(assertPhonologicalGate(data),true));
test("v0.7 reduces or preserves high cross-family confusion",()=>{
 assert.ok(data.after.c75<=data.before.c75);
 assert.ok(data.after.c67<=data.before.c67);
});
test("v0.7 never promotes lexical canon",()=>assert.equal(data.canonPromotions,0));
