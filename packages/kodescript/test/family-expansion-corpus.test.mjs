import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { generateFamilyExpansionCorpusV1 } from '../src/family-expansion-corpus.mjs';

const artifactUrl = new URL('../../../data/acquisition/hnk-family-expansion-corpus.v1.json', import.meta.url);
const artifact = JSON.parse(await readFile(artifactUrl,'utf8'));

test('checked-in Family Expansion Corpus V1 is deterministic regeneration', () => {
  assert.deepEqual(generateFamilyExpansionCorpusV1(), artifact);
});

test('corpus is exactly 72 train + 24 holdout with zero coarse leakage', () => {
  assert.equal(artifact.summary.train,72);
  assert.equal(artifact.summary.holdout,24);
  assert.equal(artifact.summary.total,96);
  assert.equal(artifact.summary.trainHoldoutCoarseOverlap,0);
  const trainCoarse=new Set(artifact.train.map(r=>r.familyKeys.coarse));
  const holdoutCoarse=new Set(artifact.holdout.map(r=>r.familyKeys.coarse));
  for(const key of holdoutCoarse) assert.equal(trainCoarse.has(key),false,key);
});

test('every corpus record is a simple N12 structural-only form', () => {
  const all=[...artifact.train,...artifact.holdout];
  assert.equal(new Set(all.map(r=>r.identityId)).size,96);
  for(const r of all){
    assert.equal(r.path.length,12,r.identityId);
    assert.equal(new Set(r.path).size,12,r.identityId);
    assert.equal(r.authority,'STRUCTURAL_ONLY');
    assert.equal(r.semanticBinding,null);
  }
});

test('holdout contains 23 unseen MF+CG coarse families plus CR:D', () => {
  assert.equal(artifact.holdout.filter(r=>r.component==='MF_CG').length,23);
  assert.equal(artifact.holdout.filter(r=>r.component==='CR_D').length,1);
  assert.ok(artifact.holdout.some(r=>r.familyKeys.coarse==='CR_D|N:0-0-12|E:0-0-0-0-11'));
});

test('HNK40 Genesis coarse family is excluded from expansion corpus', () => {
  const genesis='MF_CG|N:12-0-0|E:7-4-0-0-0';
  const all=[...artifact.train,...artifact.holdout];
  assert.equal(all.some(r=>r.familyKeys.coarse===genesis),false);
});
