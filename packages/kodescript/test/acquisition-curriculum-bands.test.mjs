import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const bandsUrl = new URL('../../../data/acquisition/hnk40-acquisition-curriculum-bands.v1.json', import.meta.url);
const bands = JSON.parse(await readFile(bandsUrl,'utf8'));

test('HNK40 acquisition bands partition all 40 glyph identities', () => {
  assert.deepEqual(bands.counts, {
    CORE_OBSERVED:21,
    EXPANSION_RESOLVED:17,
    AMBIGUOUS_HOLDOUT:2,
    BLOCKED:0
  });
  const all = Object.values(bands.bands).flat();
  assert.equal(all.length,40);
  assert.equal(new Set(all).size,40);
});

test('G17 and G20 are held out instead of force-resolved', () => {
  assert.deepEqual(bands.bands.AMBIGUOUS_HOLDOUT,['G17','G20']);
  assert.equal(bands.semanticsAssigned,0);
});

test('core band is evidence-based on recovered lexical observation', () => {
  assert.ok(bands.rules.CORE_OBSERVED.includes('observed in recovered master lexicon'));
  assert.equal(bands.bands.CORE_OBSERVED.length,21);
});
