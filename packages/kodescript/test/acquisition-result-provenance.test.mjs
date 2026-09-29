import test from 'node:test';
import assert from 'node:assert/strict';

import { computeSessionMetrics } from '../src/acquisition-session-metrics.mjs';
import { interpretAcquisition } from '../src/acquisition-interpretation.mjs';

const versions = Object.freeze({
  protocolVersion: 'ASP-V1',
  dataVersion: 'FEC-V1',
  criteriaVersion: 'ASP-V1-CRITERIA-001',
});

const scores = Object.freeze({
  recognition: Object.freeze([1, 1]),
  production: Object.freeze([1, 0]),
  contrast: Object.freeze([1, 1]),
});

test('derived session metrics identify protocol and data versions', () => {
  const metrics = computeSessionMetrics(scores, versions);
  assert.equal(metrics.protocolVersion, versions.protocolVersion);
  assert.equal(metrics.dataVersion, versions.dataVersion);
});

test('interpretation result identifies protocol, data, and criteria versions', () => {
  const metrics = {
    ...computeSessionMetrics(scores, versions),
    curve: [{ n: 2 }],
  };
  const criteria = {
    version: versions.criteriaVersion,
    minimumHoldoutN: 2,
    productivePT: 0.5,
    maxRPG: 0.5,
    structuralRT: 0.8,
    calibratedWithHoldout: false,
  };
  const result = interpretAcquisition(metrics, criteria);
  assert.equal(result.protocolVersion, versions.protocolVersion);
  assert.equal(result.dataVersion, versions.dataVersion);
  assert.equal(result.criteriaVersion, versions.criteriaVersion);
});
