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
  'presentationOrder',
  'timestamp',
  'sequenceOrder',
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
  for (const field of ['presentationOrder', 'sequenceOrder']) {
    if (!Number.isInteger(evidence[field]) || evidence[field] < 1) {
      throw new Error(`Evidence field must be a positive integer: ${field}`);
    }
  }
  if (typeof evidence.timestamp !== 'string' || !Number.isFinite(Date.parse(evidence.timestamp))) {
    throw new Error('Evidence field must be a valid timestamp');
  }
  const previous = [...ledger].reverse().find(item => item.sessionId === evidence.sessionId);
  if (previous && evidence.sequenceOrder <= previous.sequenceOrder) {
    throw new Error('sequenceOrder must strictly increase within a session');
  }

  const record = Object.freeze({ ...evidence });
  return Object.freeze([...ledger, record]);
}
