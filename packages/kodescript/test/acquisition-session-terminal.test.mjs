import test from 'node:test';
import assert from 'node:assert/strict';

import { createAcquisitionSession, transitionAcquisitionSession, PHASES } from '../src/acquisition-session-protocol.mjs';

test('session phase state is immutable and follows the exact frozen sequence', () => {
  let session = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  assert.equal(Object.isFrozen(session), true);
  for (const phase of PHASES.slice(1)) {
    session = transitionAcquisitionSession(session, phase);
    assert.equal(session.phase, phase);
    assert.equal(Object.isFrozen(session), true);
  }
  assert.equal(session.phase, 'FEEDBACK');
});

test('FEEDBACK is terminal and cannot transition or mutate backward', () => {
  let session = createAcquisitionSession({ participantId: 'P-001', sessionId: 'S-001' });
  for (const phase of PHASES.slice(1)) session = transitionAcquisitionSession(session, phase);
  assert.throws(() => transitionAcquisitionSession(session, 'BASELINE'), /invalid protocol transition/i);
  assert.throws(() => transitionAcquisitionSession(session, 'FEEDBACK'), /invalid protocol transition/i);
  assert.equal(session.phase, 'FEEDBACK');
});
