import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { structuralConfusionDistance, buildConfusionNeighborhoods, buildContrastPairs } from '../src/confusion-neighborhood.mjs';

const url=new URL('../../../data/acquisition/hnk-family-expansion-corpus.v1.json',import.meta.url);
const corpus=JSON.parse(await readFile(url,'utf8'));
const records=[...corpus.train,...corpus.holdout];

test('structural confusion distance is symmetric and zero for self',()=>{
  const a=records[0],b=records[1];
  assert.equal(structuralConfusionDistance(a,a).total,0);
  assert.deepEqual(structuralConfusionDistance(a,b),structuralConfusionDistance(b,a));
});

test('every expansion representative gets three deterministic neighbors',()=>{
  const rows=buildConfusionNeighborhoods(records,{neighbors:3});
  assert.equal(rows.length,96);
  for(const row of rows){
    assert.equal(row.neighbors.length,3,row.identityId);
    assert.equal(row.neighbors.some(n=>n.identityId===row.identityId),false);
    assert.ok(row.neighbors[0].distance.total<=row.neighbors[1].distance.total);
  }
});

test('contrast pair generator returns 32 unique nearest structural pairs',()=>{
  const pairs=buildContrastPairs(records,{count:32});
  assert.equal(pairs.length,32);
  assert.equal(new Set(pairs.map(p=>`${p.a}|${p.b}`)).size,32);
  assert.ok(pairs.every(p=>p.distance.total>=0));
});

test('confusion metric remains structural-only',()=>{
  const pairs=buildContrastPairs(records,{count:32});
  assert.equal(pairs.some(p=>'semanticBinding' in p),false);
});

test('materialized FEC V1 contrast registry matches deterministic generator',async()=>{
  const registryUrl=new URL('../../../data/acquisition/hnk-family-expansion-contrasts.v1.json',import.meta.url);
  const registry=JSON.parse(await readFile(registryUrl,'utf8'));
  const expected=buildContrastPairs(records,{count:32});
  assert.equal(registry.version,'1.0.0');
  assert.equal(registry.kind,'HNK_FAMILY_EXPANSION_CONTRAST_REGISTRY');
  assert.equal(registry.pairCount,32);
  assert.deepEqual(registry.pairs,expected);
  assert.equal(registry.semanticBindings,0);
});
