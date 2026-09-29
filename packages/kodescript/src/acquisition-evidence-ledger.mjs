const REQUIRED_FIELDS = Object.freeze([
  'participantId',
  'sessionId',
  'phase',
  'stimulusId',
  'response',
  'responseTimeMs',
  'structuralDistance',
  'protocolVersion',
  'dataVersion',
  'criteriaVersion',
]);

export function createEvidenceLedger() {
  return Object.freeze([]);
}

export function appendEvidence(ledger, evidence) {
  for (const field of REQUIRED_FIELDS) {
    if (!(field in evidence)) {
      throw new Error(`Missing evidence field: ${field}`);
    }
  }

  for (const field of ['responseTimeMs', 'structuralDistance']) {
    if (!Number.isFinite(evidence[field])) {
      throw new Error(`Evidence field must be finite: ${field}`);
    }
  }

  const record = Object.freeze({ ...evidence });
  return Object.freeze([...ledger, record]);
}
