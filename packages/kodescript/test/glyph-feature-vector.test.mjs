import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyEdge, extractGlyphFeatureVector } from '../src/glyph-feature-vector.mjs';

test('classifies frozen E2 edge laws', () => {
  assert.equal(classifyEdge('MF:L01:S01','MF:L01:S02'), 'MF_ANGULAR');
  assert.equal(classifyEdge('MF:L01:S72','MF:L01:S01'), 'MF_ANGULAR');
  assert.equal(classifyEdge('MF:L01:S01','MF:L02:S01'), 'MF_RADIAL');
  assert.equal(classifyEdge('MF:L06:S08','CG:01'), 'MF_CG');
  assert.equal(classifyEdge('CG:09','CG:01'), 'CG_CG');
  assert.equal(classifyEdge('CR:D:12','CR:D:01'), 'CR_D_CYCLE');
});

test('rejects unresolved MF to CR edge', () => {
  assert.throws(() => classifyEdge('MF:L01:S01','CR:D:01'), /illegal frozen edge/);
});

test('extracts a pure MF angular family', () => {
  const path = Array.from({length:12}, (_,i) => `MF:L01:S${String(i+1).padStart(2,'0')}`);
  const gfv = extractGlyphFeatureVector({identityId:'TEST:MF-ANGULAR', path});
  assert.equal(gfv.component, 'MF_CG');
  assert.equal(gfv.features.edgeClassCounts.MF_ANGULAR, 11);
  assert.equal(gfv.features.edgeClassCounts.MF_RADIAL, 0);
  assert.equal(gfv.features.radial.span, 0);
  assert.equal(gfv.features.angular.sectorSpanCircular, 11);
  assert.equal(gfv.features.symmetry.geometricGroup, 'D9');
  assert.equal(gfv.authority, 'STRUCTURAL_ONLY');
});

test('extracts the CR:D Hamiltonian simple path family', () => {
  const path = Array.from({length:12}, (_,i) => `CR:D:${String(i+1).padStart(2,'0')}`);
  const gfv = extractGlyphFeatureVector({identityId:'TEST:CR-D', path});
  assert.equal(gfv.component, 'CR_D');
  assert.equal(gfv.features.namespaceCounts.CR_D, 12);
  assert.equal(gfv.features.edgeClassCounts.CR_D_CYCLE, 11);
  assert.equal(gfv.features.symmetry.geometricGroup, 'D12');
});

test('rejects repeated-address walks because E5 corpus is simple-path only', () => {
  const path = ['MF:L01:S01', ...Array.from({length:10}, (_,i) => `MF:L01:S${String(i+2).padStart(2,'0')}`), 'MF:L01:S01'];
  assert.throws(() => extractGlyphFeatureVector({identityId:'BAD', path}), /simple path/);
});
