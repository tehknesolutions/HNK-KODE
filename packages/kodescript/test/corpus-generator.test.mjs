import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFrozenGraph, enumerateSimplePaths, generateAcquisitionCorpus } from '../src/corpus-generator.mjs';

test('frozen graph exposes the expected current N12 nodes only', () => {
  const graph=buildFrozenGraph();
  assert.equal(graph.size,453); // 432 MF + 9 CG + 12 CR:D; CR:T/H excluded from N12 corpus
  assert.ok(graph.has('MF:L01:S01'));
  assert.ok(graph.has('CG:09'));
  assert.ok(graph.has('CR:D:12'));
  assert.equal(graph.has('CR:H:01'),false);
});

test('enumerator yields valid unique reversal-normalized N12 simple paths', () => {
  const graph=buildFrozenGraph();
  const paths=enumerateSimplePaths({graph,starts:['MF:L01:S01'],maxPaths:64});
  assert.equal(paths.length,64);
  for(const p of paths){ assert.equal(p.length,12); assert.equal(new Set(p).size,12); }
  const keys=new Set(paths.map(p=>{const a=p.join('>'),b=[...p].reverse().join('>');return a<=b?a:b;}));
  assert.equal(keys.size,paths.length);
});

test('corpus generation is deterministic and keeps held-out separate', () => {
  const paths=enumerateSimplePaths({starts:['MF:L01:S01','MF:L03:S17','MF:L06:S65','CR:D:01'],maxPaths:256});
  const a=generateAcquisitionCorpus({paths,seed:'TEST-SEED',heldOutRatio:0.25});
  const b=generateAcquisitionCorpus({paths,seed:'TEST-SEED',heldOutRatio:0.25});
  assert.deepEqual(a.counts,b.counts);
  assert.deepEqual(a.training,b.training);
  assert.deepEqual(a.heldOut,b.heldOut);
  assert.equal(a.authority,'STRUCTURAL_ONLY');
  const train=new Set(a.training);
  for(const id of a.heldOut) assert.equal(train.has(id),false);
});

test('HNK40 benchmark mapping is never invented', () => {
  const paths=enumerateSimplePaths({starts:['CR:D:01'],maxPaths:1});
  const corpus=generateAcquisitionCorpus({paths});
  assert.deepEqual(corpus.benchmark.requestedIdentityIds,[]);
  assert.match(corpus.benchmark.note,/never fabricated/);
});
