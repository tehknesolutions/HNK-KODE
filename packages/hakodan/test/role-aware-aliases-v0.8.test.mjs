import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoleAwareAlias } from '../src/role-aware-aliases-v0.8.mjs';

test('HNK PT-BR and EN aliases resolve before role lookup',()=>{
  const h=resolveRoleAwareAlias('MAVU');
  const pt=resolveRoleAwareAlias('mundo');
  const en=resolveRoleAwareAlias('world');
  assert.equal(h.semanticId,'WORLD'); assert.equal(pt.semanticId,'WORLD'); assert.equal(en.semanticId,'WORLD');
  assert.equal(h.role,pt.role); assert.equal(pt.role,en.role);
});

test('PT-BR accents and cedilla normalize without semantic drift',()=>{
  const a=resolveRoleAwareAlias('ação');
  const b=resolveRoleAwareAlias('acao');
  assert.equal(a.semanticId,'ACTION'); assert.equal(b.semanticId,'ACTION'); assert.equal(a.role,b.role);
});

test('unknown surface never derives semantic id from morphology',()=>{
  assert.throws(()=>resolveRoleAwareAlias('KADARA_X'),/UNKNOWN_ALIAS/);
});