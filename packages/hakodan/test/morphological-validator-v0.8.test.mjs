import test from 'node:test';
import assert from 'node:assert/strict';
import { assignments } from '../src/morphological-roles-v0.8.mjs';
import { validateMorphology } from '../src/morphological-validator-v0.8.mjs';
const row=assignments[0];

test('matching registry morphology validates',()=>{
  const r=validateMorphology(row.semanticId,{role:row.role,familyId:row.familyId});
  assert.equal(r.ok,true); assert.equal(r.semanticId,row.semanticId);
});
test('role and family mismatch diagnose without rewriting semantic id',()=>{
  const r=validateMorphology(row.semanticId,{role:'TARGET',familyId:'BAD'});
  assert.equal(r.ok,false); assert.equal(r.semanticId,row.semanticId);
  assert.ok(r.diagnostics.some(x=>x.startsWith('ROLE_MISMATCH')));
  assert.ok(r.diagnostics.some(x=>x.startsWith('FAMILY_MISMATCH')));
});
test('unknown and malformed inputs diagnose deterministically',()=>{
  assert.equal(validateMorphology('__UNKNOWN__',{}).ok,false);
  assert.equal(validateMorphology(row.semanticId,null).ok,false);
});