import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createEvidenceLedger,
  appendEvidence,
} from '../src/acquisition-evidence-ledger.mjs';

const EVENT = Object.freeze({
  participantId: 'P-001',
  sessionId: 'S-001',
  phase: 'RECOGNITION_TRANSFER',
  stimulusId: 'FEC-H-001',
  response: 'same-family',
  responseTimeMs: 1840,
  structuralDistance: 3,
  protocolVersion: 'ASP-V1',
  dataVersion: 'FEC-V1',
  criteriaVersion: 'ASP-V1-CRITERIA-001',
  presentationOrder: 1,
  timestamp: '2026-09-29T12:00:00.000Z',
  sequenceOrder: 1,
});

test('new evidence ledger is empty and immutable', () => {
  const ledger = createEvidenceLedger();
  assert.deepEqual(ledger, []);
  assert.equal(Object.isFrozen(ledger), true);
});

test('append returns a new ledger without rewriting prior evidence', () => {
  const ledger = createEvidenceLedger();
  const next = appendEvidence(ledger, EVENT);
  assert.equal(ledger.length, 0);
  assert.equal(next.length, 1);
  assert.notEqual(next, ledger);
  assert.deepEqual(next[0], EVENT);
});

test('appended evidence and resulting ledger are deeply immutable', () => {
  const next = appendEvidence(createEvidenceLedger(), EVENT);
  assert.equal(Object.isFrozen(next), true);
  assert.equal(Object.isFrozen(next[0]), true);
  assert.throws(() => { next[0].response = 'mutated'; }, TypeError);
});

test('evidence requires the frozen raw experimental fields', () => {
  for (const field of Object.keys(EVENT)) {
    const incomplete = { ...EVENT };
    delete incomplete[field];
    assert.throws(
      () => appendEvidence(createEvidenceLedger(), incomplete),
      new RegExp(field, 'i'),
    );
  }
});

test('evidence rejects non-finite timing and structural distance', () => {
  assert.throws(
    () => appendEvidence(createEvidenceLedger(), { ...EVENT, responseTimeMs: NaN }),
    /responseTimeMs/i,
  );
  assert.throws(
    () => appendEvidence(createEvidenceLedger(), { ...EVENT, structuralDistance: Infinity }),
    /structuralDistance/i,
  );
});
