import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertMoraKodinBatch, MORA_KODIN_V04 } from "../src/mora-kodin-v0.4.mjs";

const data=JSON.parse(await readFile(new URL("../../../data/lexicon/haKodan-mora-kodin-candidates-v0.4.json",import.meta.url),"utf8"));

test("Mora-Kodin v0.4 batch has 122 concepts and 366 unique discovery candidates",()=>{
  assert.equal(assertMoraKodinBatch(data),true);
  assert.equal(data.concepts,122);
  assert.equal(data.candidates,366);
});

test("Mora-Kodin v0.4 never promotes canon automatically",()=>{
  assert.equal(data.canonPromotions,0);
  assert.ok(data.items.every(x=>x.status==="DISCOVERY_CANDIDATE" && x.canon===false));
});

test("five canonical HNK lexemes are frozen outside regeneration",()=>{
  const prior=new Set(data.items.map(x=>x.previousProvisional));
  for(const word of MORA_KODIN_V04.canonicalFrozen) assert.equal(prior.has(word),false,word);
});

test("every concept contains A/B/C candidates and a selected discovery shortlist",()=>{
  for(const item of data.items){
    assert.deepEqual(new Set(item.candidates.map(x=>x.variant)),new Set(["A","B","C"]));
    assert.ok(item.candidates.some(x=>x.form===item.shortlist));
  }
});
