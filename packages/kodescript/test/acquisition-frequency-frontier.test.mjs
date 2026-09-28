import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { exactSharedCoverageFrontier } from '../src/acquisition-frequency-frontier.mjs';

const coverageUrl = new URL('../../../data/acquisition/hnk-language-math-family-coverage.v1.json', import.meta.url);
const coverage = JSON.parse(await readFile(coverageUrl,'utf8'));

test('exact frontier reproduces 80/90/95 percent minima', () => {
  const out = exactSharedCoverageFrontier(
    coverage.masterLexicon,
    coverage.authoredCandidates,
    [0.8,0.9,0.95]
  );
  assert.deepEqual(out.map(x=>[x.threshold,x.minGlyphCount,x.solutionCount]),[
    [0.8,14,700],
    [0.9,16,1],
    [0.95,18,7],
  ]);
});

test('90 percent frontier has one unique minimal 16-glyph set', () => {
  const [out] = exactSharedCoverageFrontier(
    coverage.masterLexicon,
    coverage.authoredCandidates,
    [0.9]
  );
  assert.equal(out.uniqueMinimal,true);
  assert.deepEqual(out.representative.glyphIds,[
    'G01','G02','G03','G04','G05','G11','G12','G14',
    'G15','G18','G19','G21','G23','G31','G32','G40'
  ]);
  assert.ok(out.representative.corpusACoverage >= 0.9);
  assert.ok(out.representative.corpusBCoverage >= 0.9);
});

test('frequency optimization is analytical only', () => {
  const [out] = exactSharedCoverageFrontier(
    coverage.masterLexicon,
    coverage.authoredCandidates,
    [0.9]
  );
  assert.equal(out.representative.glyphIds.includes('G17'),false);
  assert.equal(out.representative.glyphIds.includes('G20'),false);
});
