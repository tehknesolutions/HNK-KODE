import test from 'node:test';
import assert from 'node:assert/strict';

import { createAcquisitionRun } from '../src/acquisition-end-to-end.mjs';
import { createEvidenceLedger, appendEvidence } from '../src/acquisition-evidence-ledger.mjs';

const materials = Object.freeze({
  train: Object.freeze([]), holdout: Object.freeze([]), contrasts: Object.freeze([]),
});
const versions = Object.freeze({
  protocolVersion: 'ASP-V1', dataVersion: 'FEC-V1', criteriaVersion: 'ASP-V1-CRITERIA-001',
});

test('run records protocol, data, and criteria versions', () => {
  const run = createAcquisitionRun({ participantId: 'P-001', sessionId: 'S-001', materials, versions });
  assert.deepEqual(run.versions, versions);
  assert.equal(Object.isFrozen(run.versions), true);
});

test('raw evidence requires version traceability', () => {
  const event = {
    participantId: 'P-001', sessionId: 'S-001', phase: 'CONTRAST', stimulusId: 'C-001',
    response: 'different', responseTimeMs: 800, structuralDistance: 2,
    presentationOrder: 1, timestamp: '2026-09-29T12:00:00.000Z', sequenceOrder: 1,
    ...versions,
  };
  const ledger = appendEvidence(createEvidenceLedger(), event);
  assert.equal(ledger[0].protocolVersion, 'ASP-V1');
  assert.equal(ledger[0].dataVersion, 'FEC-V1');
  assert.equal(ledger[0].criteriaVersion, 'ASP-V1-CRITERIA-001');

  for (const field of ['protocolVersion', 'dataVersion', 'criteriaVersion']) {
    const invalid = { ...event };
    delete invalid[field];
    assert.throws(() => appendEvidence(createEvidenceLedger(), invalid), new RegExp(field, 'i'));
  }
});
