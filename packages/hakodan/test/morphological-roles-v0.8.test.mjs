import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLE_IDS, assignments, getRoleForSemanticId, validateRoleAssignment } from '../src/morphological-roles-v0.8.mjs';

test('v0.8 registry has exactly 8 roles and 122 non-canonical assignments', () => {
  assert.equal(ROLE_IDS.length, 8);
  assert.equal(new Set(ROLE_IDS).size, 8);
  assert.equal(assignments.length, 122);
  assert.equal(new Set(assignments.map(x => x.semanticId)).size, 122);
  assert.ok(assignments.every(x => ROLE_IDS.includes(x.role) && x.canon === false));
});

test('lookup and validation are deterministic', () => {
  const first = assignments[0];
  assert.equal(getRoleForSemanticId(first.semanticId), first.role);
  assert.deepEqual(validateRoleAssignment(first), { ok: true, diagnostics: [] });
  const unknown = validateRoleAssignment({ semanticId: '__UNKNOWN__', role: 'ACTION' });
  assert.equal(unknown.ok, false);
  assert.match(unknown.diagnostics[0], /UNKNOWN_SEMANTIC_ID/);
});