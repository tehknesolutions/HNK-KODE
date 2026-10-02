function reject() {
  return Object.freeze({
    status: 'REJECTED',
    receipt: null,
  });
}

export function dispatchTargetManifestation(routed = {}) {
  if (
    routed?.status !== 'ROUTED' ||
    !routed?.request ||
    !routed?.plan ||
    !routed?.provenance
  ) {
    return reject();
  }

  const p = routed.provenance;
  const r = routed.request;

  if (
    !r.semanticId ||
    r.semanticId !== p.semanticId ||
    r.target !== p.target ||
    r.format !== p.format ||
    r.adapter !== p.adapter ||
    r.artifact !== p.artifact ||
    p.authority !== routed.capability?.authority ||
    p.capabilityId !== routed.capability?.inventoryId
  ) {
    return reject();
  }

  const receipt = Object.freeze({
    status: 'DISPATCH_ACCEPTED',
    executionEvidence: 'UNVERIFIED',
    semanticId: r.semanticId,
    target: r.target,
    format: r.format,
    adapter: r.adapter,
    artifact: r.artifact,
    authority: p.authority,
    capabilityId: p.capabilityId,
    capabilitySource: p.capabilitySource,
  });

  return Object.freeze({
    status: 'ACCEPTED',
    receipt,
  });
}
