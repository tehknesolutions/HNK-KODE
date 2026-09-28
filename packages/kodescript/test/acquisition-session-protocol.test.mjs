import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PHASES,
  createAcquisitionSession,
  transitionAcquisitionSession,
} from '../src/acquisition-session-protocol.mjs';

const ORDER = [
  'BASELINE',
  'ACQUISITION',
  'CONTRAST',
  'RECOGNITION_TRANSFER',
  'PRODUCTION_TRANSFER',
  'FEEDBACK',
];

test('protocol exposes the frozen progressive phase order', () => {
  assert.deepEqual(PHASES, ORDER);
});

test('new sessions start at BASELINE with stable identifiers', () => {
  const session = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  assert.equal(session.participantId, 'P-001');
  assert.equal(session.sessionId, 'S-001');
  assert.equal(session.phase, 'BASELINE');
});

test('session advances only through the next progressive phase', () => {
  let session = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  for (const phase of ORDER.slice(1)) {
    session = transitionAcquisitionSession(session, phase);
    assert.equal(session.phase, phase);
  }
});

test('protocol rejects phase skips and regressions', () => {
  const baseline = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  assert.throws(
    () => transitionAcquisitionSession(baseline, 'CONTRAST'),
    /invalid protocol transition/i,
  );

  const acquisition = transitionAcquisitionSession(baseline, 'ACQUISITION');
  assert.throws(
    () => transitionAcquisitionSession(acquisition, 'BASELINE'),
    /invalid protocol transition/i,
  );
});

test('feedback cannot occur before production transfer', () => {
  let session = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  session = transitionAcquisitionSession(session, 'ACQUISITION');
  session = transitionAcquisitionSession(session, 'CONTRAST');
  session = transitionAcquisitionSession(session, 'RECOGNITION_TRANSFER');

  assert.throws(
    () => transitionAcquisitionSession(session, 'FEEDBACK'),
    /invalid protocol transition/i,
  );
});
