import test from 'node:test';
import assert from 'node:assert/strict';
import { assignments } from '../src/morphological-roles-v0.8.mjs';
import { resolveRoleAwareAlias } from '../src/role-aware-aliases-v0.8.mjs';
import { toRoleBlock, fromRoleBlock } from '../src/morphological-blocks-v0.8.mjs';

for(const role of ['ACTION','ENTITY','STATE','DATA','AGENT','OPERATOR','COLLECTION','TARGET']) test(`round-trip preserves ${role}`,()=>{
  const row=assignments.find(x=>x.role===role);
  const rec=resolveRoleAwareAlias(row.selected,'HNK');
  const block=toRoleBlock(rec);
  const out=fromRoleBlock(block,'EN');
  assert.equal(out.semanticId,row.semanticId); assert.equal(out.role,role); assert.equal(out.familyId,row.familyId);
});

test('block contains required role metadata and children',()=>{
  const block=toRoleBlock(resolveRoleAwareAlias('MAVU'));
  for(const k of ['semanticId','role','familyId','surfaceLanguage','surfaceForm','children']) assert.ok(k in block);
});