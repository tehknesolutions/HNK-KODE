import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifestUrl = new URL('../data/math/hnk-2647892.manifest.v1.json', import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));

test('HNK-2647892 manifest locks the N=12 baseline', () => {
  assert.equal(manifest.n, 12);
  assert.equal(manifest.counts.rawWalks, 7_289_096_672);
  assert.equal(manifest.counts.simplePaths, 95_284_518);
  assert.equal(manifest.counts.reversalClasses, 47_642_259);
  assert.equal(manifest.counts.geometricClasses, 2_647_892);
  assert.equal(manifest.counts.renderDistinctClasses, 2_647_892);
});

test('reversal quotient is exact and component-preserving', () => {
  assert.equal(manifest.counts.simplePaths / 2, manifest.counts.reversalClasses);
  assert.equal(
    manifest.reversalClassesByComponent.mfCg + manifest.reversalClassesByComponent.crD,
    manifest.reversalClassesByComponent.total
  );
  assert.equal(manifest.reversalClassesByComponent.total, manifest.counts.reversalClasses);
});

test('Burnside D9 cross-check independently reproduces MF+CG quotient', () => {
  const b = manifest.burnside.mfCg;
  const numerator = b.identityFixed + manifest.burnside.mfCg.fixedReflectionTotal;
  assert.equal(b.fixedReflectionTotal, b.reflections * b.fixedPerReflection);
  assert.equal(numerator, b.burnsideNumerator);
  assert.equal(numerator / manifest.burnside.order, b.quotientClasses);
  assert.equal(b.quotientClasses, 2_647_891);
});

test('CR:D contribution closes the final total', () => {
  assert.equal(manifest.burnside.crD.inputReversalClasses, 12);
  assert.equal(manifest.burnside.crD.quotientClasses, 1);
  assert.equal(
    manifest.burnside.mfCg.quotientClasses + manifest.burnside.crDContribution,
    manifest.burnside.totalClasses
  );
  assert.equal(manifest.burnside.totalClasses, manifest.counts.geometricClasses);
});

test('language boundary forbids geometric count from becoming vocabulary automatically', () => {
  assert.equal(manifest.canonicalSemantics, false);
  assert.equal(manifest.languageBoundary.automaticWordCount, false);
  assert.equal(manifest.languageBoundary.automaticSemanticAssignment, false);
  assert.notEqual(manifest.structuralContext.activeAddresses, manifest.counts.geometricClasses);
  assert.equal(manifest.counts.renderDistinctClasses, manifest.counts.geometricClasses);
});


test('exact family census partitions the full geometric universe', () => {
  assert.deepEqual(manifest.familyCensus.cardinality, {
    coarse: 256,
    topological: 11492,
    radialAngular: 3041
  });
  assert.equal(manifest.familyCensus.eachPartitionTotal, 2647892);
  assert.equal(manifest.familyCensus.semanticsAssigned, 0);
});
