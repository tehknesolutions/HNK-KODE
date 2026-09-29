import test from 'node:test';
import assert from 'node:assert/strict';

import { interpretAcquisition } from '../src/acquisition-interpretation.mjs';

const criteria = Object.freeze({
  version: 'ASP-V1-CRITERIA-001', minimumHoldoutN: 1,
  structuralRT: 0.7, productivePT: 0.6, maxRPG: 0.25,
  calibratedWithHoldout: false,
});
const metrics = Object.freeze({
  RT: 1, PT: 1, RPG: 0,
  protocolVersion: 'ASP-V1', dataVersion: 'FEC-V1',
  curve: Object.freeze([Object.freeze({ distance: 1, n: 1, RT: 1, PT: 1 })]),
});

test('interpretation rejects a G(d) envelope from a different protocol version', () => {
  assert.throws(() => interpretAcquisition({
    ...metrics,
    curveProvenance: { protocolVersion: 'ASP-V2', dataVersion: 'FEC-V1' },
  }, criteria), /protocolVersion.*mismatch/i);
});

test('interpretation rejects a G(d) envelope from a different data version', () => {
  assert.throws(() => interpretAcquisition({
    ...metrics,
    curveProvenance: { protocolVersion: 'ASP-V1', dataVersion: 'FEC-V2' },
  }, criteria), /dataVersion.*mismatch/i);
});

test('matching G(d) provenance remains eligible for interpretation', () => {
  assert.doesNotThrow(() => interpretAcquisition({
    ...metrics,
    curveProvenance: { protocolVersion: 'ASP-V1', dataVersion: 'FEC-V1' },
  }, criteria));
});
