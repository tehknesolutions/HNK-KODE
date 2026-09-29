import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { exactSharedCoverageFrontier } from '../src/acquisition-frequency-frontier.mjs';

const coverageUrl = new URL('../../../data/acquisition/hnk-language-math-family-coverage.v1.json', import.meta.url);
const coverage = JSON.parse(await readFile(coverageUrl, 'utf8'));

test('exact frontier preserves canonical 80/90/95 results within regression budget', () => {
  const started = performance.now();
  const out = exactSharedCoverageFrontier(
    coverage.masterLexicon,
    coverage.authoredCandidates,
    [0.8, 0.9, 0.95],
  );
  const elapsedMs = performance.now() - started;

  assert.deepEqual(out.map(x => [x.threshold, x.minGlyphCount, x.solutionCount]), [
    [0.8, 14, 700],
    [0.9, 16, 1],
    [0.95, 18, 7],
  ]);
  assert.ok(elapsedMs < 2500, `exact frontier took ${elapsedMs.toFixed(0)}ms`);
});
