import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertCompactMoraGate, MORA_KODIN_V05 } from "../src/mora-kodin-v0.5.mjs";
const data=JSON.parse(await readFile(new URL("../../../data/lexicon/haKodan-mora-kodin-compact-v0.5.json",import.meta.url),"utf8"));

test("v0.5 contains 122 unique discovery winners",()=>{assert.equal(assertCompactMoraGate(data),true);});
test("v0.5 never regenerates canonical lexemes",()=>{
  const forms=new Set(data.items.flatMap(x=>x.candidates.map(c=>c.form)));
  for(const x of MORA_KODIN_V05.canonicalFrozen) assert.equal(forms.has(x),false,x);
});
test("v0.5 compact gate improves average winner length",()=>{
  assert.ok(data.metrics.averageWinnerLength < data.metrics.previousAverageWinnerLength);
});
test("all winners remain non-canon until Creator Gate",()=>{
  assert.ok(data.items.every(x=>x.status==="DISCOVERY_CANDIDATE"&&x.canon===false));
});
