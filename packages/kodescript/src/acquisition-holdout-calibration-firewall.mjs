const BLOCKED_PURPOSES = new Set([
  'THRESHOLD_CALIBRATION',
  'STIMULUS_SELECTION',
  'PROTOCOL_TUNING',
]);

export function assertCalibrationProvenance(provenance) {
  const {
    protocolVersion,
    sourceProtocolVersions,
    purpose,
    sourcePartition,
  } = provenance ?? {};

  const sameVersionHoldout = sourcePartition === 'HOLDOUT'
    && BLOCKED_PURPOSES.has(purpose)
    && Array.isArray(sourceProtocolVersions)
    && sourceProtocolVersions.includes(protocolVersion);

  if (sameVersionHoldout) {
    throw new Error('HOLDOUT cannot influence calibration for the same protocol version');
  }

  return true;
}
