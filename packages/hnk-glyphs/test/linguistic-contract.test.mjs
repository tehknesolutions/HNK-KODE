import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HNK40_STATUS,
  HNK40_GLYPH_IDS,
  HNK40_IPA,
  getGlyph,
  transliterationToGlyphIds,
} from '../src/index.mjs';

test('minimal glyph contract exposes 40 stable G-IDs and IPA bindings', () => {
  assert.equal(HNK40_STATUS, 'PREPRODUCTION_NOT_OFFICIAL');
  assert.equal(HNK40_GLYPH_IDS.length, 40);
  assert.equal(HNK40_IPA.length, 40);
  assert.equal(getGlyph('G01').phonemeIpa, '/a/');
  assert.equal(getGlyph('G40').phonemeIpa, '/y/');
});

test('safe transliteration contract preserves TS as atomic G30', () => {
  assert.deepEqual(
    transliterationToGlyphIds('PITSA', { strict:true }).glyphIds,
    ['G21','G03','G30','G01'],
  );
});

test('minimal linguistic compatibility surface does not expose renderer or sprite authority', async () => {
  const glyphs = await import('../src/index.mjs');
  assert.equal('HNK40_SPRITE_SVG' in glyphs, false);
  assert.equal('getGlyphSvg' in glyphs, false);
  assert.equal('getSpriteUseSvg' in glyphs, false);
});
