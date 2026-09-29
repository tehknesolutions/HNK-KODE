import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const registryUrl=new URL('../data/canon/hnk-lexical-glyph-registry.v1.json',import.meta.url);
const registry=JSON.parse(await readFile(registryUrl,'utf8'));

test('V1 canonical lexical glyph registry freezes five bindings',()=>{
  assert.equal(registry.status,'HNK_CANON');
  assert.equal(registry.bindings.length,5);
  assert.deepEqual(registry.bindings.map(x=>x.lexeme),['AHNUVA','EMANU','HAYA','HODERU','KODAN']);
});

test('canonical IDs, mathematical identities and codepoints are unique',()=>{
  for(const field of ['glyphId','mathematicalIdentityId']){
    assert.equal(new Set(registry.bindings.map(x=>x[field])).size,5);
  }
  assert.equal(new Set(registry.bindings.map(x=>x.codePoint.unicode)).size,5);
});

test('every canonical lexical glyph remains an N=12 simple path',()=>{
  for(const row of registry.bindings){
    assert.equal(row.path.length,12,row.lexeme);
    assert.equal(new Set(row.path).size,12,row.lexeme);
  }
});

test('PUA V1 is sequential projection only',()=>{
  assert.deepEqual(registry.bindings.map(x=>x.codePoint.unicode),['U+E100','U+E101','U+E102','U+E103','U+E104']);
  assert.equal(registry.allocation.meaningOfOrdinal,'NONE');
});

test('canonical SVG digests match registry',async()=>{
  for(const row of registry.bindings){
    const url=new URL('../assets/canonical/lexical-glyphs/'+row.glyphId+'-'+row.lexeme+'.svg',import.meta.url);
    const bytes=await readFile(url);
    const digest=createHash('sha256').update(bytes).digest('hex');
    assert.equal(digest,row.svgSha256,row.lexeme);
  }
});