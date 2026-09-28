import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extractGlyphFeatureVector } from '../src/glyph-feature-vector.mjs';

const schema = JSON.parse(await readFile(new URL('../../../spec/kodescript-binding.schema.json', import.meta.url), 'utf8'));

function requiredAtRoot(name) {
  return schema.required.includes(name);
}

test('binding schema requires namespace isolation', () => {
  assert.equal(requiredAtRoot('namespace'), true);
  assert.deepEqual(schema.properties.namespace.enum, ['LANGUAGE','SACRED','GRAMMAR','RUNTIME','SYSTEM','SW','EXPERIMENTAL','RESERVED']);
});

test('binding path contract requires 12 unique typed Mandala addresses', () => {
  const path = schema.properties.glyphIdentity.properties.path;
  assert.equal(path.minItems, 12);
  assert.equal(path.maxItems, 12);
  assert.equal(path.uniqueItems, true);
  assert.match('MF:L06:S72', new RegExp(path.items.pattern));
  assert.match('CG:09', new RegExp(path.items.pattern));
  assert.match('CR:D:12', new RegExp(path.items.pattern));
  assert.doesNotMatch('CR:H:01', new RegExp(path.items.pattern));
});

test('binding requires GFV topology validation PASS', () => {
  const gi = schema.properties.glyphIdentity;
  assert.equal(gi.required.includes('topologyValidation'), true);
  const tv = gi.properties.topologyValidation;
  assert.equal(tv.properties.validator.const, 'GFV-N12');
  assert.equal(tv.properties.status.const, 'PASS');
});

test('GFV runtime rejects syntactically valid but topologically illegal path', () => {
  const path = [
    'MF:L01:S01','MF:L01:S02','MF:L01:S03','MF:L01:S04','MF:L01:S05','MF:L01:S06',
    'MF:L01:S07','MF:L01:S08','MF:L01:S09','MF:L01:S10','MF:L01:S11','MF:L02:S12'
  ];
  assert.throws(() => extractGlyphFeatureVector({ identityId: 'ILLEGAL', path }), /illegal frozen edge/);
});

test('candidate/review/canon authority requires substantive binding branch', () => {
  const rule = schema.allOf[0];
  assert.deepEqual(rule.if.properties.authority.enum, ['HNK_CANDIDATE','HUMAN_REVIEW','HNK_CANON']);
  assert.equal(rule.then.properties.linguisticBinding.anyOf.length, 6);
  for (const branch of rule.then.properties.linguisticBinding.anyOf) {
    const field = branch.required[0];
    assert.equal(branch.properties[field].type, 'string');
    assert.equal(branch.properties[field].minLength, 1);
  }
});
