import test from 'node:test';
import assert from 'node:assert/strict';
import { assignments } from '../src/morphological-roles-v0.8.mjs';
import { generateRoleCandidates, scoreRoleCandidate } from '../src/morphological-generator-v0.8.mjs';
const frozen = new Set(['AHNUVA','EMANU','HAYA','HODERU','KODAN']);

test('generator is deterministic and role-aware', () => {
  const row = assignments.find(x => x.semanticId === 'CREATE');
  assert.deepEqual(generateRoleCandidates(row), generateRoleCandidates(row));
  assert.equal(generateRoleCandidates(row).length, 3);
});

test('scoring exposes required dimensions', () => {
  const row = assignments[0];
  const c = generateRoleCandidates(row)[0];
  const s = scoreRoleCandidate(c, row);
  for (const key of ['roleRegularity','familyCoherence','compactness','distinctness','separation']) assert.equal(typeof s[key], 'number');
});

test('generated forms never overwrite frozen canon', () => {
  for (const row of assignments) for (const c of generateRoleCandidates(row)) assert.equal(frozen.has(c.form), false);
});