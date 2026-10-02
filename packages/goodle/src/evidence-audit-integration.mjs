import { createEvidenceAuditRecord, appendEvidenceAuditRecord } from './evidence-audit-store.mjs';

export function persistDispatchReceipt(store, dispatch = {}) {
  if (dispatch?.status !== 'ACCEPTED' || dispatch?.receipt?.status !== 'DISPATCH_ACCEPTED') {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  return appendEvidenceAuditRecord(store, createEvidenceAuditRecord({
    receipt: dispatch.receipt, state: 'DISPATCH_ACCEPTED',
  }));
}

export function persistExecutionEvidence(store, evidenceResult = {}) {
  if (evidenceResult?.status !== 'OBSERVED_EXECUTION' || !evidenceResult.evidence) {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  return appendEvidenceAuditRecord(store, createEvidenceAuditRecord({
    evidence: evidenceResult.evidence, state: 'OBSERVED_EXECUTION',
  }));
}

export function persistFinalizedReceipt(store, finalized = {}) {
  if (finalized?.status !== 'FINALIZED' || finalized.receipt?.status !== 'EXECUTION_VERIFIED') {
    return Object.freeze({ status: 'REJECTED', record: null });
  }
  return appendEvidenceAuditRecord(store, createEvidenceAuditRecord({
    receipt: finalized.receipt, state: 'EXECUTION_VERIFIED',
  }));
}