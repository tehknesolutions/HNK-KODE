import test from 'node:test';
import assert from 'node:assert/strict';

import { interpretAcquisition } from '../src/acquisition-interpretation.mjs';

const CRITERIA = Object.freeze({
  version: 'ASP-V1-CRITERIA-001',
  minimumHoldoutN: 8,
  structuralRT: 0.7,
  productivePT: 0.6,
  maxRPG: 0.25,
});

const curve = (n, RT, PT) => Object.freeze([
  Object.freeze({ distance: 4, n, RT, PT }),
]);

test('interpretation reports insufficient evidence below preregistered holdout n', () => {
  const result = interpretAcquisition({ RT: 1, PT: 1, RPG: 0, curve: curve(7, 1, 1) }, CRITERIA);
  assert.equal(result.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(result.criteriaVersion, CRITERIA.version);
});

test('recognition transfer without productive transfer is structural transfer', () => {
  const result = interpretAcquisition({ RT: 0.8, PT: 0.4, RPG: 0.4, curve: curve(8, 0.8, 0.4) }, CRITERIA);
  assert.equal(result.classification, 'STRUCTURAL_TRANSFER_OBSERVED');
});

test('productive transfer requires preregistered PT and RPG criteria', () => {
  const result = interpretAcquisition({ RT: 0.85, PT: 0.7, RPG: 0.15, curve: curve(8, 0.85, 0.7) }, CRITERIA);
  assert.equal(result.classification, 'PRODUCTIVE_TRANSFER_OBSERVED');
});

test('performance below structural transfer criterion remains memorization compatible', () => {
  const result = interpretAcquisition({ RT: 0.5, PT: 0.25, RPG: 0.25, curve: curve(8, 0.5, 0.25) }, CRITERIA);
  assert.equal(result.classification, 'MEMORIZATION_COMPATIBLE');
});

test('interpretation rejects criteria derived from holdout outcomes', () => {
  assert.throws(
    () => interpretAcquisition(
      { RT: 1, PT: 1, RPG: 0, curve: curve(8, 1, 1) },
      { ...CRITERIA, calibratedWithHoldout: true },
    ),
    /holdout/i,
  );
});

test('interpretation requires a versioned criteria artifact and returns immutable output', () => {
  assert.throws(
    () => interpretAcquisition({ RT: 1, PT: 1, RPG: 0, curve: curve(8, 1, 1) }, { ...CRITERIA, version: '' }),
    /version/i,
  );
  assert.equal(Object.isFrozen(
    interpretAcquisition({ RT: 0.5, PT: 0.25, RPG: 0.25, curve: curve(8, 0.5, 0.25) }, CRITERIA),
  ), true);
});
