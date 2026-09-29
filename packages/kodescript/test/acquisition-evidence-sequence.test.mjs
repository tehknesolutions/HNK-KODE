import test from 'node:test';
import assert from 'node:assert/strict';

import { createEvidenceLedger, appendEvidence } from '../src/acquisition-evidence-ledger.mjs';

const event = Object.freeze({
  participantId: 'P-001', sessionId: 'S-001', stimulusId: 'C-001', phase: 'CONTRAST',
  response: 'different', responseTimeMs: 800, presentationOrder: 1,
  structuralDistance: 2, timestamp: '2026-09-29T12:00:00.000Z', sequenceOrder: 1,
  protocolVersion: 'ASP-V1', dataVersion: 'FEC-V1', criteriaVersion: 'ASP-V1-CRITERIA-001',
});

test('raw evidence requires reproducible presentation and sequence metadata', () => {
  assert.equal(appendEvidence(createEvidenceLedger(), event).length, 1);
  for (const field of ['presentationOrder', 'timestamp', 'sequenceOrder']) {
    const invalid = { ...event }; delete invalid[field];
    assert.throws(() => appendEvidence(createEvidenceLedger(), invalid), new RegExp(field, 'i'));
  }
});

test('sequence metadata is validated for deterministic replay', () => {
  assert.throws(() => appendEvidence(createEvidenceLedger(), { ...event, presentationOrder: 0 }), /presentationOrder/i);
  assert.throws(() => appendEvidence(createEvidenceLedger(), { ...event, sequenceOrder: 0 }), /sequenceOrder/i);
  assert.throws(() => appendEvidence(createEvidenceLedger(), { ...event, timestamp: 'not-a-time' }), /timestamp/i);
});

test('a session ledger rejects duplicate or regressing sequence order', () => {
  const ledger = appendEvidence(createEvidenceLedger(), event);
  assert.throws(() => appendEvidence(ledger, { ...event, stimulusId: 'C-002', presentationOrder: 2 }), /sequenceOrder/i);
  assert.throws(() => appendEvidence(ledger, { ...event, stimulusId: 'C-002', presentationOrder: 2, sequenceOrder: 0 }), /sequenceOrder/i);
});
