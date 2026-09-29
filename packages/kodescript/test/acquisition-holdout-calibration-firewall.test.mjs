import test from 'node:test';
import assert from 'node:assert/strict';

import { assertCalibrationProvenance } from '../src/acquisition-holdout-calibration-firewall.mjs';

const BASE = Object.freeze({
  protocolVersion: 'ASP-V1',
  sourceProtocolVersions: Object.freeze(['ASP-V1']),
});

test('same-version HOLDOUT cannot calibrate thresholds, stimuli, or protocol tuning', () => {
  for (const purpose of ['THRESHOLD_CALIBRATION', 'STIMULUS_SELECTION', 'PROTOCOL_TUNING']) {
    assert.throws(
      () => assertCalibrationProvenance({ ...BASE, purpose, sourcePartition: 'HOLDOUT' }),
      /holdout.*same protocol version/i,
    );
  }
});

test('TRAIN and CONTRAST provenance remain eligible for same-version calibration', () => {
  for (const sourcePartition of ['TRAIN', 'CONTRAST']) {
    assert.doesNotThrow(() => assertCalibrationProvenance({
      ...BASE, purpose: 'THRESHOLD_CALIBRATION', sourcePartition,
    }));
  }
});

test('HOLDOUT from an earlier protocol version requires an explicit new protocol version', () => {
  assert.doesNotThrow(() => assertCalibrationProvenance({
    protocolVersion: 'ASP-V2',
    sourceProtocolVersions: ['ASP-V1'],
    purpose: 'PROTOCOL_TUNING',
    sourcePartition: 'HOLDOUT',
  }));
});

test('mixed provenance containing the current protocol version is rejected', () => {
  assert.throws(() => assertCalibrationProvenance({
    protocolVersion: 'ASP-V2',
    sourceProtocolVersions: ['ASP-V1', 'ASP-V2'],
    purpose: 'STIMULUS_SELECTION',
    sourcePartition: 'HOLDOUT',
  }), /holdout.*same protocol version/i);
});
