import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HNK_CANON_CONTRACT_ID,
  HNK_CANON_RECORDS,
  createHnkCanonConsumerSnapshot,
  hnkCanonSummary,
  validateHnkCanonContract,
} from '../src/index.mjs';

test('recovered canon contract validates its frozen 22-record human-gated corpus', () => {
  const validation = validateHnkCanonContract();
  assert.equal(validation.ok, true, validation.issues.join('; '));
  assert.equal(validation.contract_id, 'HNK_CANON_CONTRACT_V1');
  assert.equal(validation.records, 22);
  assert.equal(HNK_CANON_RECORDS.length, 22);
});

test('canon summary preserves human authority and no machine autopromotion', () => {
  const summary = hnkCanonSummary();
  assert.equal(summary.status, 'HNK_CANON');
  assert.equal(summary.authority, 'HNK_AUTHORED');
  assert.equal(summary.source_records_preserved, true);
  assert.equal(summary.historical_authority_inherited, false);
  assert.equal(summary.human_gate.approval_status, 'APPROVED_BY_HUMAN');
  assert.equal(summary.human_gate.human_decision, true);
  assert.equal(summary.human_gate.machine_can_decide, false);
  assert.equal(summary.human_gate.machine_autopromotion, false);
});

test('consumer snapshot is read-only and bound to the recovered contract', () => {
  const snapshot = createHnkCanonConsumerSnapshot('@hnk/glyphs');
  assert.equal(snapshot.consumer_id, '@hnk/glyphs');
  assert.equal(snapshot.contract_id, HNK_CANON_CONTRACT_ID);
  assert.equal(snapshot.access, 'READ_ONLY');
  assert.equal(snapshot.records.length, 22);
});
