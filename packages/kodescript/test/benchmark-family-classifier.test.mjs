import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { classifyHybridBenchmark } from '../src/benchmark-family-classifier.mjs';

const sourceUrl = new URL('../../../data/benchmarks/hnk40-e5-hybrid-projection.v1.json', import.meta.url);
const source = JSON.parse(await readFile(sourceUrl, 'utf8'));

test('classifies all HNK40 hybrid records without collapsing ambiguity', () => {
  const out = classifyHybridBenchmark(source);
  assert.equal(out.summary.glyphRecords, 40);
  assert.equal(out.summary.projectionCandidates, 42);
  assert.equal(out.summary.direct, 4);
  assert.equal(out.summary.derivedUnique, 34);
  assert.equal(out.summary.derivedAmbiguous, 2);
  assert.equal(out.authority, 'STRUCTURAL_ONLY');
});

test('G17 and G20 keep both projection candidates', () => {
  const out = classifyHybridBenchmark(source);
  for (const glyphId of ['G17', 'G20']) {
    const record = out.records.find(r => r.glyphId === glyphId);
    assert.equal(record.resolutionStatus, 'DERIVED_AMBIGUOUS');
    assert.equal(record.preferredProjectionId, null);
    assert.equal(record.candidateCount, 2);
    assert.equal(record.candidates.length, 2);
  }
});

test('every candidate yields GFV-N12 structural family keys', () => {
  const out = classifyHybridBenchmark(source);
  for (const record of out.records) {
    for (const candidate of record.candidates) {
      const gfv = candidate.featureVector;
      assert.equal(gfv.version, 'GFV-N12-0.1');
      assert.equal(gfv.n, 12);
      assert.equal(gfv.authority, 'STRUCTURAL_ONLY');
      assert.ok(gfv.familyKeys.coarse);
      assert.ok(gfv.familyKeys.topological);
      assert.ok(gfv.familyKeys.radialAngular);
    }
  }
});
