export function closeProvenanceImpact(diff = {}, impactResult = {}) {
  if (!diff?.direct || !diff?.ancestors || impactResult?.status !== 'ANALYZED' || !impactResult.impact) return Object.freeze({ status:'REJECTED', summary:null, reason:'INVALID_INPUT' });
  const impact=impactResult.impact;
  const unresolved=[];
  if ((diff.direct.added?.length ?? 0) || (diff.direct.removed?.length ?? 0)) unresolved.push('DIRECT_PARENT_CHANGE');
  if ((diff.ancestors.added?.length ?? 0) || (diff.ancestors.removed?.length ?? 0)) unresolved.push('TRANSITIVE_ANCESTRY_CHANGE');
  if (diff.direct.orderingChanged) unresolved.push('PARENT_ORDER_CHANGE');
  const summary=Object.freeze({ version:'m29-v1', changedSources:Object.freeze([...(impact.changedSources??[])]), directChildren:Object.freeze([...(impact.directChildren??[])]), transitiveDescendants:Object.freeze([...(impact.transitiveDescendants??[])]), orderingChanged:!!impact.orderingChanged, unresolved:Object.freeze(unresolved.sort()) });
  return Object.freeze({ status:'CLOSED', summary });
}