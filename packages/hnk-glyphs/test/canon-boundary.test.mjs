import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GLYPH_ENGINE_HNK_CANON,
  queryGlyphHnkCanon,
  validateGlyphHnkCanon,
} from '../src/canon.mjs';

test('glyph canon adapter consumes the local recovered canon contract read-only', () => {
  const validation = validateGlyphHnkCanon();
  assert.equal(validation.ok, true, validation.issues.join('; '));
  assert.equal(GLYPH_ENGINE_HNK_CANON.consumer_id, '@hnk/glyphs');
  assert.equal(GLYPH_ENGINE_HNK_CANON.access, 'READ_ONLY');
  assert.equal(GLYPH_ENGINE_HNK_CANON.records.length, 22);
});

test('glyph canon query exposes promoted glyph architecture without inventing lexemes', () => {
  const entries = queryGlyphHnkCanon({ kind: 'GLYPH_ARCHITECTURE' });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].canon.canon_item_id, 'HNK-CANON-R001-056');
  assert.equal(entries[0].human_gate.outcome, 'PROMOTE_TO_HNK_CANON');
});
